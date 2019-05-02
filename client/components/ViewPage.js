import React, { useState, useEffect } from 'react'
import Paper from './Paper'

const ViewPage = props => {
  const { history } = props
  return (
    <div className='view-page'>
      <button onClick={history.goBack}>Go Back</button>
      <Paper text={props.hit._source.content} />
    </div>
  )
}

export default ViewPage
