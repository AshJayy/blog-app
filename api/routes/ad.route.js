import express from 'express';
import { createAd } from '../controllers/ad.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createAd);

export default router;