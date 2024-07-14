import Joi from 'joi';
import { logger } from "./logging.js";

const log = logger.scope('validation.js')

// https://joi.dev/api/?v=17.13.3#general-usage
export const addressSchema = Joi.object({
  id: Joi.number(),
  description: Joi.string().required(),
  complement: Joi.string().required().allow(''),
  created: Joi.date()
})

export const idSchema = Joi.object({
  id: Joi.number().positive().required()
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

/**
 * middleware to validate id present in request param
 * 
 * @param {import('koa').Context} context 
 * @param {*} next 
 * @returns 
 */
export const ifValidId = async (context, next) => {
  log.info('validating id...')
  const { error } = idSchema.validate(context.request.params)
  if (error) {
    log.warn(error);
    return context.throw(400, { error, message: 'id is invalid' });
  }
  return await next()
}