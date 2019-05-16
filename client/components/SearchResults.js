import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import ResultItem from './ResultItem'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
})

const SearchResults = ({ hits, trackLiked, disliked, trackDisliked, liked }) => {
  if (!hits) return null
  return (
    <Grid item xs={12} container justify='space-around' alignItems='flex-start' spacing={32} style={{ marginTop: 8 }}>
      {hits
        .filter(hit => !disliked.includes(hit._id))
        .map((hit, i) => {
          const {
            _id,
            _source: { title, content, tags, href, date },
          } = hit
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={_id}>
              <ResultItem
                id={_id}
                title={title}
                isliked={liked.includes(_id)}
                date={date}
                href={href}
                // TODO add more info here
                digest={content.slice(0, 250) + '...'}
                handleRating={isLiked => event => {
                  if (isLiked) {
                    trackLiked(_id, tags)
                    console.log(tags)
                    console.log('like')
                  } else {
                    // TODO replace this `title` with `keywords`
                    trackDisliked(_id, tags)
                    console.log(tags)
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
