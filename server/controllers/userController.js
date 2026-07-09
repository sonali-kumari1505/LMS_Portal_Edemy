//  for get user data route controller function
import { getAuth} from '@clerk/express'
import User from '../models/User.js';
import {Purchase} from '../models/Purchase.js'
// why curly in one or not
import Course from '../models/course.js';
import Stripe from 'stripe';
// for get user data
export const getUserData=async(req,res)=>{
    try{
 const {userId}=getAuth(req);
 const user=await User.findById(userId)
 if(!user){
    return res.json({success:false,message:'user Not found'})
     }
     res.json({success:true, user})
    }catch(error){
res.json({success:false,message:error.message})
    }
}

//user enrolled courses with lectue link
export const userEnrolledCourses=async(req,res)=>{
    try{
 const {userId}=getAuth(req);
 const userData=await User.findById(userId).populate('enrolledCourses')

 
     res.json({success:true, enrolledCourses:userData.enrolledCourses})
    }catch(error){
res.json({success:false,message:error.message})
    }
}

// for purchased course controlller
export const purchaseCourse=async(req,res)=>{
    try{
const {courseId}=req.body;
const {origin}=req.headers;
const {userId}=getAuth(req);
const userData=await User.findById(userId)
const courseData=await Course.findById(courseId);
if(!userData || !courseData){
    return res.json({success:false,message:'Data Not Found'})
}
const purchaseData={
    courseId:courseData._id,
    userId,
    amount:(courseData.coursePrice-courseData.discount*courseData.coursePrice/100).toFixed(2),  //decimal ke bad kitna digit written as to fixed(3)
}
const newPurchase=await Purchase.create(purchaseData)
// stripe gateway initializer
const stripeInstance =new Stripe(process.env.STRIPE_SECRET_KEY)
const currency=process.env.CURRENCY.toLowerCase()
// creating line items for stripe and use it to create payment session
const line_items=[{
    price_data:{
        currency,
        product_data:{
            name:courseData.courseTitle
        },
        unit_amount:Math.floor(newPurchase.amount)*100
    },
    quantity:1
}]
// using above line items w can make one  payment session

const session=await stripeInstance.checkout.sessions.create({
    // origin get from above req.headers
    success_url:`${origin}/loading/my-enrollments`,
        cancel_url:`${origin}/`,
        line_items:line_items,
        mode:'payment',
        metadata:{
purchaseId:newPurchase._id.toString()
        }

})


res.json({success:true,session_url:session.url})
    }
    catch(error){
 res.json({successs:false,message:error.message})
    }
}