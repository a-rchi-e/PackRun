import express, { Router } from 'express';

import { logUser } from './controllers/loginController';
import { getAllMessages, assignChatRoom, postMessage } from './controllers/chatController';


const router: Router = express.Router();


router.post('/location', logUser, assignChatRoom);

//todo add tracks
// router.post('/tracks/:userId')
//https://api.geoapify.com/v1/mapmatching?apiKey=195e52b3f3a64bdb903a12bf0fea9ca7
router.get('/messages/:userId', getAllMessages);

// expected body: {author: string, message: string, time: stringDate}
router.post('/message/:userId', postMessage);


export default router;

