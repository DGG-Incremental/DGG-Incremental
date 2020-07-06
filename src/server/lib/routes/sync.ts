import { Router } from "express";
import { getState, patchState } from 'lib/controllers/sync';

const router = Router()

router.get("/state", getState);
router.patch("/state", patchState);

export default router