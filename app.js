import express from 'express'
import userRouter from './routes/userRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import AdminRouter from './routes/adminRoute.js'
import dotenv from 'dotenv'
dotenv.config(); 

const app = express(); 
app.use(express.json());


app.use('/api', userRouter);
app.use('/api', doctorRouter);  
app.use('/api', AdminRouter); 


app.listen(process.env.PORT || 8080); 