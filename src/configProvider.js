// Declare defaults for optional config:
export const defaultConfig = {
  url: 'https://api.chec.io/v1/',
  resolvableFields: {
    products: [
      {
        field: 'checProductPermalink',
        type: 'permalink',
        name: 'checProduct',
      },
      {
        field: 'checProductID',
        type: 'id',
        name: 'checProduct',
      },
    ],
  },
};

const resolveConfig = existingConfig => {
  const { resolvableFields: defaultResolvableFields, ...otherDefaults } = defaultConfig;

  const config = {
    ...otherDefaults,
    ...existingConfig,
  };

  if (!existingConfig.hasOwnProperty('resolvableFields')) {
    return {
      ...config,
      ...defaultResolvableFields,
    };
  }

  return {
    ...config,
    resolvableFields: {
      ...defaultResolvableFields,
      ...existingConfig.resolvableFields,
    },
  };
};

export default resolveConfig;