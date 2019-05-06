const request = require('request')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

request('https://edition.cnn.com', function(error, response, html) {
  if (!error && response.statusCode == 200) {
    const dom = new JSDOM(html)
    const links = Array.from(dom.window.document.querySelectorAll('a'))
    // console.log(dom.window.document.querySelectorAll('a'))
    console.log(links[160].href)
    // const newslinks = links.filter(l => /edition\.cnn\.com/.test(l.href)).map(l => l.href)
    // console.log(newslinks)
    // console.log('----------------------------------')
  }
})
