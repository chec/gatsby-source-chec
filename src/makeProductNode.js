import camelCase from 'camelcase';
const crypto = require(`crypto`);

const digest = str =>
  crypto
    .createHash(`md5`)
    .update(str)
    .digest(`hex`);

const makeProductNode = data => {
  // Mark attributes to skip on the response
  const attributeBlacklist = ['is', 'has', 'collects', 'media'];

  // Destruct some arrays of information
  const destruct = ['conditionals', 'price'];

  const dates = ['created', 'last_updated'];

  const customResolvers = {
    'price': price => ({
      rawPrice: price.raw,
      currency: price.formatted_with_code.substring(price.formatted.length + 1),
      formatted: price.formatted_with_symbol,
    }),
  };

  const entry = Object.keys(data).reduce((accumulator, key) => {
    if (attributeBlacklist.includes(key)) {
      // "continue" if the attribute is blacklisted
      return accumulator;
    }

    // Use a resolver if defined
    let parsed = Object.keys(customResolvers).includes(key) ? customResolvers[key](data[key]) : data[key];

    // If the item needs to be destructed we'll reduce into an object with properly formatted keys
    if (destruct.includes(key)) {
      if (typeof parsed !== 'object') {
        // TODO Do something in this case?
      }
      parsed = Object.entries(parsed).reduce((accumulator, [rawKey, value]) => ({
        ...accumulator,
        [camelCase(rawKey)]: dates.includes(rawKey) ? new Date(value) : value,
      }), {});
    } else {
      parsed = { [camelCase(key)]: dates.includes(key) ? new Date(parsed) : parsed };
    }

    return {
      ...accumulator,
      ...parsed,
    }
  }, {});

  return {
    ...entry,
    internal: {
      type: 'ChecProduct',
      contentDigest: digest(`${entry.id}|${entry.lastUpdated}`),
    }
  };
};

export default makeProductNode;