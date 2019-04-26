import React from 'react'
import '../styles/Search.css'

const Search = ({ query, handleInputChange, handleSearchAction }) => {
  return (
    <div className='search-container'>
      <input
        value={query}
        onChange={event => handleInputChange(event)}
        onKeyPress={event => handleSearchAction(event)}
      />
    </div>
  )
}

export default Search
