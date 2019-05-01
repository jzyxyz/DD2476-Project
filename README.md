### project structure

.  
├── client  
├── crawled_data  
├── crawler  
├── data  
├── dist  
├── indexer  
├── node_modules  
└── server

### adding dependencies

if you add any dependecies in python, write it in `requirements.txt`.  
if you add any dependecies in nodejs, use `npm install --save $packagename`.  
this makes everyone's life easier

### installing dependencies

to install dependencies, run
`npm install`
or
`pip3 install -r requirements.txt`

### frontend

clone the repository and run
npm @v5
node @v10

and then run

```bash
npm run client
```

webpack devServer @port 8888

### crawl the data

```bash
cd crawler
npm install
node index.js
```

read the comments in `index.js` file




### index the datasets 

download the csv files from https://www.dropbox.com/s/90goxt56pfz0r35/all-the-news.zip?dl=0
run indexing.py to create 3 indexes news_1, news_2 and news_3 


