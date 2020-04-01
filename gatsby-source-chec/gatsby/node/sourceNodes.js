const { Chec } = require('chec-request');

const sourceNodes = async (
  { actions, createContentDigest, reporter },
  { token }
) => {
  if (!token)
    return reporter.panicOnBuild(
      'gatsby-source-chec: You must provide a token for your Chec store'
    );

  const { createNode } = actions;

  const commerce = new Chec(token);

  const { id: merchantId, ...merchant } = await commerce.get('merchants');
  const { data: categories } = await commerce.get('categories');
  const { data: products } = await commerce.get('products');

  createNode({
    id: merchantId.toString(),
    ...merchant,
    internal: {
      type: `ChecMerchant`,
      content: JSON.stringify(merchant),
      contentDigest: createContentDigest(merchant),
    },
  });

  categories.forEach(category =>
    createNode({
      ...category,
      internal: {
        type: `ChecCategory`,
        content: JSON.stringify(category),
        contentDigest: createContentDigest(category),
      },
    })
  );

  products.forEach(product => {
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
