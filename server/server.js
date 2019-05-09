import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { spawn } from 'child_process'
import fetch from 'node-fetch'

SourceMapSupport.install()
const PYDIR = path.join(__dirname, 'server_py')
const PYPATH = path.join(PYDIR, 'feedback.py')

const app = express()
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(cors())

app.listen(3000, () => {
  console.log('App started on port 3000!!')
})

app.get('/api/test', (req, res) => {
  console.log('got it')
  res.json({ message: 'oj8k!!' })
})

app.post('/api/search', (req, res) => {
  console.log(req.body)
  const { query, like, dislike } = req.body

  /*
  process the data from frontend here
  call python scripts here
  */

  // let newQuery = ''
  // const process = spawn('python3', [PYPATH, query, like, dislike])
  // process.stdout.on('data', data => {
  //   console.log(data)
  //   newQuery = data
  // })
  // const encoded = newQuery.replace(' ', '%20')
  const encoded = query.replace(' ', '%20')

  fetch(`http://localhost:9200/news_1/_search?q=title:${encoded}`)
    .then(queryRes => {
      if (!queryRes.ok) {
        return queryRes.json().then(({ error }) => {
          throw Error(`${error}`)
        })
      }
      return queryRes.json()
    })
    .then(queryResults => {
      res.json(queryResults)
    })
    .catch(error => {
      console.log(error.stack)
      res.status(500).json({ error: { message: 'internal server error' } })
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./static/index.html'))
})
