import { errorHandler } from "../utils/error.js";
import Ad from '../models/ad.model.js';

export const createAd = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create advertisements.'));
    }
    if(!req.body.title || !req.body.targetURL || !req.body.startDate || ! req.body.endDate){
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

export const getAds = async (req, res, next) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === 'desc' ? -1 : 1;
    const allAds = await Ad.find()
    .sort({startDate: sortDirection})
    .skip(startIndex)
    .limit(limit);

    const currentDate = new Date();

    const filterAds = (ad) => {
        const endDate = new Date(ad.endDate);
        return endDate > currentDate;
    }

    const ads = allAds.filter(filterAds)

    const totalAds = await Ad.countDocuments();

        // get posts created within a month
        const lastMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            currentDate.getDate()
        );
        const lastMonthAds = await Ad.countDocuments({
            createdAt: { $gte: lastMonth }
        });

        res.status(200).json({
            ads,
            totalAds,
            lastMonthAds
        })
}

export const deleteAd = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id != req.params.userID){
        return next(errorHandler(403, 'You are not allowed to delete ads'));
    }

    try {
        await Ad.findByIdAndDelete(req.params.adID);
        res.status(200).json('The ad has been deleted');
    } catch (error) {
        next(error);
    }
}

export const toggleActive = async (req, res,next) => {
    if(!req.user.isAdmin || req.user.id != req.params.userID){
        return next(errorHandler(403, 'You are not allowed to edit ads'));
    }

    try {
       const updatedAd = await  Ad.findByIdAndUpdate(
        req.params.adID, {
            isActive: req.body.isActive
        }, { new: true }
       );
       res.status(200).json(updatedAd)
    } catch (error) {
        next(error);
    }
}
