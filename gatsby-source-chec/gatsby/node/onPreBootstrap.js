const withPluginOptions = require('../../plugin-options');

const onPreBootstrap = ({ reporter }, pluginOptions) => {
  const { publicKey } = withPluginOptions(pluginOptions);

  if (!publicKey)
    return reporter.panicOnBuild(
      `@chec/gatsby-source-chec: You must provide a 'publicKey' for your Chec store`
    );
};

module.exports = onPreBootstrap;
