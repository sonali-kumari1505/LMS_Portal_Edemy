import express from 'express'
import { requireAuth } from "@clerk/express";
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, verifyPayment } from '../controllers/userController.js'
const userRouter = express.Router()
userRouter.get('/data', requireAuth(), getUserData);
// userEnrolledCourses

userRouter.get(
  "/enrolled-courses",
  requireAuth(),
  userEnrolledCourses
);
userRouter.post('/purchase', requireAuth(), purchaseCourse);
userRouter.post('/verify-payment', requireAuth(), verifyPayment);
userRouter.post('/update-course-progress', requireAuth(), updateUserCourseProgress);
userRouter.post('/get-course-progress', requireAuth(), getUserCourseProgress);
userRouter.post('/add-rating', requireAuth(), addUserRating);
export default userRouter
