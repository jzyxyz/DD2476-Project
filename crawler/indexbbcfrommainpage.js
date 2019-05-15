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
	
	nb_files_saved += 1
	console.log('nb of file saved : ', nb_files_saved)
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
			if (href && /\/news\//g.test(href)) {
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
				   nb_repetitions += 1
				   console.log('nb of repetitions : ', nb_repetitions)
				}
			}
		  })
		  first_call = false
		  done();
	  }
	  else{
		  //console.log(href)
	  	  
		  // put the css-selector of title here
		  const title = $('h1').text()
		  //console.log(title)
		  if (!title || /^\s+$/.test(title)) {
			console.log('title issue')
			done();
		  }
		  else{  
			  const date = $('div.date').data('datetime')
			  if (!date){
				console.log('date issue')
				done();
			  }
			  else{

				  // put the css-selector of new body paragraphs here
				  const content = $('div.story-body__inner > p')
					.map(function(i, el) {
					  return $(this).text()
					})
					.get()
					.join('\n')
				  
				  if (!content){
					console.log('content issue')
					done();
				  }
				  else{  
				    // console.log(content)
					added_to_queue = 0

				  //put the css-selector of links to other news here
				  $('a.story-body__link').each(function(i, el) {
					let href = el.attribs.href
					if (href && /\/news\//g.test(href)) {
					  if (!/https?/g.test(href)) {
						href = `https://www.bbc.com${href}`
					  }
					  // console.log(href)
					  
					  const key = hash(href)
					  if (dict[key] == null){	
						dict[key] = href
						added_to_queue +=1
						c.queue(href)
					  }
					  else{
						  nb_repetitions += 1
						  console.log('nb of repetitions : ', nb_repetitions)
					  }
					}
				  })
				  // console.log(JSON.stringify({ title, content, date, href }))
				  console.log('added_to_queue : ', added_to_queue)
				  const newsJSON = { title, content, date, href }
				  done(writeData(newsJSON))
				  console.log(c.queueSize)
				}
			  }
		}
	  }
	}
  }
})

c.on('drain', function() {
  console.log('crawling is done')
})

let hash = require('string-hash')

var dict = new Object();
var nb_repetitions = 0
var nb_files_saved = 0

var first_call = true

var added_to_queue = 0

c.queue('https://www.bbc.com/news')
