# @chec/gatsby-source-chec

🛍 Gatsby plugin for sourcing products, categories and merchant info from your Chec store

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
      downloadLocalImages: true,
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
