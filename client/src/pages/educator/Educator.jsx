import React from 'react'
import { Outlet } from 'react-router-dom'
const Educator = () => {
  return (
    <div>
      <p>educator page</p>
      <div>
        {<Outlet />}
      </div>
      
    </div>
  )
}

export default Educator
