import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { spawn } from 'child_process'
import { PythonShell } from 'python-shell'

import fetch from 'node-fetch'

SourceMapSupport.install()
const PYDIR = path.join(__dirname, 'server_py', 'feedback.py')
// const PYPATH = path.join(PYDIR, 'feedback.py')

const app = express()
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(cors())

app.listen(3000, () => {
  console.log('App started on port 3000!!')
})

app.get('/api/test', (req, res) => {
  const pyProcess = spawn('python3', [
    path.resolve('./server_py/feedback.py'),
    'it is not something',
    [1, 3, 5],
    [2, 4, 5],
  ])
  pyProcess.stdout.on('data', data => {
    console.log(data)
    // newQuery = data
    res.send(data)
  })
})

app.post('/api/search', (req, res) => {
  console.log(req.body)
  const { query, liked_keywords, disliked_keywords } = req.body

  /*
  process the data from frontend here
  call python scripts here
  */

  // let newQuery = ''
  if (liked_keywords.length > 0 || disliked_keywords.length > 0) {
    const pyProcess = spawn('python3', [
      path.resolve('./server_py/feedback.py'),
      query,
      liked_keywords.join('#'),
      disliked_keywords.join('#'),
    ])

    pyProcess.on('error', error => {
      console.log(error.stack)
    })

    pyProcess.stdout.on('data', data => {
      console.log(data.toString())
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
  } else {
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
  }

  // const encoded = newQuery.replace(' ', '%20')
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./static/index.html'))
})
