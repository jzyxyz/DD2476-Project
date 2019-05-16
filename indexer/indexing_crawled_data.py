from elasticsearch import helpers, Elasticsearch
import time
import json
import glob

from datetime import datetime

es = Elasticsearch()

start = time.time()

dataset = []
# print(glob.glob("../crawled_data/*.json"))

# es.indices.delete(index = 'crawled_data')

for data in glob.glob("../tagged_data/*.json"):
    # print(data)
    with open(data, 'r', encoding='utf8') as f:
        try:
            dataset.append(json.load(f))
        except:
            continue

        # print(dataset[-1])
        try:
            dataset[-1]['date'] = datetime.strptime(
                dataset[-1]['date'], '%d %B %Y').strftime('%d/%m/%Y')
        except ValueError:
            try:
                dataset[-1]['date'] = datetime.strptime(
                    dataset[-1]['date'], '\n%m/%d/%Y').strftime('%d/%m/%Y')
            except ValueError:
                try:
                    dataset[-1]['date'] = datetime.strptime(
                        dataset[-1]['date'], '%B %d, %Y').strftime('%d/%m/%Y')
                except ValueError:
                    try:
                        dataset[-1]['date'] = datetime.strptime(
                            dataset[-1]['date'], '%b. %d, %Y').strftime('%d/%m/%Y')
                    except ValueError:
                        continue

helpers.bulk(es, dataset, index='crawled_data', doc_type='news_articles')

fin = time.time()

print('duree : ', fin - start)
