import { Router } from "express";
import { User } from "../interface/user";

const router= Router();

const users: User[] = [];

router.post("/register",(req,res)=>{
    const newUser: User =req.body;
    if (!newUser.name || !newUser.surname || !newUser.email || !newUser.password || !newUser.username) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    users.push(newUser);
    res.status(200).json({success:true,message:'User registered succesfully'});
    console.log("users: ",users); //just to try and see if it works

});



export default router;