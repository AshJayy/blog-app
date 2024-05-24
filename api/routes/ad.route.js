import express from 'express';
import { createAd, deleteAd, getAds, publishAd, toggleActive, updateAd } from '../controllers/ad.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createAd);
router.get('/getads', verifyToken, getAds);
router.delete('/delete/:userID/:adID', verifyToken, deleteAd)
router.put('/toggleactive/:userID/:adID', verifyToken, toggleActive)
router.put('/updatead/:userID/:adID', verifyToken, updateAd)
router.get('/publish', publishAd)

export default router;