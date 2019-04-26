import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

SourceMapSupport.install()
const app = express()
app.use(express.static('/static'))
app.use(bodyParser.json())
app.use(cors())

app.listen(3000, () => {
  console.log('App started on port 3000!!')
})

app.get('/api/test', (req, res) => {
  console.log('got')
  res.json({ message: 'ok' })
})
app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'))
})
