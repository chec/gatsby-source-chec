import React from 'react';
import { Link } from 'gatsby';

import Product from './Product';

export default function ProductList({ products }) {
  if (!products) return null;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.permalink}>
          <Link to={`/products/${product.permalink}`}>
            <Product {...product} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
