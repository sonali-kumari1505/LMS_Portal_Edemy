import express from 'express'
import { requireAuth } from "@clerk/express";
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, } from '../controllers/userController.js'
const userRouter = express.Router()
userRouter.get('/data', requireAuth(), getUserData);
// userEnrolledCourses
console.log("before enroll")



userRouter.get(
  "/enrolled-courses",
  requireAuth(),
  userEnrolledCourses
);
console.log("after enroll")
userRouter.post('/purchase', requireAuth(), purchaseCourse);
userRouter.post('/update-course-progress', requireAuth(), updateUserCourseProgress);
userRouter.post('/get-course-progress', requireAuth(), getUserCourseProgress);
userRouter.post('/add-rating', requireAuth(), addUserRating);
export default userRouter
// userEnrolledCourses