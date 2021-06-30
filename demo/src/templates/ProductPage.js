import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export default function ProductPage({ data: { product } }) {
  const { name, price, images } = product;
  const [mainImage] = images;

  return (
    <React.Fragment>
      {mainImage && <GatsbyImage image={getImage(mainImage)} alt={name} />}
      <h1>{name}</h1>
      <p>{price.formatted_with_symbol}</p>
    </React.Fragment>
  );
}

export const pageQuery = graphql`
  query ProductPageQuery($id: String!) {
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
  }
`;
