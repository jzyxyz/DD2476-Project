# -*- coding: utf-8 -*-
import nltk
import pandas as pd
import csv
import sys
from nltk.corpus import stopwords
from collections import Counter
import string
reload(sys)
sys.setdefaultencoding('utf8')

def getContent(csv_file, row):
    data = pd.read_csv(csv_file)
    item = data.iloc[row, 9]
    return item

def find_most_common_words(content):
    stop_words = set(stopwords.words('english'))
    try:
        tokens = nltk.word_tokenize(content)
        cnt = Counter()
        cnt.update(token.lower() for token in tokens if not token.lower() in \
                   stop_words and not token in string.punctuation)
        ret = [x for x,y in cnt.most_common(10)]
        return ret
        
    except:
        return " "    

all_common_words = Counter()
file_path = '../data/articles' + str(3) + '.csv'
#length = data.shape[0]
length = 50
tags = list()
for j in range(length):
    if j % 10 == 0:
        print(j)
    content = getContent(file_path, j)
    words = find_most_common_words(content)
    tokens = nltk.word_tokenize(str(words))
    tags.append(tokens)
    all_common_words.update(token for token in tokens)

invalid_tags = str([word for word,count in all_common_words.iteritems() if count > 0.05*length])

results = list()
for j in range(length):
    x = ""
    for t in tags[j]:
        if not t in invalid_tags and not "\\" in t:
            x += t[1:]
            x += " "
    results.append(x)
    
df = pd.DataFrame(results, columns=["tags"])
df.to_csv('../data/temp.csv', index=False)

