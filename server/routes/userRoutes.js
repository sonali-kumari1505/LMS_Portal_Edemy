import express from 'express'
import { getUserData, purchaseCourse, userEnrolledCourses, } from '../controllers/userController.js'
const userRouter=express.Router()
userRouter.get('/data',getUserData);
// userEnrolledCourses
console.log("after enroll")
userRouter.get('/enrolled-courses',userEnrolledCourses);
console.log("after enroll")
userRouter.post('/purchase',purchaseCourse);
export default userRouter
// userEnrolledCourses