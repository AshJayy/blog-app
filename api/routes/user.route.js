import express from 'express';
import { test, updateUser, deleteUser, signOut } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userID', verifyToken, updateUser);
router.delete('/delete/:userID', verifyToken, deleteUser);
router.post('/signout', signOut);

export default router;