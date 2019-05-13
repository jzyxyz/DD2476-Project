import React, { Component } from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import ViewPage from './components/ViewPage'
import SearchInput from './components/SearchInput'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import THEME from './styles/theme'
import SearchResult from './components/SearchResults'
import Loading from './components/Loading'
import Grid from '@material-ui/core/Grid'
import red from '@material-ui/core/colors/red'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import Button from '@material-ui/core/Button'
import HistoryIcon from '@material-ui/icons/History'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import DeleteIcon from '@material-ui/icons/DeleteForever'
import FavoriteIcon from '@material-ui/icons/Favorite'

const responseHandler = response => {
  const { statusText, ok } = response
  if (!ok) {
    return response.json().then(({ error }) => {
      throw Error(`${statusText}: ${error}`)
    })
  }
  return response.json()
}

const theme = createMuiTheme(THEME)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      liked: [],
      disliked: [],
      query: '',
      loading: false,
      results: [],
      liked_keywords: [],
      disliked_keywords: [],
    }
    this.trackLiked = this.trackLiked.bind(this)
    this.trackDisliked = this.trackDisliked.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSearchAction = this.handleSearchAction.bind(this)
  }

  handleInputChange(event) {
    this.setState({ query: event.target.value })
  }

  handleSearchAction(event) {
    if (event.key === 'Enter') {
      this.setState({ loading: true })
      const { liked, disliked, query, liked_keywords, disliked_keywords } = this.state
      const body = {
        liked,
        disliked,
        query,
        liked_keywords,
        disliked_keywords,
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
    }
  }

  handleMoreNewsClick = () => {
    this.setState({ loading: true })
    const { liked, disliked, query, liked_keywords, disliked_keywords } = this.state
    const body = {
      liked,
      disliked,
      query,
      liked_keywords,
      disliked_keywords,
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
  }

  trackLiked = (docId, keywords) => {
    this.setState({
      liked: this.state.liked.concat(docId),
      liked_keywords: this.state.liked_keywords.concat(keywords),
    })
  }

  trackDisliked = (docId, keywords) => {
    const hits = this.state.results.hits.slice()
    const filtered = hits.filter(h => h._id != docId)
    this.setState({
      disliked: this.state.disliked.concat(docId),
      results: { hits: filtered },
      disliked_keywords: this.state.disliked_keywords.concat(keywords),
    })
  }

  toggleLoading() {
    this.setState({ loading: !this.state.loading })
  }

  render() {
    const {
      query,
      loading,
      results: { hits },
      liked,
      disliked,
    } = this.state

    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <Switch>
            <Route
              path='/search'
              render={props => (
                <Grid container direction='column'>
                  <Grid item xs={12}>
                    <SearchInput
                      query={query}
                      handleInputChange={this.handleInputChange}
                      handleSearchAction={this.handleSearchAction}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: 16 }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() =>
                        this.setState({ liked: [], disliked: [], liked_keywords: [], disliked_keywords: [] })
                      }
                    >
                      <HistoryIcon /> {'clear tracking history'}
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      style={{ marginLeft: 16 }}
                      onClick={this.handleMoreNewsClick}
                    >
                      <AutorenewIcon /> {'more similiar news'}
                    </Button>
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: 16 }}>
                    <Chip
                      color='primary'
                      label={`You have liked ${liked.length} passages`}
                      avatar={
                        <Avatar>
                          <FavoriteIcon />
                        </Avatar>
                      }
                      variant='outlined'
                    />
                    <Chip
                      style={{ marginLeft: 24 }}
                      color='secondary'
                      label={`You have liked ${disliked.length} passages`}
                      avatar={
                        <Avatar>
                          <DeleteIcon />
                        </Avatar>
                      }
                      variant='outlined'
                    />
                  </Grid>
                  {loading ? (
                    <Loading />
                  ) : (
                    <SearchResult
                      {...props}
                      trackLiked={this.trackLiked}
                      trackDisliked={this.trackDisliked}
                      hits={hits}
                      liked={liked}
                      toggleLoading={this.toggleLoading}
                    />
                  )}
                </Grid>
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
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}

export default App
