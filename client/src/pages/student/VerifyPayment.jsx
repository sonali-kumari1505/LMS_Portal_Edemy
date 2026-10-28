import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const VerifyPayment = () => {
  const { purchaseId } = useParams()
  const navigate = useNavigate()
  const { backendUrl, getToken, fetchUserEnrolledCourses } = useContext(AppContext)
  const [verifying, setVerifying] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const verify = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-payment`,
        { purchaseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success('Payment verified! Course enrolled successfully.')
        await fetchUserEnrolledCourses()
        navigate('/my-enrollments')
      } else {
        // Payment might not be processed yet, retry a few times
        if (retryCount < 5) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1)
          }, 3000) // retry after 3 seconds
        } else {
          toast.error('Payment verification timed out. Please check My Enrollments later.')
          navigate('/my-enrollments')
        }
      }
    } catch (error) {
      toast.error(error.message)
      navigate('/')
    }
  }

  useEffect(() => {
    if (purchaseId) {
      verify()
    }
  }, [purchaseId, retryCount])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
      <p className='mt-4 text-gray-600'>Verifying your payment...</p>
      {retryCount > 0 && (
        <p className='mt-2 text-sm text-gray-400'>
          Attempt {retryCount + 1} of 6...
        </p>
      )}
    </div>
  )
}

export default VerifyPayment
