const Crawler = require('crawler')
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve('../crawled_data')

const writeData = json => {
  filePath = path.join(DATA_DIR, `${json.title.replace(/\s+/g, '-')}.json`)
  fs.writeFile(filePath, JSON.stringify(json), function(err) {
    if (err) {
      return console.log(err)
    }
    console.log(`${json.title} was saved!`)
  })
}

const c = new Crawler({
  callback: (error, res, done) => {
    if (error) {
      console.log(error)
    } else {
      const {
        $,
        request: {
          uri: { href },
        },
      } = res
      // put the css-selector of title here
      const title = $('div.story-body > h1.story-body__h1').text()
      // console.log(title)
      if (!title || /^\s+$/.test(title)) {
        return null
      }
      const date = $('div.date').data('datetime')
      // console.log(date)

      // put the css-selector of new body paragraphs here
      const content = $('div.story-body__inner > p')
        .map(function(i, el) {
          return $(this).text()
        })
        .get()
        .join('\n')
      // console.log(content)

      //put the css-selector of links to other news here
      $('a.story-body__link').each(function(i, el) {
        let href = el.attribs.href
        // console.log(href)
        if (!href || !/\/news\//g.test(href)) {
          return null
        } else {
          if (!/https?/g.test(href)) {
            href = `https://www.bbc.com${href}`
          }
          // console.log(href)
          c.queue(href)
        }
      })
      // console.log(JSON.stringify({ title, content, date, href }))
      const newsJSON = { title, content, date, href }
      done(writeData(newsJSON))
    }
  },
})

c.on('drain', function() {
  console.log('crawling is done')
})

// init with a news link
c.queue('https://www.bbc.com/news/world-latin-america-48128846')
