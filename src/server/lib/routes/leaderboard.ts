import { Router } from 'express'
import { getLeaderBoard } from '../controllers/leaderboard'

const router = Router()

router.get('/', getLeaderBoard)

export default router