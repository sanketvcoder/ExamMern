import express from 'express';
import { createTest, deleteTestById, getAllTests, getTestById, updateTestById } from '../../controller/ExamController/examController.js';
import auth from '../../middleware/auth.js';
import { publishTestById } from '../../controller/ExamController/examMailer.js';
const testRoute = express.Router();
testRoute.post('/create',auth, createTest)
testRoute.get('/all', auth, getAllTests);
testRoute.get('/:id', auth, getTestById);
testRoute.patch('/:testId', updateTestById);
testRoute.delete('/:testId', auth, deleteTestById);

testRoute.patch('/:testId/publish', auth, publishTestById);
export default testRoute;