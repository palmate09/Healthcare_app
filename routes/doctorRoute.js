import express from 'express'
import { AppointamentList, ChangeAvailability, forgotPassword, getProfile, login, signUp, updateProfile } from '../controllers/doctorContollers.js';
import { authDoctor } from '../middlewares/authDoctor.js';
const router = express.Router(); 


router.post('/doctor/signup', signUp); 
router.post('/doctor/login', login); 
router.post('/doctor/profile', authDoctor, getProfile); 
router.put('/doctor/profile',authDoctor, updateProfile); 
router.put('/doctor/profile/password',authDoctor, forgotPassword); 
router.post('/doctor/aptlist', authDoctor, AppointamentList); 
router.post('/doctor/profile/availablity', authDoctor, ChangeAvailability);


export default router;