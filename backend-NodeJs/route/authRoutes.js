import express from 'express'
import { postSignup, postSignin, postSignout, getUserData} from '../controller/authController.js';
import { validateSignup, validateSignin} from '../middleware/authValidator.js';
import { ProtectRoute } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/signup', validateSignup, postSignup);
authRouter.post('/signin', validateSignin, postSignin);
authRouter.post('/signout', postSignout);


authRouter.get('/me', ProtectRoute, getUserData)

export default authRouter;