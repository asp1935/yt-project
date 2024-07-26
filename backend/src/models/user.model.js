import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';   // this package for hash paswword
import jwt from 'jsonwebtoken';   //JSON web token are standardized way to securely send data between 2 parties
//and it contains header,payload,signature
//header- algorithum and type AUTO INJECTED
//payload- data
//signature- key   used to verify sender JWT it contains secret 

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lovercase:true,
        trim:true,
        index:true           //index is used to make that field searchable this is not require compalsory but it is optimized technique and als expensive give load on db
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lovercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,    //cloudnary URL
        required:true,
    },
    coberImage:{
        type:String,      //cloudnary URL
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,  
        required:[true,'Password is Required']
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})

//direct encriptions is not podssible 
//so we need to use mongoose hooks 
//pre middleware(hook) execute just before data is saving
//save is event pre hook execute before save
//arrow function is not used  because in arrow function this refrance is not available 
//like arrow function dont know context so normal function(){} is used  
//encription take some time thats why async fun created

userSchema.pre('save',async function(next){
    //check if password is not modified then return otherwise encript new password
    if(!this.isModified('password')) return next()
    //bcrypt hash method encript password 1st arg is password and 2nd arg is saltValue (rounds-8,10,)
    this.password=await bcrypt.hash(this.password,10)
    next()
})

//check password 
//mongoose provide methods as well as we can add new methods 
//compare method return boolean value 
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

// jwt token are bearer token like anyone have that token can get data 

//sign method is for creating token

userSchema.methods.genrateAccessToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:  process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.genrateRefreshToken=function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:  process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)