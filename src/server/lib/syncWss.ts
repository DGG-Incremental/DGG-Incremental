import WebSocket, { Server, ServerOptions } from 'ws'
import { createServer, IncomingMessage } from 'http'
import { getUserInfo } from './services/auth'
import Joi from '@hapi/joi'
import { StateSyncSchema } from './validation'
import { syncPlayerGameState } from './services/syncService'
import jwt from 'jsonwebtoken'
import { AuthSuccessEvent } from '@sync'
import { Action, GameState } from '../../game'

interface SyncPayload {
    token: string
    actions: Action[]
    sentAt: Date
    version: number
}

const errorEvent = (message: any) => {
    return JSON.stringify({
        event: 'error',
        message
    })
}

const syncEvent = (gameState: GameState, version: number) => {
    return JSON.stringify({
        event: 'sync',
        state: gameState,
        version
    })
}

export const buildSyncWss = (options: ServerOptions) => {
    const wss = new Server(options)
    wss.on('connection', async (ws: WebSocket) => {
        ws.on('message', async (message: string) => {
            try {
                const {
                    token,
                    actions,
                    sentAt,
                    version
                } = Joi.attempt(JSON.parse(message), StateSyncSchema) as SyncPayload
                const username = jwt.verify(token, process.env.JWT_SECRET) as string
                const {gameState, version: newVersion} = await syncPlayerGameState(username, actions, sentAt, version)
                ws.send(syncEvent(gameState, newVersion))
            } catch (err) {
                if (err.name === 'ValidationError') {
                    ws.send(errorEvent(err.details))
                }
                else if (err.name === 'SyntaxError') {
                    ws.send(errorEvent('Invalid JSON'))
                }
                else {
                    ws.send(errorEvent('Unexpected Error'))
                }
            }
        })
        return wss
    })
}
