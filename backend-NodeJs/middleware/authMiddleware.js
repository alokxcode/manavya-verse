import jwt from 'jsonwebtoken'
import User from '../model/UserModel.js';

export const ProtectRoute = async (req,res,next) => {
    try {
        // extract token
        
        const token_name = process.env.TOKEN_NAME;
        const token = req.cookies[token_name];

        if(!token){
            return res.status(400).json({errors:[{msg:'token not found. Authorization denied'}]});
        }

        // verify token

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded){
            return res.status(400).json({errors:[{msg:'token not matched. Authorization denied'}]})
        }

        // find user
        const user = await User.findById({_id:decoded.userId});
        if (!user) {
            return res.status(400).json({errors:[{msg:'User not found'}]})
        }

        // send user

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({errors:[{msg:'Invalid token'}]})
    }
}