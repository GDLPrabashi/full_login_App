import { Router } from "express";
const router = Router();

/**import all controllers */
import * as controllers from "../controllers/appControler.js"





/**post methods  */
router.route("/register").post(controllers.register);//register user
//router.route("/registerMail").post(); // send the mail
router.route("/authenticate").post((req,res)=>res.end()); // authenticate user
router.route("/login").post(controllers.login); // login in app



/**get methods */
router.route("/user/:username").get(controllers.getUser); // user eith username
router.route("/generateOTP").get(controllers.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controllers.verifyOTP); //verify generated OTP
router.route("/createResetSession").get(controllers.createResetSession); // reset all the variables


/**put method */
router.route('/updateuser').put(controllers.updateUser); // used to update the user profile
router.route('resetPassword').put(controllers.resetPaasword); // use to update the password


export default router;