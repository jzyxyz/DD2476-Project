def feedback(query,titles,likes,dislikes):
    '''

    '''
    terms = []
    queryWords = query.split()

    for term in queryWords:
        terms.append(term)

    titleTerms = []


    for idx, title in enumerate(titles):
        titleTerms.append(title.split())
        for term in titleTerms[idx]:
            if term not in terms:
                terms.append(term)

    termVotes = dict((el,0) for el in terms) 

    for i in range(len(titleTerms)):
        if likes[i] == True:
            vote = 1
        elif dislikes[i] == True:
            vote = -1
        for term in titleTerms[i]:
            termVotes[term] += vote
    
    newQuery = ''

    for term in terms:
        if termVotes[term] > 0 or (termVotes[term] == 0 and term in queryWords):
            newQuery += term + ' '

    if newQuery != '':
        newQuery = newQuery[0:len(newQuery)]
        return newQuery
    else:
        return query

query = "china news what the"
titles = ["what is new in china", "we hate the news"]

likes = [True,False]
dislikes = [False,True]

newQuery = feedback(query,titles,likes,dislikes)
print(newQuery)


    






