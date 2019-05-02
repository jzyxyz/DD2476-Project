import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import fetch from 'node-fetch'

SourceMapSupport.install()
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
  const { query } = req.body
  const encoded = query.replace(' ', '%20')

  /*
  process the data from frontend here
  call python scripts here
  */

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
