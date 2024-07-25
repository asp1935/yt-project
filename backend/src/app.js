import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express()

//cors (cross originb resource sharing ) we can specify  verious options z
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials:true,
    }
))

//data came from various locations like url,body,form,json-form etc
//so we need to do some setting 
//so this line set limit to json data   depends on server
app.use(express.json({limit:'16kb'}))
//body-parser not using because now  express come with body-parser by default 

//this setting for url-data   extended true menas we can pass nested objects 
app.use(express.urlencoded({extended:true,limit:"16kb"}))

//for storing files on our server 
//static files
app.use(express.static("public"))

//for accessing cookies and change like crud op by server
app.use(cookieParser())


export {app}