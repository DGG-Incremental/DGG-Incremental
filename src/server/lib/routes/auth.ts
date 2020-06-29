import { Router } from "express";
import {oauth, oauthRedirect} from '../controllers/auth'


const router = Router()

router.get('/', oauthRedirect)
router.get('/oauth', oauth)


export default router