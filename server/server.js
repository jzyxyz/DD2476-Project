import elasticsearch from 'elasticsearch'
import app from './app'

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
      app.listen(3000, () => {
        console.log('App started on port 3000!!')
      })
    }
  },
)
