require('dotenv').config();

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-chec',
      options: {
        publicKey: process.env.CHEC_PUBLIC_KEY,
      },
    },
  ],
};
