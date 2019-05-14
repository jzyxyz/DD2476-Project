const Crawler = require('crawler')
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve('../crawled_data')

const writeData = json => {
  filePath = path.join(DATA_DIR, `${json.title.replace(/\s+/g, '-').replace(/[.*+?^${}()|[\]\\/<>":]/g, '-')}.json`)
  fs.writeFile(filePath, JSON.stringify(json), function(err) {
    if (err) {
      return console.log(err)
    }
    console.log(`${json.title} was saved!`)
	
	nb_file_saved += 1
	console.log('nb of file saved : ', nb_file_saved)
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

	  if (first_call){
		  $('div.gs-c-promo-body > div > a').each(function(i, el) {
		  let href = this.attribs.href
			if (!href || !/\/news\//g.test(href)) {
			  return null
			} else {
				if (!/https?/g.test(href)) {
				   href = `https://www.bbc.com${href}`
			    }
				//console.log(href)
				  
				const key = hash(href)
				if (dict[key] == null){
				   dict[key] = href
				   c.queue(href)
				}
				else{
				   nb_repetition += 1
				   console.log('nb of repetitions : ', nb_repetition)
				}
			}
		  })
		  first_call = false
	  }
	  else{
	  	  
		  // put the css-selector of title here
		  const title = $('h1').text()
		  //console.log(title)
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
		  
		  if (!content){
			return null
		  }
		   // console.log(content)

		  //put the css-selector of links to other news here
		  $('a.story-body__link').each(function(i, el) {
			let href = el.attribs.href
			if (!href || !/\/news\//g.test(href)) {
			  return null
			} else {
			  if (!/https?/g.test(href)) {
				href = `https://www.bbc.com${href}`
			  }
			  // console.log(href)
			  
			  const key = hash(href)
			  if (dict[key] == null){	
				dict[key] = href
				c.queue(href)
			  }
			  else{
				  nb_repetition += 1
				  console.log('nb of repetitions : ', nb_repetition)
			  }
			}
		  })
		  // console.log(JSON.stringify({ title, content, date, href }))
		  const newsJSON = { title, content, date, href }
		  done(writeData(newsJSON))
		}
	}
  },
})

c.on('drain', function() {
  console.log('crawling is done')
})

let hash = require('string-hash')

var dict = new Object();
var nb_repetition = 0
var nb_file_saved = 0

var first_call = true

c.queue('https://www.bbc.com/news')
