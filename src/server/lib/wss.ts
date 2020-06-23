import {Server, ServerOptions} from 'ws'

export const buildWssServer = (options: ServerOptions) => {
    const server = new Server(options)
    server.on('connection', (ws) => {
        ws.on('message', (x) => {
            console.log(x) 
        }) 
    })
    return server
}
