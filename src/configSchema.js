import Joi from '@hapi/joi';

const resolvableFieldsType = Joi.array().items(Joi.object().keys({
  field: Joi.string().required().empty(),
  type: Joi.string().valid(['permalink', 'id']).required(),
  name: Joi.string().required().empty(),
}));

export default Joi.object().keys({
  // Required:
  token: Joi.string().required().empty(),

  // Optional:
  resolvableFields: Joi.object().keys({
    products: resolvableFieldsType,
  }),
  resolvableNodeWhitelist: Joi.array().items(Joi.string()),

  // Provided by Gatsby:
  plugins: Joi.array(),
});
