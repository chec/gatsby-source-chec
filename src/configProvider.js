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
  pages: [],
  typeNames: {
    products: 'ChecProduct'
  }
};

const resolveConfig = existingConfig => {
  const {
    resolvableFields: defaultResolvableFields,
    pages: defaultPages,
    typeNames: defaultTypeNames,
    ...otherDefaults
  } = defaultConfig;

  const config = {
    ...otherDefaults,
    ...existingConfig,
  };

  let resolvableFields = defaultResolvableFields;
  if (existingConfig.hasOwnProperty('resolvableFields')) {
    resolvableFields = {
      ...resolvableFields,
      ...existingConfig.resolvableFields,
    };
  }

  let pages = defaultPages;
  if (existingConfig.hasOwnProperty('pages')) {
    pages = existingConfig.pages;
  }

  let typeNames = defaultTypeNames;
  if (existingConfig.hasOwnProperty('typeNames')) {
    typeNames = {
      ...typeNames,
      ...existingConfig.typeNames,
    };
  }

  return {
    ...config,
    resolvableFields,
    pages,
    typeNames,
  };
};

export default resolveConfig;