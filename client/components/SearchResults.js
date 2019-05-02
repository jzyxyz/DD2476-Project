import React from 'react'
import '../styles/SearchResults.css'
import Rate from './Rate'
import { Link } from 'react-router-dom'

const ResultItem = ({ title, digest, id, trackDisliked, trackLiked }) => (
  <li>
    <Link to={`/news/${id}`}>
      <h2>{title}</h2>
    </Link>
    <h4>{digest}</h4>
    <Rate
      handleRating={isLiked => event => {
        if (isLiked) {
          trackLiked(id)
          console.log('like')
        } else {
          trackDisliked(id)
          console.log('hate')
        }
      }}
    />
  </li>
)

const SearchResults = ({ hits, trackLiked, trackDisliked }) => {
  if (!hits) return null
  return (
    <div className='results-container'>
      <ul className='results-list'>
        {hits.map((hit, i) => {
          const {
            _id,
            _source: { title, content },
          } = hit
          return (
            <ResultItem
              key={_id}
              id={_id}
              title={title}
              digest={content.slice(0, 250) + '...'}
              trackLiked={trackLiked}
              trackDisliked={trackDisliked}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default SearchResults
