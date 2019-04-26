import React from 'react'
import '../styles/Paper.css'

const Paper = ({ text }) => {
  return (
    <div className='text-container'>
      <p>{text}</p>
    </div>
  )
}

export default Paper
