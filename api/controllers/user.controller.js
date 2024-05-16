import { errorHandler } from "../utils/error.js";
import User from '../models/user.models.js';
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({ message: 'The API is running' })
};

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userID){
        return next(errorHandler(403, "You are not permitted to edit this user."));
    };
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400, "Password must be at least 6 characters."));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400, 'Username must be between 7 and 20 characters.'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot contain spaces.'));
        }
        if(req.body.username != req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'Username can only contain letters and numbers'));
        }
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.userID, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            }
        }, { new: true });
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    }catch(error){
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userID){
        return next(errorHandler(403, "You are not permitted to delete this user."));
    };

    try {
        await User.findByIdAndDelete(req.params.userID);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        .status(200).json('User has been signed out.');
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to see users.'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const usersWithPassword = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const users = usersWithPassword.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        })

        const totalUsers = await User.countDocuments();

        const currentDate = new Date();
        const lastMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            currentDate.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: lastMonth }
        });

        res.status(200).json({
            users,
            totalUsers,
            lastMonthUsers,
        });

    } catch (error) {
        next(error);
    }
}

export const  getUser = async (req, res, next) => {
    try {
        const userWithPassword = await User.findById(req.params.userID);
        if(!userWithPassword){
            return next(errorHandler(404, 'User not found.'))
        }
        const {password, ...user} = userWithPassword._doc;
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}