import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"


export const signup = async(req,res) => {
    const { fullName, email, password} = req.body;
    try{
        if(password.length < 6){
            return res.status(400).json({ message: "Your password is atleast 6 characters"});
        }
        const user = await User.findOne({email})

        if (user) return res.status(400).json({ message: "Email already exist"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassworrd = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassworrd
        })
        if(newUser){
            genrateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }else{
            res.status(400).json({ message: "Invalid user data"});
        }

    } catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message:"Internet server error"});
    }
};

export const login = (req,res) => {
    res.send("login route");
};

export const logout = (req,res) => {
    res.send("logout route");
};
