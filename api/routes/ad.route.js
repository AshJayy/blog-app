import express from 'express';
import { createAd, deleteAd, getAds, toggleActive } from '../controllers/ad.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createAd);
router.get('/getads', verifyToken, getAds);
router.delete('/delete/:userID/:adID', verifyToken, deleteAd)
router.put('/toggleactive/:userID/:adID', verifyToken, toggleActive)

export default router;