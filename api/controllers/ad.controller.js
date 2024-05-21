import { errorHandler } from "../utils/error.js";
import Ad from '../models/ad.model.js';

export const createAd = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create advertisements.'));
    }
    if(!req.body.title || !req.body.content || !req.body.targetURL || !req.body.startDate || ! req.body.endDate){
        return next(errorHandler(400, 'Please provide all required fields.'));
    }

    const newAd = new Ad (req.body);
    try {
        const savedAd = await newAd.save();
        res.status(201).json(savedAd);
    } catch (error) {
        next(error);
    }
}