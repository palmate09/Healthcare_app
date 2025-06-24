import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient(); 


export const signUp = async(req, res) => {

    try{

        const { name, email , password , gender, age, address, phone_number } = req.body;


        if(!name || !email || !password || !gender ){
            res.status(404).json({message: 'data not found or fill the given data'})
        }

        if(!validator.isEmail(email)){
            res.status(404).json({message: 'fill the correct email with correct format'})
        }

        if(!validator.isLength(password, {min: 8})){
            res.status(404).json({message: 'fill the password with more than 8 characterstics'})
        }
        
        const phoneRegex = /^\d{9}$/ ; 

        if(!phoneRegex.test(phone_number)){
            res.status(404).json({message: 'fill the correct phonenumber with correct format'})
        }

        const HashedPassword  = await bcrypt.hash(password, 10); 

        const result = await prisma.user.create({
            data: {
                name, 
                email, 
                password: HashedPassword, 
                gender, 
                age, 
                address, 
                phone_number
            }
        })
        res.json(result)

    }
    catch(e){
        res.status(500).json({
            error: e.message,
            message: 'Internal server error'
        });
    }
}



export const login = async(req, res) => {

    try{
        const { email , password } = req.body; 

        if(!email || !password){
            res.status(400).json({message: 'fill the email and password '})
        }

        const user = await prisma.user.findFirst({
            where: {
                email
            },
            select: {
                email: true, 
                password: true
            }
        })

        const Password =  bcrypt.compare(password, user.password)

        if(!Password){
            res.status(400).json({message: 'authentication falied'})
        }

        const token = jwt.sign({email: user.email}, process.env.JWT_SECRECT)

        if(!token){
            res.status(400).json({message: 'token not found '}) 
        }

        return res.json(token); 
    }
    catch(e){
        res.status(500).json({
            error: e.message,
            message: 'Internal server error'
        });
    }
}



export const getProfile = async (req, res) => {
    try {
        const { email } = req.body;

        const getUser = await prisma.user.findUnique({
            where: { email }
        });

        return res.json(getUser);
    } catch (e) {
        res.status(500).json({
            error: e.message,
            message: 'Internal server error'
        });
    }
};




export const updateProfile = async(req, res) => {

    try{
        const { password, email, } = req.body; 

        if(!email){
            res.status(400).json({messgae: 'fill the email! '})
        }

        if(!validator.isEmail(email)){
            res.status(400).json({message: 'fill the email in correct format'})
        }

        let HashedPassword = await bcrypt.hash(password, 10);  

        const user = await prisma.user.update({
            where: {
                email
            },
            data: {
                password: HashedPassword
            }
        })

        res.json(user)

    }catch(e){
        res.status(500).json({
            error: e.message,
            message: 'Internal server error'
        });
    }
}




export const getAllDoctors = async(req, res) => {

    try{

        const alldoctors = await prisma.doctor.findMany();
        res.json(alldoctors) 

    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }

}   

export const BookAppointament = async(req, res) => {

    try{

        const { Email, doctorId, slot_date, slot_time, amount, date, payment, iscompleted, cancelled } = req.body
        
        if(!Email || !doctorId || !slot_date || !slot_time || !amount || !date){
            return res.status(404).json({message: 'fill the required data first'})
        }

        console.log(Email)

        const users = await prisma.user.findUnique({
            where: {
                email: Email
            }
        })

        console.log(users); 

        if(!users){
            return res.status(404).json({message: 'user not found'})
        }



        const BookAppointament = await prisma.appointament.create({
            data: {
                user: {
                    connect: {id: users.id}
                }, 
                doctor:{
                    connect: {id: doctorId}
                }, 
                slot_date, 
                slot_time, 
                amount,
                date,
                payment: true, 
                iscompleted: true,
                cancelled: false
            }
        })

        return res.json(BookAppointament)
    }
    catch(e){
        return res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const cancelAppointament = async(req, res) => {
    try{
        
        const { appointamentId } = req.body

        const appointament = await prisma.appointament.update({
            where: {
                id: appointamentId
            },
            data: {
                payment: false, 
                iscompleted: false, 
                cancelled: true
            }
        })
        res.json(appointament); 
    }

    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }

}


export const deleteAppointament = async(req, res) => {
    try{

        const { appointamentId } = req.body; 

        const appointament = await prisma.appointament.delete({
            where: {
                id: appointamentId
            }
        })

        res.json(appointament); 
    }
    catch(e){
        res.status(500).json({message: e.message, message: 'Internal server Error'})
    }
}