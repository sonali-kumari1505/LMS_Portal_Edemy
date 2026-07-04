import {clerkClient, getAuth} from '@clerk/express'
import Course from '../models/course.js';
import { v2 as cloudinary } from 'cloudinary';

export const updateRoleToEducator=async(req,res)=>{
    try{
        const {userId}=getAuth(req);
        console.log(req.auth)
        console.log(userId)
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:'educator',
                            }
        })
res.json({success:true,message:'you can publish a course now'})

    }catch(error){
        // cons
res.json({success:false,message:error.message})
    }
}

//ad new course
export const addCourse=async(req,res)=>{
    try{
          console.log("Step 1");
const {courseData}=req.body
const imageFile=req.file
console.log("reqfile")
console.log(req.file);
console.log(req.file.path);
  console.log("Step 2");
const {userId}=getAuth(req)
     console.log("Step 3");
        console.log("User ID:", userId);
if(!imageFile){
    return res.json({success:false, message:'thumbnail Not Attached'})
}
const parsedCourseData=await JSON.parse(courseData)
parsedCourseData.educator=userId
const newCourse=await Course.create(parsedCourseData)
   console.log("Course Created");
   console.log(imageFile);
//    console.log("========== FILE ==========");
// console.log(req.file);
console.log("Path:", req.file?.path);
console.log("Mimetype:", req.file?.mimetype);
console.log("Original Name:", req.file?.originalname);
console.log("req file",req.file) ; console.log("file path",req.file.path);
const imageUpload=await cloudinary.uploader.upload(imageFile.path,{
      resource_type: "image",
    })
   console.log("Image Uploaded");
   console.log(imageUpload.secure_url)
newCourse.courseThumbnail=imageUpload.secure_url
await newCourse.save()
res.json({success:true, message:'CourseAdded'})

    }
    catch(error){
        console.log(error.response);
console.log(error.http_code);
console.log(error);
res.json({success:false,message:error.message})
    }
}
//get educator courses
export const getEducatorCourses=async(req,res)=>{
    try{
const {userId}=getAuth(req)

// console.log("getcourse edcator")
console.log(userId)
console.log(getAuth(req))
const courses=await Course.find({educator:userId})
res.json({success:true,courses})
    }catch(error){
res.json({success:false,message:error.message})
    }
}

// //getEducator DashBoard Datall
export const EducatorDashBoard=async()=>{
    try{
const {userId}=getAuth(req)
const courses=await Course.find({userId})
const totalCourses=courses.length;
const courseIds=courses.map(course=>course._id);
//calculate totl earnings from purchases
const purchases=await Purchase.find({
    courseId:{$in:courseIds},
    status:'completed'
});
const totalEarnings=purchases.reduce((sum,purchase)=>sum+purchase.amount,0);
//collect unique student IDS with their courses titles
const enrolledStudentsData=[];
for(const course of courses){
    const students=await User.find({
        _id:{$in:course.enrolledStudents}
    },'name imageUrl');
    students.forEach(student=>{
        enrolledStudentsData.push({
            courseTitle:course.courseTitle,
            student
        });
    });
}
res.json({success:true,dashboardData:{
    totalEarnings,enrolledStudentsData,totalCourses
}})

    }catch(error){
        console.log("error is",error,error.msg);
        res.json({success:false,message:error.message})
    }
}


// get enrolled students data with purchase data
export const getEnrolledStudentsData=async(req,res)=>{
try{
const {userId}=getAuth(req)
const courses=await Course.find({userId});
const courseIds=courses.map(course=>course._id);
const purchases=await Purchase.find({
    courseId:{$in:courseIds},
    status:'complted'
}).populate('userId','name imageUrl').populate('courseId','courseTitle')
const enrolledStudents=purchases.map(purchase=>({
    student:purchase.userId,
    courseTitle:purchase.courseId.courseTitle,
    purchaseDate:purchase.createAt
}))
res.json({success:true,enrolledStudents})
}catch(error){
res.json({success:false,message:error.message});
}
}