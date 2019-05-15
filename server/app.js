import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import elasticsearch from 'elasticsearch'
import _ from 'lodash'
import { spawn } from 'child_process'
import { boostQuery } from './update_query'

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error',
})

SourceMapSupport.install()
const app = express()
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(cors())

app.get('/api/test', (req, res) => {
  const pyProcess = spawn('python3', [
    path.resolve('./server_py/feedback.py'),
    'Chinese government',
    '#sweden',
    'czech#Korea#Japan',
  ])

  pyProcess.on('error', error => {
    console.log(error.stack)
    res.status(500).json({
      error: {
        message: 'internal server error',
      },
    })
  })

  pyProcess.stdout.on('data', data => {
    // console.log(data.toString())
    const processed = JSON.parse(data.toString())
    const { extended, score } = processed
    console.log('TCL: extended', extended.join(','))
    console.log('TCL:  score', score.join(','))
    const elastic_body = boostQuery(extended, score)
    console.log(elastic_body)
    // res.json(elastic_body)
    client
      .search({
        index: 'crawled_data',
        body: elastic_body.body,
      })
      .then(queryRes => {
        res.json(queryRes)
      })
      .catch(error => {
        res.status(500).json({
          error: {
            message: 'internal server error',
          },
        })
        console.log(error.stack)
      })
  })
})

//130.229.182.213:3000/api/search
app.post('/api/search', (req, res) => {
  console.log(req.body)
  const { query, liked_keywords, disliked_keywords, liked } = req.body

  if (liked_keywords.length === 0 && disliked_keywords.length === 0) {
    // no traces yet
    const encoded = query.replace(' ', '%20')
    client
      .search({
        index: 'crawled_data',
        body: {
          query: {
            match: {
              content: encoded,
            },
          },
          size: 16,
        },
      })
      .then(queryRes => {
        res.json(queryRes)
      })
      .catch(error => {
        res.status(500).json({
          error: {
            message: 'internal server error',
          },
        })
        console.log(error.stack)
      })
  } else {
    const pyProcess = spawn('python3', [
      path.resolve('./server_py/feedback.py'),
      query,
      liked_keywords.join('#'),
      disliked_keywords.join('#'),
    ])

    pyProcess.on('error', error => {
      console.log(error.stack)
      res.status(500).json({
        error: {
          message: 'internal server error',
        },
      })
    })

    pyProcess.stdout.on('data', data => {
      const processed = JSON.parse(data.toString())
      const { extended, score } = processed
      const formatted_score = score.map(s => s.toFixed(2))
      console.log('TCL: extended', extended.join(','))
      console.log('extended query lenght:', extended.length)
      console.log('TCL:  score', formatted_score.join(', '))
      const elastic_body = boostQuery(extended, formatted_score).body
      // console.log('TCL:  elastic_body ', elastic_body)
      client
        .search({
          index: 'crawled_data',
          body: elastic_body,
        })
        .then(queryRes => {
          // console.log(queryRes)
          queryRes.hits.hits = queryRes.hits.hits.filter(h => !liked.includes(h._id))
          Object.assign(queryRes, { newQuery: data.toString() })
          res.json(queryRes)
        })
        .catch(error => {
          res.status(500).json({
            error: {
              message: 'internal server error',
            },
          })
          console.log(error.stack)
        })
    })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./static/index.html'))
})

export default app
