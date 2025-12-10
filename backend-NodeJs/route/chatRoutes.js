import express from 'express';
import { thread, saveChat , getChat} from '../controller/chatController.js';
import { ProtectRoute } from '../middleware/authMiddleware.js';

const chatRouter = express.Router();

// Generate new chat thread (protected route)
chatRouter.get('/threads',ProtectRoute, thread);
// Save chat messages to a thread (protected route)
chatRouter.post('/save', ProtectRoute, saveChat);
// Get chat messages for a thread (protected route)
chatRouter.post('/getchat', ProtectRoute, getChat);

export default chatRouter;