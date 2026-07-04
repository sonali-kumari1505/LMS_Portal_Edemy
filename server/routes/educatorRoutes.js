import express from 'express'
import { addCourse, EducatorDashBoard, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js'
import { requireAuth } from '@clerk/express'
import upload from '../configs/multer.js'
import { protectEducator } from '../middleware/authMiddleware.js'
const educatorRouter=express.Router()
//Add Educator Role
educatorRouter.get('/update-role',requireAuth(),updateRoleToEducator)
// educatorRouter.post('/add-course',   requireAuth(),upload.single('image'),protectEducator,addCourse)
educatorRouter.post(
    "/add-course",
    requireAuth(),
    protectEducator,
    upload.single("image"),
    addCourse
);
educatorRouter.get('/courses',   requireAuth(),protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',   requireAuth(),protectEducator,EducatorDashBoard)
educatorRouter.get('/enrolled-students',   requireAuth(),protectEducator,getEnrolledStudentsData)
export default educatorRouter;