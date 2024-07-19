
import User from "../models/user.model.js"
import bcryptjs from "bcrypt"
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken"

export const signup = async (req, res, next ) =>{
    console.log(req.body);

    const {username, email, password} =  req.body;

    const hashedPassword = bcryptjs.hashSync(password, 15);
    const newUser = new User({
        username : username, 
        email : email, 
        password : hashedPassword
    })

    // console.log(newUser);

    try {
        await newUser.save();
        res.status(201).send({
            message : "new user created"
        });
        console.log("Signed up");
    } catch (error) {
        next(error);
    }
}

export const signin  = async(req, res, next) =>{
    // console.log("signin hit");
    const {email, password} = req.body;
    // console.log(req.body);

    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, "User not found!"));

        // console.log("findOne woking");
        const validPassword =  bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(402, "Wrong credentials!"));
        // console.log("valid Password woking");
        
        // console.log("valid Password woking");
        const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET)

        const {password : pas, ...rest} = validUser._doc;
        res.cookie('token', token, {httpOnly : true}).status(200).json(rest);
        // return validUser;

        // console.log("signed In");

    } catch (error) {
        // console.log(error.message);
        next(error);
    }

}

export const google = async(req, res, next)  =>{

    try {
        // console.log(req.body);

        const validUser = await User.findOne({email :req.body.email});

        if(validUser){
            const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET)

            const {password : pas, ...rest} = validUser._doc;
            console.log(rest);
            res.cookie('token', token, {httpOnly : true}).status(200).json(rest);
            console.log("signed in");
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword =  bcryptjs.hashSync(generatedPassword, 15);

            
            const newUser = new User({
                username : req.body.name.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).slice(-4), 
                email : req.body.email, 
                password : hashedPassword,
                photo : req.body.photo
            });

            await newUser.save();
            const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET)

            const {password : pas, ...rest} = newUser._doc;
            res.cookie('token', token, {httpOnly : true}).status(200).json(rest);
            console.log("signed up");
        }
    } catch (error) {
        next(error);
    }

}


export const signOut = async (req, res, next) =>{  
      try {
          const token = req.cookies.token;
          res.clearCookie('token'); // Clear the session cookie
          res.status(200).json({ message: 'Signed out successfully' });
              
      } catch (error) {
        next(error);  
      }
  
  }
  