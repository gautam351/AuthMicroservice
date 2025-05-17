
const {SignUpUser,LoginUser,VerifyAccount,LogoutUser,TestGetUsers,VerifyTokenByBackends,ResendEmail,ForgotPassword,ResetPassword} =require("../Controllers/AuthController.ts")
const router= require("express").Router();
const {isAuthenticated} = require("../Middlewares/AuthMiddleWare.ts")


//add all routes here 

router.route("/signup").post(SignUpUser);
router.route("/login").post(LoginUser);
router.route("/verify2FA").post(VerifyAccount);
router.route("/logout").post(isAuthenticated,LogoutUser);
router.route("/VerfyToken").post(isAuthenticated, VerifyTokenByBackends);
router.route("/resendEmail").get(ResendEmail);
router.route("/forgotPassword").post(ForgotPassword);
router.route("/resetPassword").post(ResetPassword);


router.route("/test").get( isAuthenticated,TestGetUsers);



module.exports=router;  