import express from 'express';
import { Login } from '../../controller/AuthController/Login.js';
import { Signup } from '../../controller/AuthController/SignUp.js';
import { forgotPassword } from '../../controller/AuthController/ForgotPassword.js';
import { verifyOtp } from '../../controller/AuthController/verifyOtp.js';
import { resetPassword } from '../../controller/AuthController/resetPassword.js';
import logout from '../../controller/AuthController/Logout.js';
import { getUserEmail } from '../../controller/AuthController/gettingUserEmail.js';
import auth from '../../middleware/auth.js';
import { sendVerifyOtp } from '../../controller/AuthController/sendVerifyOtp.js';
import { verifyEmailOtp } from '../../controller/AuthController/verifyEmailOtp.js';

const autRoute = express.Router();

autRoute.post('/login', Login);
autRoute.post('/signup', Signup);
autRoute.post('/forgot-password', forgotPassword);
autRoute.post('/verify-otp', verifyOtp);
autRoute.post('/reset-password', resetPassword);
autRoute.post('/logout', logout);
autRoute.get('/get-user-email', auth, getUserEmail);

autRoute.post('/send-verify-otp', auth, sendVerifyOtp);
autRoute.post('/verify-email-otp', auth, verifyEmailOtp);

export default autRoute;
