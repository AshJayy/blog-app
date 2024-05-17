import express from 'express';
import { createComment, getComments, likeComment, deleteComment } from '../controllers/comment.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getcomments/:postID', getComments);
router.put('/likecomment/:commentID', verifyToken, likeComment);
router.delete('/deletecomment/:commentID', verifyToken, deleteComment);

export default router;