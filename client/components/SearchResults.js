import React from 'react'
import '../styles/SearchResults.css'
import { Link } from 'react-router-dom'

const ResultItem = ({ title, digest, id }) => (
  <Link to={`/news/${id}`}>
    <li>
      <h2>{title}</h2>
      <h4>{digest}</h4>
    </li>
  </Link>
)

const SearchResults = ({ results }) => {
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
