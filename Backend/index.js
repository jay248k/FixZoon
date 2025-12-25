import express from 'express';
import  ConnectDB  from './config/db.js';
import UserRouter from './router/User.route.js';
import cookieParser from "cookie-parser";
import ServiceProviderRouter from './router/serviceProvider.route.js';
import AdminRouter from './router/admin.routes.js';
import ServiceRouter from './router/service.routes.js';
import BookRouter from './router/booking.routes.js';

const app=express();
ConnectDB();

app.use(cookieParser());
app.use(express.json());

app.use('/api/user',UserRouter);
app.use('/api/service-provider',ServiceProviderRouter);
app.use('/api/admin',AdminRouter);
app.use('/api/service',ServiceRouter);
app.use('/api/book',BookRouter)
const PORT=5000;
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})