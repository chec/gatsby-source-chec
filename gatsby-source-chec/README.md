# @chec/gatsby-source-chec

🛍 Gatsby plugin for sourcing products, categories and merchant info from your Chec store.


## Install

```bash
yarn add @chec/gatsby-source-chec # npm install @chec/gatsby-source-chec
```

## Config

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: `@chec/gatsby-source-chec`,
    options: {
      publicKey: '...',
      downloadImageAssets: true, // false by default
    },
  },
];
```

## Usage

```graphql
{
  checMerchant {
    id
    business_name
  }

  allChecCategory {
    nodes {
      name
      slug
      description
      created
      id
    }
  }

  allChecProduct {
    nodes {
      id
      name
      price {
        formatted_with_symbol
      }
    }
  }
}
```

## Downloading image assets

This plugin provides you the option to download product asset images, and cache them in your Gatsby project. This works great with [`gatsby-plugin-image`](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/).

Add `downloadImageAssets: true` to your plugin options.

These assets will be added as `images` to the `product` nodes.


```graphql
  product: checProduct(id: { eq: $id }) {
    id
    name
    price {
      formatted_with_symbol
    }
    images {
      childImageSharp {
        gatsbyImageData
      }
    }
  }
```

## ⚠️ Note

### This repository is no longer maintained
However, we will accept issue reports and contributions for this repository. See the [contribute to the commerce community](https://commercejs.com/docs/community/contribute) page for more information on how to contribute to our open source projects. For update-to-date APIs, please check the latest version of the [API documentation](https://commercejs.com/docs/api/).
