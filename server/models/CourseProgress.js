import mongoose from 'mongoose'
const CourseProgressSchema=new mongoose.Schema({
    userId:{type:String,required:true},
    CourseProgressSchemaId:{type:String,required:true},
    completed:{type:Boolean,default:false},
    lectureCompleted:[]

},{minimize:false})
export const CourseProgress=mongoose.model('CourseProgress',CourseProgressSchema)