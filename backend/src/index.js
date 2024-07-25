import dotenv from 'dotenv';
import connectDB from './db/db.js';

//As early as possible in your application, import and configure dotenv6
//this code provide variables to all application 
//this feature not yet available so we need to use it as a experimental feature
// "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"  this command in package.json file 
// -r for require dotenv/config file 
// --experimental-json-module: Enables experimental support for importing JSON modules.


dotenv.config({path: './env'})



connectDB();


/*
//First Apporch to connect db 

import mongoose from 'mongoose';
import { DB_NAME } from './constants';
import express from 'express'
const app =express();

//iife function (Immidiately Invoked Function Expression )
// semicolon is used for clining purpose
;(async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        //express app provide various listeners error is one of the listener
        app.on("error",()=>{
            console.log('Application not able to talk to DB',error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listning on Port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("ERROR",error);
        throw error
    }
})()

*/