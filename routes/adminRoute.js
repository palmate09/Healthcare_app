import express from 'express'
import { AdminLogin, AdminSignUp, AppointamentList, GetAllDoctors, GetAllUsers } from '../controllers/AdminControllers.js';
import { authAdmin } from '../middlewares/authAdmin.js';
const router = express.Router(); 


router.post('/admin/signup', AdminSignUp) 
router.post('/admin/login', AdminLogin)
router.get('/admin/users', authAdmin,  GetAllUsers)
router.get('/admin/aptlist', authAdmin, AppointamentList)
router.get('/admin/doctors', authAdmin, GetAllDoctors)

export default router