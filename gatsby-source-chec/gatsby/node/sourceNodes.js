const { Chec } = require('chec-request');

const sourceNodes = async (
  { actions, createContentDigest, reporter },
  { publicKey }
) => {
  if (!publicKey)
    return reporter.panicOnBuild(
      `gatsby-source-chec: You must provide a 'publicKey' for your Chec store`
    );

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
      reporter.panicOnBuild('gatsby-source-chec', err);
    }
  };

  const { id: merchantId, ...merchant } = await commerce.get('merchants');
  const categories = await fetchAllPages('categories');
  const products = await fetchAllPages('products');

  createNode({
    id: merchantId.toString(),
    ...merchant,
    internal: {
      type: `ChecMerchant`,
      content: JSON.stringify(merchant),
      contentDigest: createContentDigest(merchant),
    },
  });

  categories.forEach((category) =>
    createNode({
      ...category,
      internal: {
        type: `ChecCategory`,
        content: JSON.stringify(category),
        contentDigest: createContentDigest(category),
      },
    })
  );

  products.forEach((product) => {
    createNode({
      ...product,
      internal: {
        type: `ChecProduct`,
        content: JSON.stringify(product),
        contentDigest: createContentDigest(product),
      },
    });
  });
};

module.exports = sourceNodes;
