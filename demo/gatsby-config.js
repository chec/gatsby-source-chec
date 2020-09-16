require('dotenv').config();

module.exports = {
  plugins: [
    'gatsby-plugin-sharp',
    {
      resolve: '@chec/gatsby-source-chec',
      options: {
        publicKey:
          process.env.CHEC_PUBLIC_KEY ||
          'pk_184625ed86f36703d7d233bcf6d519a4f9398f20048ec',
        downloadImageAssets: true,
      },
    },
    'gatsby-transformer-sharp',
  ],
};
