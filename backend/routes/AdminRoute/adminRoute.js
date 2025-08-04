import express from 'express';
import { allUsers, assignSectionToStudent, deleteUser, getUserWithProfileById, updateUserRole } from '../../controller/AdminController/adminController.js';
import auth from '../../middleware/auth.js';

const adminRoute = express.Router();
adminRoute.get('/all', allUsers);
adminRoute.put('/role',auth, updateUserRole)
adminRoute.delete('/:userId',auth,deleteUser)
adminRoute.get('/user/:userId', auth,getUserWithProfileById);
adminRoute.put('/assign-section', auth, assignSectionToStudent);


export default adminRoute;

