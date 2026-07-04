// import express from 'express'
import mongoose from "mongoose"
const userSchema=new mongoose.Schema(
    {
        // _id:{type:String,required:true},
        _id:{type:String, required:true},
        name:{type:String,required:true},
        email:{type:String},
        image_url:{type:String},
        // in all required true add later
        enrolledCourses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course'
            }
        ],
    },{timestamps:true}
);
const User=mongoose.model('User',userSchema);
export default User