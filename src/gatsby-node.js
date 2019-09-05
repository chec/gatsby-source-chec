import axios from 'axios';
import configSchema from './configSchema';
import makeProductNode from './makeProductNode';

// Validate that the user has configured appropriate options
exports.onPreBootstrap = ({ reporter }, options) => {
  console.log(options);
  const result = configSchema.validate(options, { abortEarly: false });
  if (result.error) {
    const errors = {};
    result.error.details.forEach(detail => {
      errors[detail.path[0]] = detail.message
    });
    console.error(errors);
    reporter.panic(`Problems with gatsby-source-chec plugin options...`);
    // TODO Fill in error detail parsed above
  }
};

exports.sourceNodes = async ({ actions }, options ) => {
  const url = options.url || 'https://api.chec.io/v1/';
  const { createNode } = actions;

  const { data: { data: products } } = await axios.get(`${url}products`, { headers: { 'X-Authorization': options.token } });

  products.forEach(product => {
    createNode(makeProductNode(product));
  });
};