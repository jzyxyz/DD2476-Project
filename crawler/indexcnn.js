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
	  	  	  
      // put the css-selector of title here
	  const title = $('h1').text().replace(/[.*+?^${}()|[\]\\/<>":]/g, '-')
	  
      if (!title || /^\s+$/.test(title)) {
		console.log('invalid title')
        done();
      }
	  else{
		 //console.log(title)

		  const upload_date = $('p.update-time').text()	  	  
		  const month = upload_date.match(/January|February|March|April|May|June|July|August|September|October|November|December/g)
		  const idxMonth = upload_date.indexOf(month)
		  
		  const date = upload_date.substring(idxMonth, upload_date.length)
		  if (!date){
			  console.log('date issue')
			  done();
		  }
		  else{ 
			  console.log(date)
				  
			  const content = $('#body-text > div.l-container > div').map(function(i, el){
				// before read_more button
				if ($(this).attr('class') != 'zn-body__read-all' && $(this).attr('class') != 'zn-body__read-more'){
					return $(this).text()
				}
				// after read_more button
				if ($(this).attr('class') == 'zn-body__read-all'){	
					const read_more = $('div.zn-body__read-all > div').map(function(i, el){
						if ($(this).attr('class') == 'zn-body__paragraph'){
						 return $(this).text()
						}
					}).get()
					.join('\n')
					return read_more
				}	
			 }).get()
			 .join('\n')
			 
			 if (!content){
				console.log('content issue')
				done();
			 }
			 else{
				 // console.log(content)
				 
				 added_to_queue = 0
					
				  //put the css-selector of links to other news here
				  $('a').each(function(i, el) {
				  let href = this.attribs.href
					if (href && (/\https:\/\/edition.cnn.com\/20/g.test(href) || /\https?:\/\/(www.)?cnn.com\/20/g.test(href))) {
					  //console.log(href)
					  
					  const key = hash(href)
					  if (dict[key] == null){
						dict[key] = href
						c.queue(href)	
						added_to_queue +=1
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

var added_to_queue = 0

// init with a news link
c.queue('https://edition.cnn.com/2019/05/09/asia/china-trade-talks-trump-intl/index.html')
