# -*- coding: utf-8 -*-
import json
import os
import re
import nltk
import sys
from nltk.corpus import stopwords
from collections import Counter
import string
reload(sys)
sys.setdefaultencoding('utf8')

stop = stopwords.words('english')
stop.extend(["''", "´´", "``", "’", "‘"])
punct = string.punctuation
global length
title_matrix = list()
content_matrix = list()
tags_matrix = list()

all_content_words = Counter()

def has_digit(string):
    return bool(re.search(r'\d', string))

def handle_title(title):
    tokens = nltk.word_tokenize(title.lower())
    filtered = [token for token in tokens if not token in stop \
                and not token in punct and not has_digit(token) \
                and not "'" in token]
    return filtered

def handle_content(content):
     tokens = nltk.word_tokenize(content.lower())
     filtered = [token for token in tokens if not token in stop \
                and not token in punct and not has_digit(token) \
                and not "'" in token]
     cnt = Counter(filtered)
     return [word for word,nr in cnt.most_common(20)]
 
def find_bad_words():
    bad_words = list()
    for word,nr in all_content_words.iteritems():
        if nr > length*0.001:
            bad_words.append(word)
    return bad_words
        
def concatenate_tags(bad_words):
    for i in range(length):
        t = title_matrix[i]
        c = content_matrix[i]
        c_updated = list()
        for word in c:
            if not word in bad_words:
                c_updated.append(word)
        tags_matrix.append(set(c_updated + t))
            
def main():    
    directory = "../crawled_data"
    global length
    length = len(os.listdir(directory))
    for filename in os.listdir(directory):
            with open("./" + directory + "/" + filename) as file:  
                try:
                    data = json.load(file)
                    title = data['title']
                    title_matrix.append(handle_title(title))
                    content = data['content']
                    content_words = handle_content(content)
                    content_matrix.append(content_words)
                    all_content_words.update(content_words)
                except:
                    print(filename)
                file.close
    
    bad_words = find_bad_words()
    concatenate_tags(bad_words)

    i = 0
    for filename in os.listdir(directory):
        with open("./" + directory + "/" + filename) as file:  
            data = json.load(file)
            data['tags'] = ' '.join(str(s) for s in list(tags_matrix[i]))
            i += 1
        file.close
        with open("./" + directory + "/" + filename, "w") as outfile:  
            json.dump(data, outfile)
        outfile.close
    
if __name__== "__main__":
  main()

    