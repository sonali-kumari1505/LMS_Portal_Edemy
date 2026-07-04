
import Course from '../models/course.js';
//get ALl courses
export const getAllCourse=async(req,res)=>{
    try{
const courses=await Course.find({isPublished:true}).select(['-courseContent','-enrolledStudents']).populate
({path:'educator'})
res.json({success:true,courses});
    }catch(error){
        console.log("error from getAll courses",error)
        res.json({successs:true,message:error.message})
    }
}
// get Course by Id
export const getCourseId=async(req,res)=>{
    const {id}=req.params
    try{
  const courseData=await Course.findById(id).populate({path:'educator'})
//   remove lecture url if is Preview is false
courseData.courseContent.forEach(chapter=>{
    chapter.chapterContent.forEach(lecture=>{
        if(!lecture.isPreviewFree){
            lecture.lectureUrl="";
        }
    })
})
res.json({success:true,courseData})
    }catch(error){
          console.log("error from getAll courses By Is",error)
        res.json({successs:true,message:error.message})
    }
}