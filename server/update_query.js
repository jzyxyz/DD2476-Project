const template = {
  // index: 'news_1', // to change
  body: {
    query: {
      bool: {
        should: [],
      },
    },
    size: 100,
  },
}

const boostQuery = (queryList, score) => {
  queryList.forEach((word, idx) => {
    template.body.query.bool.should.push({
      match: {
        content: {
          query: word,
          boost: score[idx],
        },
      },
    })
  })

  return template
}

export { boostQuery }
