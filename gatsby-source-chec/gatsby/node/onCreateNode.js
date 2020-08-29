const { createRemoteFileNode } = require('gatsby-source-filesystem');

const onCreateNode = async (
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

        try {
          const imageNode = await createRemoteFileNode({
            url: encodeURI(asset.url),
            store,
            cache,
            createNode,
            createNodeId,
          });

          if (imageNode) assetIds.push(imageNode.id);
        } catch (e) {
          console.error('gatsby-source-chec: ERROR', e);
        }
      });

      await Promise.all(fetchImageAssets);

      return assetIds;
    };

    node.images = await getImageAssets();
  }
};

module.exports = onCreateNode;
