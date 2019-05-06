import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
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
    height: 0,
    paddingTop: '56.25%', // 16:9
    backgroundColor: red[300],
  },
  actions: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: red[500],
  },
  content: {
    height: 125,
  },
})

const ResultCard = ({ classes, title, source, date, digest, handleRating, id }) => {
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label='Recipe' className={classes.avatar}>
            P
          </Avatar>
        }
        title={'The New York Times'} //source
        subheader={new Date().toDateString()}
      />
      <Link to={`/news/${id}`}>
        <CardMedia className={classes.media} />
      </Link>
      <CardContent>
        <Typography component='p' className={classes.content}>
          {digest}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton onClick={handleRating(true)}>
          <FavoriteIcon />
        </IconButton>
        <IconButton onClick={handleRating(false)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default withStyles(styles)(ResultCard)
