import { errorHandler } from "../utils/error.js";
import Ad from '../models/ad.model.js';
import { updatePost } from "./post.controller.js";

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
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to see all ads.'));
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === 'desc' ? -1 : 1;
    const currentDate = new Date();

    try {
        const ads = await Ad.find({
            ...(req.query.adID && {_id: req.query.adID}),
            ...(!req.query.adID && {endDate : { $gte: currentDate }})
        })
        .sort({startDate: sortDirection})
        .skip(startIndex)
        .limit(limit);

        const totalAds = await Ad.countDocuments({
            endDate : { $gte: currentDate },
            isActive: true
        });

            // get posts created within a month
            const lastMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                currentDate.getDate()
            );
            const lastMonthAds = await Ad.countDocuments({
                createdAt: { $gte: lastMonth },
            });

            let activeViewCount = 0;
            let activeAdCount = 0;
            if (!req.query.adID) {
                const activeAds = await Ad.find({
                    startDate: { $lt: currentDate },
                    endDate: { $gte: currentDate }
                });
                activeViewCount = activeAds.reduce((acc, ad) => acc + ad.viewCount, 0);
                activeAdCount = activeAds.length;
            }

            res.status(200).json({
                ads,
                totalAds,
                lastMonthAds,
                activeViewCount,
                activeAdCount,
            })
    } catch (error) {
        next(error)
    }

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

export const toggleActive = async (req, res, next) => {
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

export const updateAd = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id != req.params.userID){
        return next(errorHandler(403, 'You are not allowed to edit posts'));
    }

    try {
        const updatedAd = await Ad.findByIdAndUpdate(
            req.params.adID, {
                $set: {
                    title: req.body.title,
                    category: req.body.category,
                    targetURL: req.body.targetURL,
                    image: req.body.image,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    imageOnly: req.body.imageOnly,
                    isActive: req.body.isActive,
                }
            }, {new: true}
        );
        res.status(200).json(updatedAd);
    } catch (error) {
        next(error);
    }
}

export const publishAd = async (req, res, next) => {
    try {
        const currentDate = new Date();
        const limit = parseInt(req.query.limit) || 1;
        const ads = await Ad.find({
            $or: [
                {category: req.query.category},
                {category: 'general'}
            ],
            endDate: { $gte: currentDate},
            startDate: { $lte: currentDate }
        })
        .sort({viewCount: 1})
        .limit(limit);

        const incrementedAds = await Promise.all(ads.map(async (ad) => {
            ad.viewCount += 1;
            await ad.save();
            return ad;
        }))

        res.status(200).json(incrementedAds);
    } catch (error) {
        next(error)
    }
}