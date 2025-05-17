



import { Request, Response, NextFunction } from "express"; 
import JWT from "../jwt/Jwt";
import { decodeBase64 } from "bcryptjs";
const userSchema =require("../DB/Models/userModel")
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


exports.isAuthenticated=async(req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(" ")[1] ;
   
    
    if(!token){
        return res.status(401).json(
            {
                message:"Unauthorized"
            }
        )
    }

    let DecodeToken=JWT.DecodeToken(token);
    
    if(!DecodeToken){
        return res.status(401).json(
            {
                message:"Unauthorized"
            }
        )
    }
    
    // check if token is expired
    console.log(DecodeToken);
    
    // check if token is expired 
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (DecodeToken.exp && DecodeToken.exp < currentTime) {
        return res.status(401).json({
            message: "Token expired"
        });
    }
    

    // check if user actually exists or not 
    const user=await userSchema.findOne({email:DecodeToken.email});
    if (!user) {
        return res.status(400).json({
            message: "User does not exists"
        });
    }
    // check if token is same as the one in the database
    if (user.token.token !== token) {
        return res.status(400).json({
            message: "Token is not same as the one in the database"
        });
    }
    

    
    

    req.user=DecodeToken;
    next();


}