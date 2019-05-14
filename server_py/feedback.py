import sys




def updateScores(queryWords,query_scores,terms,upvotes,downvotes,alpha,beta,gamma):

    newQuery = []



    for i in range(len(terms)):
        currTerm = terms[i]
        if (i>len(queryWords)):
            query_scores.append(alpha*beta**upvotes[currTerm]*gamma**downvotes[currTerm])
        else:
            query_scores[i] = query_scores[i]*beta**upvotes[currTerm]*gamma**downvotes[currTerm])
        newQuery.append(currTerm)

    return newQuery,query_scores




def feedback(query, query_scores, likedKwords, dislikedKwords):

    alpha = 1
    beta = 1.1
    gamma = 0.9

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
    upvotes = dict((el, 0) for el in terms)
    downvotes = dict((el, 0) for el in terms)

    for i in range(len(titleTerms)):
        for term in titleTerms[i]:
            if i < len(likedKwords):
                upvotes[term] += 1
            else:
                downvotes[term] += 1


    newQuery, newScores = updateScores(queryWords,query_scores,terms,upvotes,downvotes,alpha,beta,gamma)

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