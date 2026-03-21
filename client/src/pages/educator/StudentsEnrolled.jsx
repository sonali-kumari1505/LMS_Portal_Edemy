import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading'
const StudentsEnrolled = () => {
const [enrolledStudents,setEnrolledStudents]=useState(null)
const fetchEnrolledStudents=async()=>{
  setEnrolledStudents(dummyStudentEnrolled)
}
useEffect(()=>{
  fetchEnrolledStudents()
},[])
  return enrolledStudents?(
    <div >
      <div>
        <table>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
          <tr>
            <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
            <th className='px-4 py-3 font-semibold'>Student Name</th>
              <th className='px-4 py-3 font-semibold'>Course Title</th>
   <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>             
          </tr>
          </thead>
        </table>
      </div>
    </div>
  ):<Loading/>
}

export default StudentsEnrolled
