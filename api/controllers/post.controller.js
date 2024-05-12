import { errorHandler } from "../utils/error.js";
import Post from '../models/post.models.js';
import { json } from "express";

export const createPost = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create posts.'));
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please provide all required fields.'));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    const newPost = new Post ({
        ...req.body, slug, userID:req.user.id
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost)
    } catch (error) {
        next(error);
    }
}

export const getPosts = async (req, res, next) => {
    try {
        // get posts
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userID && {userID: req.query.userID}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postID && {_id: req.query.postID}),
            ...(req.query.searchTerm && {
                $or: [
                    {title: { $regex: req.query.searchTerm, $options: 'i' }},
                    {content: { $regex: req.query.searchTerm, $options: 'i' }},
                ],
            })
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        // get total number of posts available
        const totalPosts = await Post.countDocuments();

        // get posts created within a month
        const currentDate = new Date();
        const lastMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            currentDate.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: lastMonth }
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        })

    } catch (error) {
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id != req.params.userID){
        return next(errorHandler(403, 'You are not allowed to delete posts'));
    }

    try {
        await Post.findByIdAndDelete(req.params.postID);
        res.status(200).json('The post has been deleted');
    } catch (error) {
        next(error);
    }

}

export const updatePost = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id != req.params.userID){
        return next(errorHandler(403, 'You are not allowed to edit posts'));
    }
    try{
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postID,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                }
            }, { new: true }
        );
        res.status(200).json(updatedPost);
    }catch (error) {
        next(error)
    }
}