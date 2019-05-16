import sys
import json


def updateScores(queryWords, terms, upvotes, downvotes, alpha, beta, gamma):

    newQuery = []
    query_scores = []

    for i in range(len(terms)):
        currTerm = terms[i]
        if (i >= len(queryWords)):
            score = beta**upvotes[currTerm]*gamma**downvotes[currTerm]
        else:
            score = alpha*beta**upvotes[currTerm]*gamma**downvotes[currTerm]
        query_scores.append(score)
        newQuery.append(currTerm)

    return newQuery, query_scores


def feedback(query, likedKwords, dislikedKwords):

    alpha = 3
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
    for idx, title in enumerate(dislikedKwords):
        titleTerms.append(title.split())
        for term in titleTerms[idx+len(likedKwords)]:
            if term not in terms:
                terms.append(term)
    upvotes = dict((el, 0) for el in terms)
    downvotes = dict((el, 0) for el in terms)

    for i in range(len(titleTerms)):
        for term in titleTerms[i]:
            if i < len(likedKwords):
                upvotes[term] += 1
            else:
                downvotes[term] += 1

    newQuery, newScores = updateScores(
        queryWords, terms, upvotes, downvotes, alpha, beta, gamma)

    json_to_return = {}
    json_to_return['extended'] = newQuery
    json_to_return['score'] = newScores

    print(json.dumps(json_to_return))
    # print(newScores)
    # sys.stdout.flush()

    return newQuery, newScores


query = sys.argv[1]
# print(query)
likedKwords = sys.argv[2].split('#')
dislikedKwords = sys.argv[3].split('#')

feedback(query, likedKwords, dislikedKwords)
