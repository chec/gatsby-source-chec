const { Chec } = require('chec-request');

const sourceNodes = async (
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

module.exports = sourceNodes;
