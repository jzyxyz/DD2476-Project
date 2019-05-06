import React from 'react'
import TextField from '@material-ui/core/TextField'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  searchInput: {
    // ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  resize: {
    fontSize: 'xx-large',
  },
})

const Search = ({ query, handleInputChange, handleSearchAction, classes }) => {
  return (
    <TextField
      autoFocus={true}
      placeholder='Search for news here'
      fullWidth
      margin='normal'
      value={query}
      onChange={event => handleInputChange(event)}
      onKeyPress={event => handleSearchAction(event)}
      InputProps={{
        classes: {
          input: classes.resize,
        },
      }}
    />
  )
}

export default withStyles(styles)(Search)
