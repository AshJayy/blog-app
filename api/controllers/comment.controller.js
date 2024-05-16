import { errorHandler } from "../utils/error.js";
import Comment from '../models/comment.model.js';

export const createComment = async (req, res, next) => {
    try {
        const { content, postID, userID } = req.body;

        if(userID !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to make a comment.'))
        }

        const newComment = new Comment({
            content,
            postID,
            userID,
        });
        await newComment.save();
        res.status(200).json(newComment);

    } catch (error) {
        next(error);
    }


}

export const getComments = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 5;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const comments = await Comment.find({postID: req.params.postID})
        .sort({createdAt : sortDirection})
        .skip(startIndex)
        .limit(limit);
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}