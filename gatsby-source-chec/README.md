# gatsby-source-chec

🛍 Gatsby plugin for sourcing products, categories and merchant info from your Chec store

## Install

```bash
yarn add gatsby-source-chec
```

## Config

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-chec`,
    options: {
      publicKey: '...',
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
