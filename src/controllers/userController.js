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

export const register = (req,res, next)=>{
    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, user)=>{
        if(err){
            return res.status(400).send({message:err}
            )
        } else{
            user.hashPassword = undefined;
            return res.json(user);
            next();
        }
    })
}
export const login = (req,res) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).json({ message: 'Authentication failed. No user found'});
        } else if (user) {
            if (!user.comparePassword(req.body.password, user.hashPassword)) {
                res.status(401).json({ message: 'Authentication failed. Wrong password'});
            } else {
                return res.json({token: jwt.sign({ email: user.email, username: user.username, _id: user.id},
                        `MySuperSecret`)});
            }
        }
    });
}