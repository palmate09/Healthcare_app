import express from 'express'
import {signUp, login, getProfile, updateProfile, getAllDoctors, BookAppointament, cancelAppointament, deleteAppointament} from '../controllers/userControllers.js'
import { authUser } from '../middlewares/authUser.js';

const router = express.Router(); 

router.post('/signup', signUp); 
router.post('/login',  login); 
router.post('/profile', authUser,  getProfile); 
router.put('/profile', authUser, updateProfile);
router.get('/doctors', authUser, getAllDoctors); 
router.post('/bookapt', authUser, BookAppointament); 
router.post('/cancel', authUser, cancelAppointament)
router.delete('/delete', authUser, deleteAppointament)

export default router; 