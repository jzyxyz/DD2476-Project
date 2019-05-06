import React from 'react'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Card from './ResultItem'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
})

const SearchResults = ({ hits, trackLiked, trackDisliked }) => {
  if (!hits) return null
  return (
    <Grid item xs={12} container justify='space-around' alignItems='flex-start' spacing={32} style={{ marginTop: 8 }}>
      {hits.map((hit, i) => {
        const {
          _id,
          _source: { title, content },
        } = hit
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={_id}>
            <Card
              id={_id}
              title={title}
              digest={content.slice(0, 250) + '...'}
              // trackLiked={trackLiked}
              // trackDisliked={trackDisliked}
              handleRating={isLiked => event => {
                if (isLiked) {
                  trackLiked(_id)
                  console.log('like')
                } else {
                  trackDisliked(_id)
                  console.log('hate')
                }
              }}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default withStyles(styles)(SearchResults)
