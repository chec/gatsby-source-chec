import React from 'react';
import { graphql } from 'gatsby';

import ProductList from '../components/ProductList';

export default function CategoryPage({ data: { category } }) {
  const { products } = category;

  return (
    <React.Fragment>
      <h1>{category.name}</h1>

      <ProductList products={products} />
    </React.Fragment>
  );
}

export const pageQuery = graphql`
  query CategoryPageQuery($id: String!) {
    category: checCategory(id: { eq: $id }) {
      id
      name
      products {
        name
        permalink
        price {
          formatted_with_symbol
        }
      }
    }
  }
`;
