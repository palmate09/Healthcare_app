import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient(); 


export const AdminSignUp = async(req, res) => {

    try{

        const { email, password } = req.body;
        
        if(!email || !password ){
            res.status(404).json({message: 'email and password required'})
        }

        if(!validator.isEmail(email)){
            res.status(404).json({message: 'email is not in correct format'})
        }

        if(!validator.isLength(password, {min: 8})){
            res.status(404).json({message: 'password is not in correct format'})
        }

        const HashedPassword = await bcrypt.hash(password, 10); 

        const admin = await prisma.admin.create({
            data: {
                email, 
                password: HashedPassword
            }
        })
        res.json(admin);
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const AdminLogin = async(req, res) => {
    try{

        const {email , password }  = req.body; 

        if(!email || !password){
            res.status(404).json({message: 'email and password not found please fill this first'})
        }

        const adminData = await prisma.admin.findFirst({
            where: {
                email
            }, 
            select: {
                email: true, 
                password: true
            }
        })

        const Password = bcrypt.compare(password, adminData.password)
 
        if(!Password){
            res.status(404).json({message: 'authentication failed'})
        }

        const token = jwt.sign({email: adminData.email}, process.env.JWT_SECRECT);
        res.json(`Token: ${token}`)
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const GetAllUsers = async(req, res) => {

    try{

        const userList = await prisma.user.findMany(); 
        res.json(userList); 

    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal Server Error'})
    }
}

export const AppointamentList = async(req, res ) => {
    
    try{

        const AppointamentList = await prisma.appointament.findMany()
        res.json(AppointamentList); 

    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const GetAllDoctors = async(req, res) => {

    try{

        const doctorList = await prisma.doctor.findMany()
        res.json(doctorList);

    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}
