import bcryptjs from 'bcrypt';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const test = async(req, res) => {
  
  
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );


    const { password, ...rest } = updatedUser._doc;
    console.log(rest);
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async(req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    await Listing.deleteMany({
      userRef  : req.params.id
    })
    console.log(deleteUser);
    if (!deletedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const userListing = async(req, res, next)=>{
  try {
    const data = await Listing.find({userRef : req.user.id})

    
    res.status(200).json(data);
} catch (error) {
  next(error);
}
}


export const getUser = async(req, res, next) =>{
  try {
    const user = await User.findById(req.params.id);

    if(!user){
      next(errorHandler(404, 'User not found!'));
      return;
    }
    console.log('user de diya');

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}