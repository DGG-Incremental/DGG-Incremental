import * as Joi from 'joi';

export const GameSchema = Joi.object({
    actionQueue: Joi
        .array().items(Joi.object({
            type: Joi.string(),
            timestamp: Joi.date()
        }))
        .required(),
    fabricators: Joi
        .array().items(Joi.object({
            blueprint: Joi.string(),
            endTime: Joi.date(),
            startTime: Joi.date()
        }))
        .required(),
    resources: Joi
        .object()
        .required()
});
