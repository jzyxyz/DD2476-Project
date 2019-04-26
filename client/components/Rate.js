import React from 'react'
import '../styles/Rate.css'
const Rate = ({ isliked, handleRating }) => {
  return (
    <div className='rate-container'>
      <h3>Want more news like this one?</h3>
      <div className='like' onClick={handleRating(true)}>
        <div className='rate-text'>Yes</div>
      </div>
      <div className='dislike' onClick={handleRating(false)}>
        <div className='rate-text'>No</div>
      </div>
    </div>
  )
}

export default Rate
