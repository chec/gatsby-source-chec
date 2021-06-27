const { Chec } = require('chec-request');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    publicKey: Joi.string()
      .description(
        'Chec Public API Key - You can be found inside Developer > API Keys'
      )
      .required(),
    downloadImageAssets: Joi.boolean()
      .description(
        'Download and cache Chec image assets in your Gatsby project'
      )
      .default(false),
  });
};

exports.sourceNodes = async (
  { actions, createContentDigest, reporter },
  { publicKey }
) => {
  const { createNode } = actions;

  const commerce = new Chec(publicKey);

  const fetchAllPages = async (endpoint, collection = [], page = undefined) => {
    try {
      const { data = [], meta } = await commerce.get(endpoint, {
        ...(page && { page }),
      });

      if (data.length === 0) return data;

      const {
        pagination: {
          current_page,
          links: { next },
        },
      } = meta;

      const newCollection = [...data, ...collection];

      if (next) {
        await fetchAllPages(endpoint, newCollection, current_page + 1);
      }

      return newCollection;
    } catch (err) {
      reporter.panicOnBuild('@chec/gatsby-source-chec', err);
    }
  };

  const createMerchant = (merchant) =>
    createNode({
      ...merchant,
      id: merchant.id.toString(),
      internal: {
        type: `ChecMerchant`,
        content: JSON.stringify(merchant),
        contentDigest: createContentDigest(merchant),
      },
    });

  const merchant = await commerce.get('merchants');

  let merchants = [];

  if (merchant?.id) {
    merchants = [merchant];
  } else {
    merchants = await fetchAllPages('merchants');
  }

  const categories = await fetchAllPages('categories');
  const products = await fetchAllPages('products');

  merchants.forEach(createMerchant);

  categories.forEach((category) => {
    const productIds = products.reduce((ids, product) => {
      const matchingCategory = product.categories.find(
        (cat) => cat.id === category.id
      );

      if (!matchingCategory) return ids;

      return [...ids, product.id];
    }, []);

    createNode({
      ...category,
      products: productIds,
      internal: {
        type: `ChecCategory`,
        content: JSON.stringify(category),
        contentDigest: createContentDigest(category),
      },
    });
  });

  products.forEach(({ categories, ...product }) => {
    const categoryIds = categories.map(({ id }) => id);

    createNode({
      ...product,
      categories: categoryIds,
      internal: {
        type: `ChecProduct`,
        content: JSON.stringify(product),
        contentDigest: createContentDigest(product),
      },
    });
  });
};

exports.onCreateNode = async (
  { node, actions: { createNode }, createNodeId, store, cache },
  { downloadImageAssets }
) => {
  node.images = [];

  if (
    downloadImageAssets &&
    node.internal.type === 'ChecProduct' &&
    node.assets
  ) {
    const getImageAssets = async () => {
      const assetIds = [];

      const processImageAssets = node.assets.map(async (asset) => {
        if (!asset.is_image) return;

        try {
          const imageNode = await createRemoteFileNode({
            url: encodeURI(asset.url),
            store,
            cache,
            createNode,
            createNodeId,
            parentNodeId: node.id,
          });

          if (imageNode) assetIds.push(imageNode.id);
        } catch (e) {
          console.error('gatsby-source-chec: ERROR', e);
        }
      });

      await Promise.all(processImageAssets);

      return assetIds;
    };

    node.images = await getImageAssets();
  }
};

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  createTypes(`
    type ChecProduct implements Node {
      categories: [ChecCategory] @link
      images: [File] @link
    }

    type ChecCategory implements Node {
      products: [ChecProduct] @link
    }
  `);
};
