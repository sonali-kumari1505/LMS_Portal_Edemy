import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from '@clerk/react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { user } = useUser()

  const [allCourses, setAllCourses] = useState([])
  const [isEducator, setIsEducator] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [userData, setUserData] = useState(null)

  // Fetch all published courses
  const fetchAllcourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`)
      if (data.success) {
        setAllCourses(data.courses)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Fetch current user data
  const fetcUserData = async () => {
    if (user?.publicMetadata?.role === 'educator') {
      setIsEducator(true)
    } else {
      setIsEducator(false)
    }

    try {
      const token = await getToken()
      if (!token) return

      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        setUserData(data.user)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Calculate average course rating
  const calculateRating = (course) => {
    if (!course || !Array.isArray(course.courseRatings) || course.courseRatings.length === 0) {
      return 0
    }
    let totalRating = 0
    course.courseRatings.forEach((item) => {
      totalRating += item.rating || 0
    })
    return Math.floor(totalRating / course.courseRatings.length)
  }

  // Fetch enrolled courses for current student
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken()
      if (!token) return

      const { data } = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllcourses()
  }, [])

  useEffect(() => {
    if (user) {
      fetcUserData()
      fetchUserEnrolledCourses()
    } else {
      setUserData(null)
      setIsEducator(false)
      setEnrolledCourses([])
    }
  }, [user])

  // Calculate chapter duration safely
  const calculateChapterTime = (chapter) => {
    if (!chapter || !Array.isArray(chapter.chapterContent)) return '0m'
    let time = 0
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration || 0
    })
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
  }

  // Calculate course total duration safely
  const calculateCourseDuration = (course) => {
    if (!course || !Array.isArray(course.courseContent)) return '0m'
    let time = 0
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        chapter.chapterContent.forEach((lecture) => {
          time += lecture.lectureDuration || 0
        })
      }
    })
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
  }

  // Calculate total number of lectures safely
  const calculateNoOfLectures = (course) => {
    if (!course || !Array.isArray(course.courseContent)) return 0
    let totalLectures = 0
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length
      }
    })
    return totalLectures
  }

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    setEnrolledCourses,
    fetchUserEnrolledCourses,
    enrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllcourses,
  }

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
}
