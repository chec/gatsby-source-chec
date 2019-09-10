import axios from 'axios';
import configSchema from './configSchema';
import makeProductNode from './makeProductNode';
import resolveConfig from './configProvider';

// Validate that the user has configured appropriate options
exports.onPreBootstrap = ({ reporter }, options) => {
  const result = configSchema.validate(options, { abortEarly: false });
  if (result.error) {
    const errors = {};
    result.error.details.forEach(detail => {
      errors[detail.path[0]] = detail.message
    });
    reporter.panic(`Problems with gatsby-source-chec plugin options...`);
    // TODO Fill in error detail parsed above
  }
};

exports.sourceNodes = async ({ actions }, options ) => {
  const { url, typeNames } = resolveConfig(options);
  const { createNode } = actions;

  const { data: { data: products } } = await axios.get(`${url}products`, { headers: { 'X-Authorization': options.token } });

  products.forEach(product => {
    createNode(makeProductNode(product, typeNames.products));
  });
};

// Find fields that are references to a Chec product and link them
exports.onCreateNode = async ({ node, actions, getNodesByType }, options) => {
  const { resolvableFields, resolvableNodeWhitelist, typeNames } = resolveConfig(options);
  const { internal: { type }} = node;
  const { createNodeField } = actions;

  // Check the whitelist if set
  if (Array.isArray(resolvableNodeWhitelist) && !resolvableNodeWhitelist.includes(type)) {
    return;
  }

  // Loop the various nodes and create linkages if found on the current node
  // Products:
  const existingNodes = await getNodesByType(typeNames.products);

  resolvableFields.products.forEach(({ field, type, name }) => {
    if (!node.hasOwnProperty(field)) {
      return;
    }

    const matchedIdentifier = node[field];
    if (!matchedIdentifier) {
      return;
    }

    const matchedNode = existingNodes.find(({ id, permalink }) => {
      switch (type) {
        case 'id':
          return id === matchedIdentifier;
        case 'permalink':
          return permalink === matchedIdentifier || permalink === matchedIdentifier.split('/').pop();
      }

      return false;
    });


    if (!matchedNode) {
      return;
    }

    createNodeField({
      node,
      name: `${name}___NODE`,
      value: matchedNode.id
    });
  });
};

const defaultQueryFields = {
  products: ['id', 'permalink', 'name'],
};

exports.createPages = async ({ graphql, actions, reporter }, options) => {
  const { typeNames, pages } = resolveConfig(options);
  const { createPage } = actions;

  // Loop keys in page config...
  const promises = pages.map(async ({type, componentPath, segment, fields, slugCreator}) => {
    if (!typeNames.hasOwnProperty(type)) {
      console.log(`Cannot find a Chec type matching "${type}. Skipping`);
      return;
    }

    const queryType = `all${typeNames[type]}`;
    const result = await graphql(`
      {
        ${queryType}(limit: 1000) {
          edges {
            node {
             ${fields || defaultQueryFields[type]}
            }
          }
        }
      }
    `);

    const promises = result.data[queryType].edges.map(async ({ node: item }) => {
      const slug = slugCreator
        ? slugCreator(item)
        : item.permalink;
      const path = `${segment}/${slug}`;

      await createPage({
        path,
        component: componentPath,
        context: {
          ...item
        }
      });
    });
  });

  await Promise.all(promises);
};