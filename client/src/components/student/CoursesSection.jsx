import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'
const CoursesSection = () => {
  const {allCourses}=useContext(AppContext)
  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3 mb-5'>Discover out top-rated courses across various categories.From coding and design to <br/>business and wellness,our courses are crafted to deliver results.</p>
    <div className='flex overflow-x-auto gap-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:px-0 md:my-16 my-10'>
  {allCourses.slice(0, 4).map((course, index) => (
    <CourseCard key={index} course={course} className='min-w-[200px]' />
  ))}
</div>
      <Link to={'/course-list'} onClick={()=>scrollTo(0,0)}
      className='text-gray-500 border border-gray-500/30 mt-18 px-10 py-3 rounded'>show all courses</Link>
    </div>
  )
}

export default CoursesSection
