import React, { useState, useEffect } from 'react'
import Paper from './Paper'
import test_text from './text'
import Loading from './Loading'

const ViewPage = props => {
  const [text, setText] = useState(test_text)
  // useEffect(() => )
  const { history, loading } = props
  return (
    <div className='view-page'>
      <button onClick={history.goBack}>Go Back</button>
      <Paper text={text} />
    </div>
  )
}

export default ViewPage
