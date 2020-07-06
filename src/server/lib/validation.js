import Joi from "@hapi/joi";
import { ActionType, locations } from '@game';
import { ClientEventType } from '@sync'


export const ActionSchema = Joi.object().keys({
    action: Joi.string().valid(...Object.values(ActionType)),
    timestamp: Joi.date()
    // .when('#timestampLowerLimit', { is: Joi.exist(), then: Joi.date().greater('#timestampLowerLimit') })
    // .when('#timestampUpperLimit', { is: Joi.exist(), then: Joi.date().less('#timestampUpperLimit') })
})

export const GoToLocationSchema = ActionSchema.keys({
    location: Joi.object().valid(...Object.values(locations))
})

export const GameStateSchema = Joi.object({
    actions: Joi.array().items(ActionSchema),
    lastSynced: Joi.date(),
})

export const ConditionalActionSchema = Joi
    .alternatives()
    .conditional('.action', {
        switch: [
            { is: ActionType.goToLocation, then: GoToLocationSchema },
        ],
        otherwise: ActionSchema
    })

export const ConditionalActionSchema = Joi.alternatives().conditional(".action", {
    switch: [{ is: ActionType.goToLocation, then: GoToLocationSchema }],
    otherwise: ActionSchema,
})

export const SyncSchema = Joi.object({
    actions: Joi.array().items(ConditionalActionSchema),
    version: Joi.number().integer().required().equal(Joi.ref("$version")),
});


export const StateSyncSchema = Joi.object({
    token: Joi.string()
        .min(3)
        .max(200)
        .required(),
    actions: Joi.array().items(ConditionalActionSchema).required(),
    sentAt: Joi.date().required(),
    version: Joi.number().integer().required(),
});

