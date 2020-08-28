const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = require('./gatsby/node/sourceNodes');
exports.createSchemaCustomization = require('./gatsby/node/createSchemaCustomization');
exports.onCreateNode = async (
  { node, actions: { createNode }, createNodeId, store, cache },
  { downloadImageAssets = false }
) => {
  if (
    downloadImageAssets &&
    node.internal.type === 'ChecProduct' &&
    node.assets
  ) {
    const getImageAssets = async () => {
      const assetIds = [];

      const fetchImageAssets = node.assets.map(async (asset) => {
        if (!asset.is_image) return;

        let imageNode;

        try {
          imageNode = await createRemoteFileNode({
            url: encodeURI(asset.url),
            store,
            cache,
            createNode,
            createNodeId,
          });
        } catch (e) {
          console.error('gatsby-source-chec: ERROR', e);
        }

        assetIds.push(imageNode.id);
      });

      await Promise.all(fetchImageAssets);

      return assetIds;
    };

    node.images___NODE = await getImageAssets();
  }
};
