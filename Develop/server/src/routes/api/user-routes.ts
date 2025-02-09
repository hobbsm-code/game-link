import express from 'express';
const router = express.Router();

import {
    createUser,
    getSingleUser,
    saveGame,
    deleteGame,
    login,
} from '../../controllers/user-controller.js';

import { authenticateToken } from '../../services/auth.js';

router.route('/').post(createUser).put(authenticateToken, saveGame);

router.route('/login').post(login);

router.route('/me').get(authenticateToken, getSingleUser);

router.route('/games/:gameId').delete(authenticateToken, deleteGame);

export default router;