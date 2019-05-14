import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import elasticsearch from 'elasticsearch'
import { spawn } from 'child_process'

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
  client
    .search({
      index: 'news_1',
      body: {
        query: {
          match: {
            title: 'china',
          },
        },
      },
    })
    .then(queryRes => {
      res.json(queryRes)
    })
})

const logStack = ({ stack }) => {
  res.status(500).json({
    error: {
      message: 'internal server error',
    },
  })
  console.log(stack)
}

app.post('/api/search', (req, res) => {
  console.log(req.body)
  const { query, liked_keywords, disliked_keywords, liked } = req.body

  if (liked_keywords.length === 0 && disliked_keywords.length === 0) {
    // no traces yet
    const encoded = query.replace(' ', '%20')
    client
      .search({
        index: 'news_1',
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
      .catch(logStack)
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
      console.log(data.toString())
      const encoded = query.replace(' ', '%20')
      client
        .search({
          index: 'news_1',
          body: {
            query: {
              match: {
                content: encoded,
              },
            },
            size: 30,
          },
        })
        .then(queryRes => {
          // console.log(queryRes)
          queryRes.hits.hits = queryRes.hits.hits.filter(h => !liked.includes(h._id))
          res.json(queryRes)
        })
        .catch(logStack)
    })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./static/index.html'))
})

export default app
