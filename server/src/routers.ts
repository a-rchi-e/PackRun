import express, { Router } from 'express';
import { setLocation, getAllMessages, postMessage, logUserInChatRoom } from './controllers/controller'
const router: Router = express.Router();


router.post('/location', setLocation, logUserInChatRoom);

//todo add tracks
// router.post('/tracks/:userId')

router.get('/messages/:userId', getAllMessages);

// expected body: {author: string, message: string, time: stringDate}
router.post('/message/:userId', postMessage);


export default router;