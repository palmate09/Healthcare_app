import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'
import validator from 'validator'
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient(); 


export const signUp  = async(req, res) => {
    try{

        const {name, email, password, address, speciallity, degree, expirence, about, available, fees, phone_number} = req.body; 

        if(!name || !email || !password || !address || !speciallity || !degree || !expirence || !about || !available || !fees || !phone_number){
            res.status(404).json({message: 'fill the all required data'})
        }

        if(!validator.isEmail(email)){
            res.status(404).json({message: 'fill the email with correct format'})
        }

        if(!validator.isLength(password, {min: 8})){
            res.status(404).json({message: 'fill the password with correct Length'})
        }

        const phoneRegex = /^\d{9}$/ ; 

        if(!phoneRegex.test(phone_number)){
            res.status(404).json({message: 'fill the correct phonenumber with correct format'})
        }

        const HashedPassword = await bcrypt.hash(password, 10); 

        const result = await prisma.doctor.create({
            data: {
                name, 
                email, 
                password: HashedPassword,
                address,
                about,
                speciallity,
                degree,
                expirence,
                available,
                fees,
                phone_number
            }
        })

        res.stauts(200).json(result.id);
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal Server Error'})
    }

}

export const login  = async(req, res) => {
    try{

        const { email, password } = req.body; 

        if(!email || !password){
            res.status(404).json({message: 'fill the email and password data'})
        }

        const userData = await prisma.doctor.findFirst({
            where: {
                email
            },
            select: {
                password: true, 
                email: true
            }   
        })

        const Password = bcrypt.compare(password, userData.password)

        if(!Password){
            res.status(404).json({message: 'Incorrect Password and authentication failed'})
        }

        const token = jwt.sign({email: userData.email}, process.env.JWT_SECRECT);
        res.json(`Token: ${token}`)
    }
    catch(e){
        res.stauts(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const getProfile = async(req, res) => {

    try{

        const{ email } = req.body; 

        if(!email){
            res.status(404).json({message: 'fill the email first'})
        }

        const data = await prisma.doctor.findMany({
            where: {
                email
            }
        })

        res.json(data); 

    }
    catch(e){
        res.status(500).json({error: e.message, message: "Internal server Error"})
    }

}

export const updateProfile = async(req, res) => {

    try{

        const { email, fees, address } = req.body
        
        if(!email || !fees || !address ){
            res.status(404).json({message: 'fill the given data first'})
        }

        const userdata = await prisma.doctor.update({
            where: {
                email
            },
            data: {
                fees,  
                address
            }
        })
        res.json(userdata)
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const forgotPassword = async(req, res) => {

    try{
        const { email, password } = req.body; 

        if(!email || !password ){
            res.status(404).json({message: 'fill the required data first'})
        }

        if(!validator.isLength(password)){
            res.status(404).json({message: 'fill the password of correct length'})
        }

        const HashedPassword = await bcrypt.hash(password, 10); 

        const data = await prisma.doctor.update({
            where: {
                email
            }, 
            data: {
                password: HashedPassword
            }
        })

        res.json(data); 
    }
    catch(error){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const AppointamentList = async(req, res) => {

    try{

        const { name } = req.body; 

        if(!name){
            res.status(404).json({message: 'fill the name first'})
        }

        const user = await prisma.doctor.findFirst({
            where: {
                name
            }, 
            select: {
                id: true
            }
        })

        const getAppointamentList = await prisma.appointament.findMany({
            where: {
                doctorId: user.id
            }
        })
        res.json(getAppointamentList);
    }
    catch(e){
        res.status(500).json({message: e.message, message: 'Internal server Error'})
    }
}

export const ChangeAvailability = async(req, res) => {
 
    try{

        const { email, available } = req.body; 

        if(!email || !available){
            res.status(404).json({message: 'fill the required data'})
        }

        const ChangeAvailability = await prisma.doctor.update({
            where: {
                email
            },
            data: {
                available                
            }
        })

        res.json(ChangeAvailability)
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}