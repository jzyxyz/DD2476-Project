import sys




def updateScores(queryWords,query_scores,terms,termVotes):

    newQuery = ''


    for i in range(len(terms)):
        currTerm = terms[i]
        if (i>len(queryWords)):
            query_scores.append(1+0.1*termVotes[currTerm])
        else:
            query_scores[i] += 0.1*termVotes[currTerm]
        newQuery += currTerm + ' '

    newQuery = newQuery[0:len(newQuery)]
    return newQuery,query_scores




def feedback(query, query_scores, likedKwords, dislikedKwords):

    terms = []
    queryWords = query.split()

    for term in queryWords:
        terms.append(term)

    titleTerms = []

    for idx, title in enumerate(likedKwords):
        titleTerms.append(title.split())
        for term in titleTerms[idx]:
            if term not in terms:
                terms.append(term)
    print(terms)
    for idx, title in enumerate(dislikedKwords):
        titleTerms.append(title.split())
        for term in titleTerms[idx+len(likedKwords)]:
            if term not in terms:
                terms.append(term)
    print(terms)
    termVotes = dict((el, 0) for el in terms)

    for i in range(len(titleTerms)):
        if i < len(likedKwords):
            vote = 1
        else:
            vote = -1
        for term in titleTerms[i]:
            termVotes[term] += vote


    newQuery, newScores = updateScores(query,query_scores,terms,termVotes)

    print(newQuery)
    print(newScores)
    sys.stdout.flush()

    return newQuery, newScores


print(sys.argv[1])
print(sys.argv[2])
# print(sys.argv[3])

# args = sys.argv[1].split(',')
# print(args)

# query = args[0]

# print(args[1])
# likedKwords = args[1].replace("[", "").replace("]", "").split(',')

# dislikedKwords = args[2].replace("[", "").replace("]", "").split(',')

# print(likedKwords)
# feedback(query, likedKwords, dislikedKwords)                                 