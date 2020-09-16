const { createRemoteFileNode } = require('gatsby-source-filesystem');

const withPluginOptions = require('../../plugin-options');

const onCreateNode = async (
  { node, actions: { createNode }, createNodeId, store, cache },
  pluginOptions
) => {
  const { downloadImageAssets } = withPluginOptions(pluginOptions);

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

module.exports = onCreateNode;
