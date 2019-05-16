import React, { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    margin: 20,
    padding: 30,
  },
})

const ViewPage = props => {
  const { history, classes } = props
  return (
    <div className='view-page'>
      <IconButton onClick={history.goBack}>
        <ArrowBackIcon />
      </IconButton>
      <Paper className={classes.root}>
        <Typography component='p' style={{ fontSize: 'large' }}>
          {props.hit._source.content}
        </Typography>
      </Paper>
    </div>
  )
}

export default withStyles(styles)(ViewPage)
