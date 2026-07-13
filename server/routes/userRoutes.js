import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, } from '../controllers/userController.js'
const userRouter = express.Router()
userRouter.get('/data', getUserData);
// userEnrolledCourses
console.log("after enroll")
userRouter.get('/enrolled-courses', userEnrolledCourses);
console.log("after enroll")
userRouter.post('/purchase', purchaseCourse);
userRouter.post('/update-course-progress', updateUserCourseProgress);
userRouter.post('/get-course-progress', getUserCourseProgress);
userRouter.post('/add-rating', addUserRating);
export default userRouter
// userEnrolledCourses