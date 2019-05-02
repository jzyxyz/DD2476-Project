import React, { Component } from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import ViewPage from './components/ViewPage'
import SearchBox from './components/Search'
import SearchResult from './components/SearchResults'
import Loading from './components/Loading'

const responseHandler = response => {
  const { statusText, ok } = response
  if (!ok) {
    return response.json().then(({ error }) => {
      throw Error(`${statusText}: ${error}`)
    })
  }
  return response.json()
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      liked: [],
      disliked: [],
      query: '',
      loading: false,
      results: [],
    }
    this.trackLiked = this.trackLiked.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSearchAction = this.handleSearchAction.bind(this)
  }

  handleInputChange(event) {
    this.setState({ query: event.target.value })
  }

  handleSearchAction(event) {
    if (event.key === 'Enter') {
      this.setState({ loading: true })
      const { liked, disliked, query } = this.state
      const body = {
        liked,
        disliked,
        query,
      }
      fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), // body data type must match "Content-Type" header
      })
        .then(responseHandler)
        .then(({ hits }) => {
          this.setState({ results: hits, loading: false })
        })
        .catch(error => {
          alert(error.message)
        })
      // this.setState({ results: test_reulsts })
    }
  }

  trackLiked = docId => {
    this.setState({ liked: this.state.liked.concat(docId) })
  }

  trackDisliked = docId => {
    this.setState({ disliked: this.state.disliked.concat(docId) })
  }

  toggleLoading() {
    this.setState({ loading: !this.state.loading })
  }

  render() {
    const {
      query,
      loading,
      results: { hits },
    } = this.state

    return (
      <BrowserRouter>
        <Switch>
          <Route
            path='/search'
            render={props => (
              <div className='searchpage-container'>
                <SearchBox
                  query={query}
                  handleInputChange={this.handleInputChange}
                  handleSearchAction={this.handleSearchAction}
                />
                {loading ? (
                  <Loading />
                ) : (
                  <SearchResult
                    {...props}
                    trackLiked={this.trackLiked}
                    trackDisliked={this.trackDisliked}
                    hits={hits}
                    toggleLoading={this.toggleLoading}
                  />
                )}
              </div>
            )}
          />
          <Route
            path='/news/:docId'
            render={props => (
              <ViewPage
                {...props}
                toggleLoading={this.toggleLoading}
                hit={hits.find(h => h._id == props.match.params.docId)}
              />
            )}
          />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
