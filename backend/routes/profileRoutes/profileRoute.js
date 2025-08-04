import express from 'express';
import auth from '../../middleware/auth.js';
import { createProfile, deleteProfile, getProfile, updateProfile } from '../../controller/ProfileController.js/profileController.js';



const profileRoute = express.Router();

profileRoute.post('/create-profile', auth,createProfile );
profileRoute.get('/get-profile', auth, getProfile);
profileRoute.put('/update-profile', auth, updateProfile);
profileRoute.delete('/delete-profile', auth, deleteProfile);
export default profileRoute;