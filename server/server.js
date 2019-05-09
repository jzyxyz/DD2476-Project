import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
const elasticsearch = require('elasticsearch')

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
})

client.ping(
  {
    requestTimeout: 1000,
  },
  function(error) {
    if (error) {
      console.trace('elasticsearch cluster is down!')
    } else {
      SourceMapSupport.install()

      const app = express()
      app.use(express.static('static'))
      app.use(bodyParser.json())
      app.use(cors())

      app.listen(3000, () => {
        console.log('App started on port 3000!!')
      })

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
    }
  },
)
