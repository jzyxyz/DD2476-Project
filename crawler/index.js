const Crawler = require('crawler')
const fs = require('fs')
const path = require('path')

dataDir = path.join(__dirname, 'data')

const c = new Crawler({
  callback: (error, res, done) => {
    if (error) {
      console.log(error)
    } else {
      const { $ } = res
      const title = $('div.story-body > h1.story-body__h1').text()
      // console.log(title)
      if (/^\s+$/.test(title)) {
        return
      }
      // const digest = $('div.story-body__inner > p.story-body__introduction').text()
      const txt = $('div.story-body__inner > p')
        .map(function(i, el) {
          return $(this).text()
        })
        .get()
        .join('\n')
      // console.log(txt)

      $('a.story-body__link').each(function(i, el) {
        let href = el.attribs.href
        // console.log(href)
        if (href) {
          valid = /\/news\//g
          if (valid.test(href)) {
            if (!/https?/g.test(href)) {
              href = `https://www.bbc.com${href}`
            }
            console.log(href)
            c.queue(href)
          }
        }
      })

      filePath = path.join(dataDir, `${title.replace(/\s+/g, '-')}.txt`)
      fs.writeFile(filePath, txt, function(err) {
        if (err) {
          return console.log(err)
        }
        console.log(`${title} was saved!`)
      })

      done()
    }
  },
})
c.on('drain', function() {
  console.log('crawling is done')
})
c.queue('https://www.bbc.com/news/technology-48103617')
