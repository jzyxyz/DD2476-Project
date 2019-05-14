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
	console.log('nb of files saved : ', nb_files_saved)
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
		  $('a').each(function(i, el) {
		  let href = this.attribs.href
			if (!href || !/^\/20/g.test(href)) {
			  return null
			} else {
				href = `https://www.nytimes.com${href}`
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
	  }
	  else{
	  
		  //console.log('link of the file we are indexing :', href)
		  
		  // put the css-selector of title here	  
		  const title = $('h1').text()
		  //console.log(title)
		  
		  if (!title || /^\s+$/.test(title)) {
			console.log('invalid title')
			console.log(c.queueSize)
			return null
		  }
		  
		  //const date = $('time').text() 
		  var date = $('div.css-acwcvw.epjyd6m0 > ul.css-1w5cs23.epjyd6m2 > li:nth-child(1) > time').text()
			if (!date){
				var date = $('time.dateline').text()
				if (!date){
					var date = $('time.elhp5ji0.css-17kdze.e16638kd0').text()
					if (!date){
						console.log('date issue')
						console.log(href)
						console.log(c.queueSize)
						return null
					}
				}
			}
		  //console.log(date)	

			
		  // put the css-selector of new body paragraphs here
		  var content = $('#story > section > div > div > p') 
			.map(function(i, el) {
			  return $(this).text()
			})
			.get()
			.join('\n')
			
		  if (!content){
		
			var content = $('p.story-body-text.story-content') 
			.map(function(i, el) {
			  return $(this).text()
			})
			.get()
			.join('\n')
			
			if (!content){
				console.log('content issue')
				console.log(c.queueSize)
				return null
			}
		  }
		  //console.log(content)	
			
		  //put the css-selector of links to other news here
		  $('a').each(function(i, el) {
			let href = el.attribs.href
			if (!href || !/^https?:\/\/www.nytimes.com\/20/g.test(href)) {
			  return null
			} else {
			
			  if (href.indexOf('.html') ==  -1){
				console.log(href)
				console.log('.html missing')
			  }
			  else{
				  const idx = href.indexOf('.html')
				  href = href.substring(0, idx + 5)
				  //console.log(href)
			  }
			  
			  const key = hash(href)
			  if (dict[key] == null){
				dict[key] = href
				c.queue(href)
				//console.log(href)
			  }
			  else{
				  nb_repetitions += 1
				  console.log('nb of repetitions : ', nb_repetitions)
			  }
			}
		  })
		  const newsJSON = { title, content, date, href }
		  done(writeData(newsJSON))
		}
	}
  },
})

c.on('drain', function() {
  console.log('crawling is done')
  console.log('nb of repetitions : ', nb_repetitions)
  console.log('nb of file saved : ', nb_files_saved)
})

let hash = require('string-hash')

var dict = new Object();
var nb_repetitions = 0
var nb_files_saved = 0

var first_call = true

c.queue('https://www.nytimes.com')
