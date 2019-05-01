import React from 'react'
import '../styles/SearchResults.css'
import Rate from './Rate'
import { Link } from 'react-router-dom'

const ResultItem = ({ title, digest, id }) => (
  <li>
    <Link to={`/news/${id}`}>
      <h2>{title}</h2>
    </Link>
    <h4>{digest}</h4>
    <Rate
      handleRating={isLiked => event => {
        if (isLiked) {
          trackLiked(1)
          console.log('like')
        } else {
          trackDisliked(1)
          console.log('hate')
        }
      }}
    />
  </li>
)

const SearchResults = ({ results, trackLiked, trackDisliked }) => {
  return (
    <div className='results-container'>
      <ul className='results-list'>
        {results.map((r, i) => (
          <ResultItem key={i} id={i} title='This is a News' digest={r} />
        ))}
      </ul>
    </div>
  )
}

export default SearchResults
