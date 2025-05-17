
import jwt, { SignOptions, VerifyErrors, JwtPayload } from "jsonwebtoken";

 class JWT {


    private static  _secretKey: string = process.env?.JWT_SECRET || "secretKEy";
    


    public static  SignToken(payload: object,_expiresIn:any='1h'): string {
        const options: SignOptions = {
            algorithm:'HS256',
            expiresIn:_expiresIn ,
        };
        return jwt.sign(payload,JWT._secretKey,options);
    }


    public static  DecodeToken(token:string):JwtPayload | null{
        try {
            return jwt.verify(token, JWT._secretKey, { algorithms: ['HS256'] }) as JwtPayload;
          } catch (err) {
            console.error('JWT verification failed:', (err as VerifyErrors).message);
            return null;
          }
    }


}

export default JWT;