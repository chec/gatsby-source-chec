import Joi from '@hapi/joi';

export default Joi.object().keys({
  token: Joi.string().required().empty(),

  // default plugins passed by gatsby
  plugins: Joi.array(),
})