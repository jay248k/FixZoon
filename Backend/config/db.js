import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const ConnectDB=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DB Connected Succesfully");
    } catch (error) {
        console.log("DB Not Connected")
        console.log(error);
    }
}

export default ConnectDB;