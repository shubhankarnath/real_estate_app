import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js'
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cookieParser from 'cookie-parser';
import path from 'path'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// console.log(process.env.MONGO);
mongoose
.connect(process.env.MONGO)
.then(()=> {
    console.log( "db connected");
})
.catch((error)=>{
    console.log(error.message);
})

const __dirname = path.resolve();

app.listen(3000, () => {
    console.log("server is running on port 3000");
    }
);

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

 
app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";

    res.status(statusCode).json({
        success : false,
        statusCode : statusCode,
        message
    });
})