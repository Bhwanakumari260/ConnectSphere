const User  = require("../models/UserModel");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const register = async (req , res)=>{
    const {name , username, password} = req.body;
    try{
        const existinguser = await User.findOne({username});
        if(existinguser){
            return res.status(400).json({message :"user already exits"})
        }
        const hashedpassword =  await bcrypt.hash(password , 10);
        const newUser = new User({
            name:name,
            username:username,
            password : hashedpassword
        });
        await newUser.save();
        res.status(201).json({ message :"user registered successfully"});
    }catch(e){
        res.status(500).json({message: `Something went wrong ${e}`});
    }


}
const login = async (req,res)=>{
 const   {username , password} = req.body;
    if(!username || !password){
        return res.status(400).json({message:"please provide username and password"});
    }
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message:"user is not found"});
        }
        let ismatch = await bcrypt.compare(password,user.password)
        if(ismatch){
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(201).json({token:token});
        }
        else{
            return res.status(500).json({message:"Invalid username and password"});
        }
    }catch(err){
        return res.status(500).json({message:`something went wrong ${err}`});
    }
}
module.exports = {register ,login};