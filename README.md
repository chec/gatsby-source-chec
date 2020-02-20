# gatsby-source-chec
Gatsby plugin for sourcing products from your Chec store. More docs coming soon (tm)

## Usage:

In `gatsby-config.js`:

```
{
  resolve: 'gatsby-source-chec',
  options: {
    token: 'YOUR_CHEC_API_TOKEN',
  }
}
```

For generating product pages, you can add this config to `options`:

```
pages: [{
  componentPath: path.resolve('src/path/to/page.js'),
  segment: 'products',
  type: 'products',
}]
```

In the page at `src/path/to/page.js`, the `pageContext` prop will include a `product` attribute with 
the product details. See the example response in the [Commerce.js API docs](https://commercejs.com/docs/api/#get-product) 
for example product schema.
