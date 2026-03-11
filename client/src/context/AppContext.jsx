import { createContext, useEffect, useState } from 'react'
import { dummyCourses } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
export const AppContext=createContext()
export const AppContextProvider=(props)=>{
  const currency=import.meta.env.VITE_CURRENCY
  const navigate=useNavigate()
  const[allCourses,setAllCourses]=useState([])
  const[isEducator,setIsEducator]=useState(true)
  // to store all data from props we need to craete fetchAllAcourses
  const fetchAllAcourses=async()=>{
    setAllCourses(dummyCourses)
  }
  // function to calculate average rating of course
  const calculateRating=(course)=>{
    if(course.courseRatings.length===0){
      return 0;
    }
    let totalRating=0;
    course.courseRatings.forEach(rating=> {
      totalRating+=rating.rating
    })
    return totalRating /course.courseRatings.length;
  }
  useEffect(()=>{
fetchAllAcourses()
  },[])

  const value={
currency,allCourses,navigate ,calculateRating,
isEducator,setIsEducator//so that to acces in any other component
  }
  return(
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}


