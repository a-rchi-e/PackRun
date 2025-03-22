import express, { Router } from 'express';
import { setLocation, getAllMessages, postMessage } from './controllers/controller'
const router: Router = express.Router();


router.post('/location', setLocation);

router.get('/messages/:chatroom', getAllMessages);

// expected body: {author: string, message: string, time: stringDate}
router.post('/message/:chatroom', postMessage);


export default router;