import mongoose from 'mongoose';

const DB_URL="mongodb+srv://jayparmar2787_db_user:iTrU4IajUF2rme1d@cluster0.kfxhcjp.mongodb.net/FixZoon";
const ConnectDB=async()=>{
    try {
        await mongoose.connect(DB_URL);
        console.log("DB Connected Succesfully");
    } catch (error) {
        console.log("DB Not Connected")
        console.log(error);
    }
}

export default ConnectDB;