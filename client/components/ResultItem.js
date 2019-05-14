import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import red from '@material-ui/core/colors/red'
import FavoriteIcon from '@material-ui/icons/Favorite'
import DeleteIcon from '@material-ui/icons/DeleteForever'
import { Link } from 'react-router-dom'

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    // height: 0,
    backgroundColor: red[300],
    padding: '28.25% 0px',
    position: 'relative',
    textAlign: 'center',
    color: 'white',
  },
  actions: {
    display: 'flex',
    marginTop: 16,
  },
  avatar: {
    backgroundColor: red[500],
  },
  content: {
    height: 125,
  },
  fill: {
    color: red[300],
  },
  title: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-55%, -70%)',
    color: 'floralwhite',
    letterSpacing: '0.2px',
    textDecoration: 'none',
    fontFamily: 'monospace',
    fontSize: 'x-large',
    width: '80%',
  },
})

const ResultCard = ({ classes, title, source, date, digest, handleRating, id, isliked }) => {
  const isFilled = isliked ? classes.fill : ''

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>
            {/* //TODO change this according to category */}
            {'P'}
          </Avatar>
        }
        title={'The New York Times'} //source
        subheader={new Date().toDateString()}
      />
      <Link to={`/news/${id}`}>
        {/* <CardMedia className={classes.media} /> */}
        <div className={classes.media}>
          <h3 className={classes.title}>{title}</h3>
        </div>
      </Link>
      <CardContent>
        <Typography component='p' className={classes.content}>
          {digest}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton onClick={handleRating(true)}>
          <FavoriteIcon className={isFilled} />
        </IconButton>
        <IconButton onClick={handleRating(false)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default withStyles(styles)(ResultCard)
