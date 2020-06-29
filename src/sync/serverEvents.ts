import { GameState } from '@game';
import { Server } from 'http';
import Joi from '@hapi/joi';

export type ServerEventType = 'authSuccess' | 'authFailure' | 'syncSuccess' | 'syncFailure'

export interface ServerEvent<T extends ServerEventType, P > {
    type: T
    payload: P
}

export interface SyncFailurePayload {
    details: Joi.ValidationError[]
}

export interface AuthSuccessEvent extends ServerEvent<'authSuccess', null> {}
export interface AuthFailureEvent extends ServerEvent<'authFailure', {reason: string}> {}
export interface SyncSuccessEvent extends ServerEvent<'syncSuccess', GameState> {}
export interface SyncFailureEvent extends ServerEvent<'syncFailure', SyncFailurePayload> {}
