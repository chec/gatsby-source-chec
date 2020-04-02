import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

const pageQuery = graphql`
  {
    merchant: checMerchant {
      name: business_name
    }

    products: allChecProduct {
      nodes {
        name
        permalink
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
          <li key={product.permalink}>
            <Link to={`/products/${product.permalink}`}>
              {product.name}: {product.price.formatted_with_symbol}
            </Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default IndexPage;
