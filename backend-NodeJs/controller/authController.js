import bcrypt from "bcryptjs";
import User from "../model/UserModel.js";
import jwt from 'jsonwebtoken';
import UserData from "../model/UserDataModel.js";
import Conversation from "../model/ConversationModel.js";

// Handle user signup
export const postSignup = async (req,res) => {
    try {
        const {email , password} = req.body;

        // Hash password before saving
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        // Create new user document
        const user = new User({
            email,
            password:hashPassword
        });
        await user.save();

        // Create associated user data document
        const userData = new UserData({
            userId:user._id,
            conversations:[]
        })
        await userData.save();

        res.status(200).json({message:'User created successfully'});

    } catch (error) {
        res.status(401).json({errors:[{msg:error.msg}]});
    }
}

// Handle user signin
export const postSignin = async (req,res) => {
    try {
        const {email, password} = req.body;
        // Find user by email
        const user = await User.findOne({email})
        if (!user){
            throw new Error('User not found');
        } 

        // Compare password
        const existingUser = await bcrypt.compare(password, user.password)
        if(!existingUser){
            res.status(400).json({errors:[{msg:'Invalid email or password'}]})
        }

        // Find or create user data document
        const userData = await UserData.find({userId:user._id})
        if (!userData) {
                const userData = new UserData({
                userId:user._id,
                conversations:[]
                })
            await userData.save();
        }

        

        // Generate JWT token
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn:'3d',
        } )

        // Set token cookie
        res.cookie(process.env.TOKEN_NAME, token, {
            httpOnly:true,
            maxAge:3*24*60*60*1000,
            secure:process.env.NODE_ENV ==="production",
            sameSite:"lax",
            path:'/'           
        })

        res.status(200).json({message:"User logged in succussfullly",user:user, userData:userData})

    } catch (error) {
        return res.status(401).json({errors:[{msg:error.msg}]});
    }
}

// Handle user signout
export const postSignout = (req,res) => {
    try {
        // Clear token cookie
        res.clearCookie(process.env.TOKEN_NAME,{
        httpOnly:true,
        secure:process.env.NODE_ENV ==="production",
        sameSite:"lax",
        path:'/' 
        })

        res.status(200).json({message:'Signout successfully completed'})
    } catch (error) {
        return res.status(401).json({errors:[{msg:error.msg}]});
    }
}



// Get user data for authenticated user
export const getUserData = async(req,res) => {
    const user = req.user;
    const userData = await UserData.find({userId:user._id});
    res.status(200).json({userData:userData, user:user})
}