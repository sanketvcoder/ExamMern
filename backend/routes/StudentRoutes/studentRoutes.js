import express from 'express';
import auth from '../../middleware/auth.js';
import { getAllPublishedTests, getAllTestsForStudent, getTestssById, submitTest, verifyTestAccess } from '../../controller/StudentController/studentTestController.js';
import { getTestById } from '../../controller/ExamController/examController.js';


const studentRoute = express.Router();

studentRoute.get('/tests/all', getAllTestsForStudent);
studentRoute.get('/test/:testId',auth, getTestssById);
studentRoute.post('/submit', auth, submitTest);
studentRoute.post('/test/verify-access/:testId',verifyTestAccess)
export default studentRoute;