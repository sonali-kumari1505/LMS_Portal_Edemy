import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import humanizeDuration from 'humanize-duration'
import axios from 'axios'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const Player = () => {
  const { enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses } = useContext(AppContext)
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgresssData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)

  const getCourseData = () => {
    if (!enrolledCourses || enrolledCourses.length === 0) return
    const found = enrolledCourses.find((course) => course._id === courseId)
    if (found) {
      setCourseData(found)
      if (found.courseRatings && userData) {
        const existing = found.courseRatings.find((item) => item.userId === userData._id)
        if (existing) {
          setInitialRating(existing.rating)
        }
      }
    }
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  useEffect(() => {
    if (enrolledCourses && enrolledCourses.length > 0) {
      getCourseData()
    }
  }, [enrolledCourses, courseId, userData])

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message || 'Progress updated')
        getCourseProgress()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setProgresssData(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRate = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message || 'Rating added successfully')
        setInitialRating(rating)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (courseId) {
      getCourseProgress()
    }
  }, [courseId])

  const getYouTubeId = (url) => {
    if (!url) return ''
    if (url.includes('v=')) {
      return url.split('v=')[1]?.split('&')[0] || ''
    }
    return url.split('/').pop() || ''
  }

  return courseData ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        {/* Left column */}
        <div>
          <h2 className='text-xl font-semibold'>Course Structure</h2>

          <div className='pt-5'>
            {courseData &&
              courseData.courseContent?.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div
                    className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                    onClick={() => toggleSection(index)}
                  >
                    <div className='flex items-center gap-2'>
                      <img
                        className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                        src={assets.down_arrow_icon}
                        alt="arrow_icon"
                      />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>
                      {chapter.chapterContent?.length || 0} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? 'max-h-96 overflow-y-auto' : 'max-h-0'
                    }`}
                  >
                    <ul className='list-disc md:pl-10 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                      {chapter.chapterContent?.map((lecture, i) => (
                        <li key={i} className='flex items-start gap-2 py-1'>
                          <img
                            src={
                              progressData && progressData.lectureCompleted?.includes(lecture.lectureId)
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt="play icon"
                            className='w-4 h-4 mt-1'
                          />
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2 items-center'>
                              {lecture.lectureUrl && (
                                <p
                                  className='text-blue-500 cursor-pointer hover:underline'
                                  onClick={() => {
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }}
                                >
                                  Watch
                                </p>
                              )}
                              <p>
                                {humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, {
                                  units: ['h', 'm'],
                                })}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>

          <div className='flex items-center gap-3 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* Right column */}
        <div className='md:mt-10'>
          {playerData ? (
            <div>
              <YouTube
                videoId={getYouTubeId(playerData.lectureUrl)}
                iframeClassName='w-full aspect-video rounded-lg shadow'
              />
              <div className='flex justify-between items-center mt-3'>
                <p className='font-medium text-gray-700'>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className='text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                >
                  {progressData && progressData.lectureCompleted?.includes(playerData.lectureId)
                    ? 'Completed ✓'
                    : 'Mark Complete'}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData ? courseData.courseThumbnail : ''}
              alt={courseData?.courseTitle}
              className='w-full rounded-lg shadow'
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default Player
