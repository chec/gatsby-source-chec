exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const {
    data: { products },
  } = await graphql(`
    {
      products: allChecProduct {
        nodes {
          id
          permalink
        }
      }
    }
  `);

  products.nodes.forEach(({ id, permalink }) =>
    createPage({
      path: `/products/${permalink}`,
      component: require.resolve(`./src/templates/ProductPage.js`),
      context: {
        id,
      },
    })
  );
};
