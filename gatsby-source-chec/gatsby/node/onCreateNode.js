const { createRemoteFileNode } = require('gatsby-source-filesystem');

const sourceNodes = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
  getNode,
}) => {
  const { createNode } = actions;

  if (node.internal.type === `ChecProduct` && node.logo) {
    let logoNode;
  }

  //   if (
  //     node.internal.type === `ChecProduct` &&
  //     node.media &&
  //     node.media.source &&
  //     node.media.type === 'image'
  //   ) {
  //     let mediaNode;

  //     try {
  //       mediaNode = await createRemoteFileNode({
  //         url: node.media.source,
  //         store,
  //         cache,
  //         createNode,
  //         createNodeId,
  //         parentNodeId: node.internal.id
  //       });
  //     } catch (err) {
  //       console.error('gatsby-source-chec: ERROR', err);
  //     }

  //     if (mediaNode) {
  //       node.image___NODE = mediaNode.id;
  //     }
  //   }

  //   // if (node.internal.type === 'ChecProduct') {
  //   //   const categoryIds = node.categories.map(category => category.id);

  //   //   let categoryNodes = [];

  //   //   await categoryIds.forEach(async id => {
  //   //     const categoryNode = await getNode(id);

  //   //     if (categoryNode) categoryNodes.push(id);
  //   //   });

  //   //   node.categories___NODE = categoryNodes;
  //   // }
};

module.exports = sourceNodes;
