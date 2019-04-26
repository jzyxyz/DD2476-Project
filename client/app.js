import React, { Component } from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import ViewPage from './components/ViewPage'
import SearchBox from './components/Search'
import SearchResult from './components/SearchResults'
import Loading from './components/Loading'
import test_reulsts from './components/test_search_results'

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
      // this.setState({ loading: true })
      console.log('hittt')
      this.setState({ results: test_reulsts })
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
    const { query, loading, results } = this.state
    const routing = (
      <Switch>
        <Route
          path='/search'
          render={props => <SearchResult {...props} results={results} toggleLoading={this.toggleLoading} />}
        />
        <Route
          path='/news/docId'
          render={props => (
            <ViewPage
              {...props}
              trackLiked={this.trackLiked}
              trackDisliked={this.trackDisliked}
              toggleLoading={this.toggleLoading}
            />
          )}
        />
      </Switch>
    )
    return (
      <BrowserRouter>
        <SearchBox
          query={query}
          handleInputChange={this.handleInputChange}
          handleSearchAction={this.handleSearchAction}
        />
        {loading ? <Loading /> : routing}
      </BrowserRouter>
    )
  }
}

export default App
