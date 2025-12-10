import {body,validationResult} from 'express-validator'
import User from '../model/UserModel.js'

export const validateSignup =  [

    body('email')
    .notEmpty().withMessage('Please enter your email')
    .isEmail().withMessage('Enter a valid email')
    .custom( async(email) => {
        const existingUser = await User.findOne({email:email});
        if (existingUser){
            throw new Error('Email already exist');
        };
        return true;
    })
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('Please enter your password')
    .isLength({min:8}).withMessage('Password should be min 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least 1 capital letter')
    .matches(/[a-z]/).withMessage('Password must contain at least 1 small letter')
    .matches(/[0-9]/).withMessage('Password must contain at least 1 number')
    .matches(/[@#&*!]/).withMessage('Password must contain at least one special character'),

    (req,res,next) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        next();
    }

]

export const validateSignin = [
    body('email')
    .notEmpty().withMessage('Please enter your email')
    .isEmail().withMessage('Enter a valid email')
    .custom( async (email,{req}) => {
        const user = await User.findOne({email})
        if (!user){
            throw new Error('User not found');
        } 
        req.founduser = user;
        return true;
    })
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('Please enter your password'),

    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        next();
    }
]