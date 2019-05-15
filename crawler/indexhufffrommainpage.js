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
		  $('a').each(function(i, el) {
		  let href = this.attribs.href
			if (href && /\/entry\//g.test(href)) {
				if (!/https?/g.test(href)) {
				   const idxEntry = href.indexOf('entry')
				   href = `https://www.huffpost.com/${href.substring(idxEntry)}`
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
		//console.log('link of the file we are indexing :', href)

		if (res.request._redirect.redirectsFollowed != 0 && (!href || !/\https?:\/\/www.huffpost.com\/(news|entry)\//g.test(href) || /\https?:\/\/www.huffpost.com\/news\/topic\//g.test(href))) {
			console.log('redirected')
			done();
		}
		else{		
			if (!/<!DOCTYPE html>/g.test(res.body)){
				console.log('not an html file')
				done();
			}
			else{
				// put the css-selector of title here
				const title = $('h1').text().replace(/[.*+?^${}()|[\]\\/<>":]/g, '-')
				if (!title || /^\s+$/.test(title)) {
					console.log('title issue')
					if ($('div.error-code').text() == 404){
						console.log('error 404')
					}
					done();
				}
				else{	
					//console.log(title)
					
					const date = $('div.timestamp > span').text().substring(0, 11)
					if (!date){
						console.log('date issue')
						done();
					}
					else{ 
						//console.log(date)

						// put the css-selector of new body paragraphs here
						const content = $('div.entry__text > div > p')
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
							//console.log(content)
							
							added_to_queue = 0
						
							//put the css-selector of links to other news here
							$('a').each(function(i, el){
								let href = el.attribs.href			  
								if (href && /^https?:\/\/www.huffpost.com\/entry\//g.test(href) && !(el.attribs.class == 'listicle__slide-anchor')) {	
								  //console.log(href)

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
							  const newsJSON = { title, content, date, href }
							  console.log('added_to_queue : ', added_to_queue)
							  done(writeData(newsJSON))
							  console.log(c.queueSize)
							  }
							}
						}
					}
				}
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

var added_to_queue = 0


c.queue('https://m.huffpost.com/')
