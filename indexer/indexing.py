# -*- coding: utf-8 -*-
"""
Created on Sun Apr 28 14:08:11 2019
@author: Manon
"""

from elasticsearch import helpers, Elasticsearch
import pandas as pd
import time
from datetime import datetime

debut = time.time()

es = Elasticsearch()

# ignore 400 cause by IndexAlreadyExistsException when creating an index
"""
 es.indices.create(index = 'news', ignore = 400)
"""

"""
if not es.indices.exists(index = 'news'):
    es.indices.create(index = 'news')
else :
    es.indices.delete(index = 'news')
    es.indices.create(index = 'news')
"""

"""
es.indices.delete(index = 'news_1')
es.indices.delete(index = 'news_2')
es.indices.delete(index = 'news_3')
"""
   
for i in range(1,4) : 
    if not es.indices.exists(index = 'news_' + str(i)) :
    
        dataset = pd.read_csv('articles' + str(i) + '.csv', encoding = 'utf8').drop(columns = {"Unnamed: 0"})
        
        json_file = []
        
        for j in range(dataset.shape[0]) :
            try:
                dataset.at[j, "date"] = datetime.strptime(dataset.iloc[j].date, '%Y-%m-%d').strftime('%Y-%m-%d')
            except ValueError:
                dataset.at[j, "date"] = datetime.strptime(dataset.iloc[j].date, '%Y/%m/%d').strftime('%Y-%m-%d')
            except TypeError :
                continue
            json_file.append(dataset.iloc[j].to_json())
        
        helpers.bulk(es, json_file, index = 'news_' + str(i), doc_type ='news_articles')
        
        fin = time.time()
        
        print('duree : ', fin - debut)
  
res = es.search(index = "news_1", body={"query": {"match" : { "title" : "Mixtape" }}})
print("Got %d Hits" % res['hits']['total']['value'])

"""
{'took': 0,
 'timed_out': False,
 '_shards': {'total': 1, 'successful': 1, 'skipped': 0, 'failed': 0},
 'hits':{'total': {'value': 1, 'relation': 'eq'},
 'max_score': 10.960828,
 'hits': [{'_index': 'news',
   '_type': 'news_articles',
   '_id': 'Cv6xZGoBzla32p5LUAYA',
   '_score': 10.960828,
   '_source': {'id': 17291,
    'title': 'First, a Mixtape. Then a Romance. - The New York Times',
    'publication': 'New York Times',
    'author': 'Katherine Rosman',
    'date': '2016-12-31',
    'year': 2016.0,
    'month': 12.0,
    'url': None,
    'content': ...
"""
