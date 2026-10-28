//  for get user data route controller function
import { getAuth} from '@clerk/express'
import User from '../models/User.js';
import {Purchase} from '../models/Purchase.js'
// why curly in one or not
import Course from '../models/course.js';
import Stripe from 'stripe';
import { CourseProgress } from '../models/CourseProgress.js';

// Verify and complete a Stripe payment (called by frontend after redirect)
// This is the fallback in case the Stripe webhook is delayed or fails
export const verifyPayment = async (req, res) => {
    try {
        const { purchaseId } = req.body;
        const { userId } = getAuth(req);

        if (!purchaseId) {
            return res.json({ success: false, message: 'Purchase ID is required' });
        }

        const purchaseData = await Purchase.findById(purchaseId);

        if (!purchaseData) {
            return res.json({ success: false, message: 'Purchase not found' });
        }

        // Security: ensure this purchase belongs to the requesting user
        if (purchaseData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized' });
        }

        // If already completed, just return success
        if (purchaseData.status === 'completed') {
            return res.json({ success: true, message: 'Payment already verified' });
        }

        // Check with Stripe if the payment was actually completed
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Find the checkout session that has this purchaseId in metadata
        const sessions = await stripeInstance.checkout.sessions.list({
            limit: 10,
        });

        const matchingSession = sessions.data.find(
            (s) => s.metadata.purchaseId === purchaseId
        );

        if (!matchingSession) {
            return res.json({ success: false, message: 'No matching Stripe session found' });
        }

        if (matchingSession.payment_status === 'paid') {
            // Payment confirmed — update everything
            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId);

            if (!userData || !courseData) {
                return res.json({ success: false, message: 'User or Course not found' });
            }

            // Prevent duplicate enrollments
            if (!userData.enrolledCourses.includes(courseData._id)) {
                userData.enrolledCourses.push(courseData._id);
                await userData.save();
            }

            if (!courseData.enrolledStudents.includes(userData._id)) {
                courseData.enrolledStudents.push(userData._id);
                await courseData.save();
            }

            purchaseData.status = 'completed';
            await purchaseData.save();

            return res.json({ success: true, message: 'Payment verified and enrollment completed' });
        } else {
            return res.json({ success: false, message: 'Payment not yet completed' });
        }
    } catch (error) {
        console.log('verifyPayment error:', error);
        return res.json({ success: false, message: error.message });
    }
};

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

     if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
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
        unit_amount: Math.round(Number(newPurchase.amount) * 100)
    },
    quantity:1
}]
// using above line items w can make one  payment session

const session=await stripeInstance.checkout.sessions.create({
    // origin get from above req.headers
    success_url:`${origin}/verify-payment/${newPurchase._id.toString()}`,
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
 res.json({success:false,message:error.message})
    }
}

//update user course progress
export const updateUserCourseProgress=async(req,res)=> {
    try{
        const {userId}=getAuth(req);
        const {courseId,lectureId}=req.body;
     const progressData=await CourseProgress.findOne({userId,courseId})
     if(progressData){
        if(progressData.lectureCompleted.includes(lectureId)){
return res.json({success:true,message:'Lecture Already completed'})
        }
        progressData.lectureCompleted.push(lectureId)
        await progressData.save()
     }else{
        await CourseProgress.create({
           userId,
           courseId,
           lectureCompleted:[lectureId]
        })
     }
     res.json({success:true,message:'progree updated'})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }

    }

    ///get user course progress
    export const getUserCourseProgress=async(req,res)=>{
       try{  const {userId}=getAuth(req);
        const {courseId,lectureId}=req.body;
     const progressData=await CourseProgress.findOne({userId,courseId})
     res.json({success:true,progressData})
    }
catch(error){
res.json({success:false,message:error.message})
}
    }

    // Addd user ratings to course
    export const addUserRating=async(req,res)=>{
        const{ userId }=
        getAuth(req);
        const {courseId,rating}=req.body;
        if(!courseId||!userId||!rating||rating<1||rating>5){
           return  res.json({success:false,message:'Invalid details'})
        }
try{
const course=await Course.findById(courseId);
if(!course){
    return res.json({success:false,message:"Course not found."});
}
const user=await User.findById(userId);
if(!user || !user.enrolledCourses.includes(courseId)){
      return res.json({success:false,message:"user has not purchase this course"});  
}
const existingRatingIndex=course.courseRatings.findIndex(r=>r.userId.toString()===userId.toString())
if(existingRatingIndex>-1){
    course.courseRatings[existingRatingIndex].rating=rating;
}else{
    course.courseRatings.push({userId,rating});
}
await course.save();
return res.json({success:true,message:'rating added'})
}catch(error){
return res.json({success:false,message:error.message})
}

    }
