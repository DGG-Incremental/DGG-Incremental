import { createClient } from 'redis'
import { createHandyClient } from 'handy-redis'

const client = createHandyClient(createClient())

export default client