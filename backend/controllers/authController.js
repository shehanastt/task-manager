import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";
import HttpError from "../middlewares/httpError.js";


// register
export const registerUser = async (req, res, next)=> {
    try{
        const errors = validationResult(req);
        console.log('Validation errors:', errors);
        
        if(!errors.isEmpty()){
            return next(new HttpError("Invalid inputs passed, please try again", 422))
        } else {
            const {name ,email ,password} = req.body
            const userExists = await User.findOne({email})
                 
                if(userExists){
                    return next(new HttpError("User already exists",400));
                } else {
                    const hashedPassword = await bcrypt.hash(password,12)
        
                    const user = await new User({
                        name,
                        email,
                        password: hashedPassword,
                    }).save();
        
                    if(!user){
                        return next(new HttpError("Registration failed", 400));
                    } else {
                        const token = jwt.sign(
                        { id: user._id },
                        process.env.SECRET_KEY,
                        { expiresIn: process.env.JWT_TOKEN_EXPIRY}
                    );

                    res.status(201).json({
                        status: true,
                        message:"Registered successfully",
                        token,
                        data: {
                            _id: user.id,
                            email: user.email
                        }
                    })
                    }
        
                }
        }
    } catch (err){
        return next(new HttpError("process failed",500));
    }
};


// login
export const loginUser = async (req,res,next) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return next(new HttpError("Invalid inputs,check again",422));
        } else {
            const {email , password} = req.body
    
            const user = await User.findOne({email});
    
            if(!user){
                return next(new HttpError("user doesn't exist",404));
            } else {
                const isMatch = await bcrypt.compare(password, user.password);
    
                if(!isMatch){
                    return next(new HttpError('invalid credentials',403));
                } else {

                    const token = jwt.sign(
                        { id: user._id },
                        process.env.SECRET_KEY,
                        { expiresIn: process.env.JWT_TOKEN_EXPIRY}
                    );
    
                    if(!token){
                        return next(new HttpError('Token generation failed',403));
                    } else {
                        res.status(200).json({
                            status: true,
                            message: "Login successful",
                            token,
                            data: {
                                _id: user.id,
                                email: user.email
                            }
                        })
                    }
                }
            }
        }
    } catch (err){
        return next(new HttpError("Login failed",500));
    }
};