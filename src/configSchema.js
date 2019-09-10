import Joi from '@hapi/joi';

const resolvableFieldsType = Joi.array().items(Joi.object().keys({
  field: Joi.string().required().empty(),
  type: Joi.string().valid(['permalink', 'id']).required(),
  name: Joi.string().required().empty(),
}));

const pageType = Joi.object().keys({
  componentPath: Joi.string().required().empty(),
  segment: Joi.string().required().empty(),
  type: Joi.string().required().empty(),
  fields: Joi.array().items(Joi.string()),
  slugCreator: Joi.func(),
});

export default Joi.object().keys({
  // Required:
  token: Joi.string().required().empty(),

  // Optional:
  resolvableFields: Joi.object().keys({
    products: resolvableFieldsType,
  }),
  resolvableNodeWhitelist: Joi.array().items(Joi.string()),

  pages: Joi.array().items(pageType),

  typeNames: Joi.object().keys({
    products: Joi.string(),
  }),

  // Provided by Gatsby:
  plugins: Joi.array(),
});
