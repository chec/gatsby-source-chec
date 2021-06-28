exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const { data } = await graphql(`
    {
      products: allChecProduct {
        nodes {
          id
          permalink
        }
      }

      categories: allChecCategory {
        nodes {
          id
          slug
        }
      }
    }
  `);

  data &&
    data.products.nodes.forEach(({ id, permalink }) =>
      createPage({
        path: `/products/${permalink}`,
        component: require.resolve(`./src/templates/ProductPage.js`),
        context: {
          id,
        },
      })
    );

  data &&
    data.categories.nodes.forEach(({ id, slug }) =>
      createPage({
        path: `/categories/${slug}`,
        component: require.resolve(`./src/templates/CategoryPage.js`),
        context: {
          id,
        },
      })
    );
};
