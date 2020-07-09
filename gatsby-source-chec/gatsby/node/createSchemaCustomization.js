const createSchemaCustomization = ({ actions: { createTypes } }) => {
  createTypes(`
    type ChecProduct implements Node {
      categories: [ChecCategory] @link
    }

    type ChecCategory implements Node {
      products: [ChecProduct] @link
    }
  `);
};

module.exports = createSchemaCustomization;
