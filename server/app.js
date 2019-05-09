import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

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
      res.send(queryRes)
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./static/index.html'))
})

export default app
