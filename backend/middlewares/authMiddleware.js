import jwt from "jsonwebtoken";
import HttpError from "./httpError.js";
import User from "../models/user.js"

const userAuthCheck = async (req, res, next)=> {
    if(req.method === "OPTIONS"){
        return next();
    }

    try{
     const authHeader = req.headers.authorization;

     if(!authHeader){
        return next(new HttpError("authentication failed",403));
     }

     const token = authHeader.split(" ")[1];

     if(!token){
        return next(new HttpError("authentication failed",403));
     }  else {
         const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

         const user = await User.findOne({_id: decodedToken.id})
 
         if(!user){
             return next(new HttpError("invalid credentials",400))
         } else {
             req.userData = {user_id : decodedToken.id};
             next()
         }
     }
    } catch (err) {
        return next(new HttpError("Authentication failed",403));
    }
};

export default userAuthCheck;