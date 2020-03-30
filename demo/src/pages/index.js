import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

const pageQuery = graphql`
  {
    merchant: checMerchant {
      name: business_name
    }

    products: allChecProduct {
      nodes {
        id
        name
        price {
          formatted_with_symbol
        }
      }
    }
  }
`;

const IndexPage = () => {
  const { merchant, products } = useStaticQuery(pageQuery);

  return (
    <React.Fragment>
      <h1>{merchant.name}</h1>

      <h3>Products</h3>

      <ul>
        {products.nodes.map(product => (
          <li key={product.id}>
            {product.name}: {product.price.formatted_with_symbol}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default IndexPage;
