import Joi from 'joi';
import { logger } from "./logging.js";

const log = logger.scope('validation.js')

const addressSchema = Joi.object({
  id: Joi.number(),
  description: Joi.string(),
  complement: Joi.string(),
  created: Joi.date()
})

/**
 * middleware to validate address payload with joi schema
 * 
 * @param {*} context 
 * @param {*} next 
 */
export const ifValidAddress = async (context, next) => {
  log.info('validating address...')
  const { error } = addressSchema.validate(context.request.body)
  if (error) {
    log.warn(error);
    return context.throw(400, error);
  }
  return await next()
}