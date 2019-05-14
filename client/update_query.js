
// dumb test :
newQuery = ['non', 'oui', 'no', 'yes']
console.log(newQuery)
newScores = [1.1 , 1.2, 1.3, 1.4]
// 

var query = {
	index: 'news_1', // to change
	body: {
		"query": {
			"bool": {
			  "should": [
			  	]
			}
		  }
	}
}

console.log(query)

console.log(query.body.query.bool.should)

newQuery.map(function(i, el){
	console.log(i)
	console.log(el)
	console.log(newScores[el])
	query.body.query.bool.should.push({
				  "match": {
					"content": {
					  "query": i,
					  "boost": newScores[el]
					}
				  }
				})
	console.log(query.body.query.bool.should)
	console.log(query.body.query.bool.should[el])
})
