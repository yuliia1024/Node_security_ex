import mongoose from 'mongoose';
import { UserSchema } from '../models/crmUsers';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const User = mongoose.model("User", UserSchema);

export const loginRequired=(req,res,next)=>{
    if(req.user){
        next();
    }
    else return res.status(401).json({message: "unauthorized user!"});

}
