import sys


def feedback(query, liked, disliked, likedKwords, dislikedKwords):
    '''

    '''
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

    newQuery = ''

    for term in terms:
        if termVotes[term] > 0 or (termVotes[term] == 0 and term in queryWords):
            newQuery += term + ' '

    if newQuery != '':
        newQuery = newQuery[0:len(newQuery)]
        return newQuery
    else:
        return query


print(sys.argv[1])
print(sys.argv[2])
print(sys.argv[3])
