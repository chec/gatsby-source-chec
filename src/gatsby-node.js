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
  const { url } = resolveConfig(options);
  const { createNode } = actions;

  const { data: { data: products } } = await axios.get(`${url}products`, { headers: { 'X-Authorization': options.token } });

  products.forEach(product => {
    createNode(makeProductNode(product));
  });
};

// Find fields that are references to a Chec product and link them
exports.onCreateNode = async ({ node, actions, getNodesByType }, options) => {
  const { resolvableFields, resolvableNodeWhitelist } = resolveConfig(options);
  const { internal: { type }} = node;
  const { createNodeField } = actions;

  // Check the whitelist if set
  if (Array.isArray(resolvableNodeWhitelist) && !resolvableNodeWhitelist.includes(type)) {
    return;
  }

  // Loop the various nodes and create linkages if found on the current node
  // Products:
  const existingNodes = await getNodesByType('ChecProduct');

  resolvableFields.products.forEach(({ field, type, name }) => {
    debugger;

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