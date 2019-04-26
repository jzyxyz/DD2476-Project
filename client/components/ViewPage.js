import React, { useState, useEffect } from 'react'
import Paper from './Paper'
import test_text from './text'
import Loading from './Loading'
import Rate from './Rate'

const ViewPage = ({ trackLiked, trackDisliked }) => {
  const [text, setText] = useState(test_text)
  // useEffect(() => )
  return (
    <div className='App'>
      <div>
        <Rate
          handleRating={isLiked => event => {
            if (isLiked) {
              trackLiked(1)
            } else {
              trackDisliked(1)
            }
          }}
        />
        <Paper text={text} />
      </div>
    </div>
  )
}

export default ViewPage
