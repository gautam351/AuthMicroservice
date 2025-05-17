import  type { Request, Response } from 'express';
const userSchema =require("../DB/Models/userModel")
import JWT from "../jwt/Jwt";
import bcrypt from "bcryptjs";
import { Console } from 'console';
// import {VerifyAccount} from "../Services/AuthServices"
const {SendVerifyMail,SendResetPasswordMail}=require("../Services/AuthServices")

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


// api for signup user
exports.SignUpUser = async (req: Request, res: Response) => {
    console.log(req.body);
    
    const { email, password } = req.body;
   
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }

  
    
    // check if email already exists or not 
    const user = await userSchema.find({ email: email });
    if (user.length > 0) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }
    
    // create new user
    let verficationCode=Math.floor(100000 + Math.random() * 900000);
    const newUser=new userSchema({
        email: email,
        password:  password ,
        lastLogin: new Date(),
        verificationCode: verficationCode,
        verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        is2FAVerified: false,
        
    });
    
    const savedUser = await newUser.save();
    
    if (!savedUser) {
        return res.status(500).json({
            message: "Error creating user"
        });
    }

   
    await SendVerifyMail(email,verficationCode);
    
    // return the response 
    return res.status(201).json({
        message: "User created successfully",
        user: {
            id: savedUser._id,
            email: savedUser.email,
            
        },
        
    });


}



// login api

exports.LoginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
   
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }

    // check if email already exists or not 
    const user = await userSchema.findOne({ email: email }).select("+password");
    if (!user) {
        return res.status(400).json({
            message: "Email does not exists"
        });
    }

    // check if password is correct or not 
    if (!bcrypt.compareSync(password,user.password)) {
        return res.status(400).json({
            message: "Password is incorrect"
        });
    }

    // update last login time
        // create new user
        let verficationCode=Math.floor(100000 + Math.random() * 900000);
        user.lastLogin = new Date();
        user.verificationCode= verficationCode;
        user.verificationCodeExpiry= new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        user.is2FAVerified= false;
    await user.save();

    
    
    // send verification mail later
    await SendVerifyMail(email,verficationCode);

    // return the response 
    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            
        },
        
    }); 
}


// verify account api
exports.VerifyAccount=async(req:Request,res:Response)=>{
   
    const { email, verificationCode } = req.body;
    if (!email || !verificationCode) {
        return res.status(400).json({
            message: "Email and Verification Code are required"
        });
    }
    // check if email already exists or not
    const user=await userSchema.findOne({email:email});
    if (!user) {
        return res.status(400).json({
            message: "Email does not exists"
        });
    }
    // check if verification code is correct or not
    if (user.verificationCode !== verificationCode || user.verificationCodeExpiry < new Date()) {
        return res.status(400).json({
            message: "Verification Code is incorrect or expired!"
        });
    }
 
    // update user is2FAVerified to true
    user.is2FAVerified = true;
    user.isEmailVerified=true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    user.token={ token: JWT.SignToken({ id: user._id, email: user.email }) , expiresIn: new Date(Date.now() + 10 * 60 * 1000) }; // 10 minutes   
    await user.save();

   const token = JWT.SignToken({id:user._id,email:user.email});
    // return the response
    return res.status(200).json({
        message: "Account verified successfully",
        user: {
            id: user._id,
            email: user.email,
            is2FAVerified: user.is2FAVerified
        },
        token: token

    });




}




// resend email 
exports.ResendEmail=async(req:Request,res:Response)=>{
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }
    // check if email already exists or not
    const user=await userSchema.findOne({email:email});
    if (!user) {
        return res.status(400).json({
            message: "Email does not exists"
        });
    }

    if(user.verificationCode==null){
        return res.status(400).json({
            message: "Login/Signup first to get verification code"
        })
    }

    if(user.verificationCodeExpiry<new Date()){
        return res.status(400).json({
            message: "Verification code expired. Please login again to get new verification code"
        })
    }

    // send verification mail later
    await SendVerifyMail(email,user.verificationCode);

    // return the response
    return res.status(200).json({
        message: "Verification email sent successfully",
        
    });

}



exports.LogoutUser=async(req:Request,res:Response)=>{
    const reqData = req.user;
    if (!reqData && !req) {
        return res.status(400).json({
            message: "Cannot logout User"
        });
    }
    // check if email already exists or not
    const user=await userSchema.findOne({email:reqData.email});
    if (!user) {
        return res.status(400).json({
            message: "Email does not exists"
        });
    }
    // update user token to null
    user.token = null;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    user.is2FAVerified = false;
    

    await user.save();

    // return the response
    return res.status(200).json({
        message: "User logged out successfully",
        
    });


}




// verify token api so that other backedn can very their users
exports.VerifyTokenByBackends=async(req:Request,res:Response)=>{
    // already taken cared in auth middleware

    // return the response
    return res.status(200).json({
        message: "Token verified successfully",
        
    });
}


exports.ForgotPassword=async(req:Request,res:Response)=>{
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }
    // check if email already exists
    const user=await userSchema.findOne({email:email});
    if(!user){
        return res.status(400).json({
            message: "Email does not exists"
        });
    }

    const token =JWT.SignToken({id:user._id,email:user.email},'30m');
    
    user.passwordResetToken=token;
    await user.save();

    console.log(token);
    
    await SendResetPasswordMail(email,token);

    return res.status(200).json({
        message: "Reset password email sent successfully",
    })



}

exports.ResetPassword=async(req:Request,res:Response)=>{
    const {resetToken,password} = req.body;
    if (!resetToken || !password) {
        return res.status(400).json({
            message: "Reset Token and Password are required"
        });
    }       

    // check if token is valid or not
    const decodedToken=JWT.DecodeToken(resetToken);
    if (!decodedToken) {
        return res.status(400).json({
            message: "Invalid token"
        });
    }
    // check if token is expired or not
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decodedToken.exp && decodedToken.exp < currentTime) {
        return res.status(400).json({
            message: "Token expired"
        });
    }

    console.log(decodedToken)   ;
    
    // check if email already exists
    const user=await userSchema.findOne({email:decodedToken.email}).select("+password");
    if(!user){
        return res.status(400).json({
            message: "Email does not exists"
        });
    }
    // check if token is same as the one in the database
    if (user.passwordResetToken !== resetToken) {
        return res.status(400).json({
            message: "Token is not same as the one in the database"
        });
    }
    
    // update password
    user.password = password;

    await user.save();

    // return the response
    return res.status(200).json({
        message: "Password reset successfully",
    });


}


exports.TestGetUsers=async(req:Request,res:Response)=>{

    const {email}=req.query;
    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }
    // check if email already exists or not
    const user=await userSchema.findOne({email:email});
    if (!user) {
        return res.status(400).json({
            message: "Email does not exists"
        });
    }
    
    // return the response
    return res.status(200).json({
        message: "Users found successfully",
        users: user
    });
}

