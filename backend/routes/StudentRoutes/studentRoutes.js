import express from 'express';
import auth from '../../middleware/auth.js';
import { getAllTestsForStudent, getTestssById, verifyTestAccess } from '../../controller/StudentController/studentTestController.js';



const studentRoute = express.Router();

studentRoute.get('/tests/all', getAllTestsForStudent);
studentRoute.post('/test/:testId', getTestssById)

// studentRoute.post('/submit', auth, submitTest);
studentRoute.post('/test/verify-access/:testId',verifyTestAccess)
export default studentRoute;