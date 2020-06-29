import authRouter from '../routes/auth'
import leaderboardRouter from '../routes/leaderboard'
import syncRouter from '../routes/sync'
import { Router } from 'express'
import timesyncServer from 'timesync/server'

const router = Router()

router.use('/auth', authRouter)
router.use('/leaderboard', leaderboardRouter)
router.use('/sync', syncRouter)
router.use('/timesync', timesyncServer.requestHandler)

export default router