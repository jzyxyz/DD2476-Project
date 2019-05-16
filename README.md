# News Reccomendation System With Elastic Search.

This is the course project for course DD2476 at KTH.

Group members:  
Deprette, Manon deprette@kth.se  
Grancharova, Mila milag@kth.se  
Iakovidis, Grigorios griiak@kth.se  
Jin, Zhongyuan zjin@kth.se

## project structure

.  
├── client `frontend source code`  
├── crawler `tools for crawling data from web`  
├── indexer `tools for creating elastic index`  
├── nodemon.json  
├── package.json  
├── package-lock.json  
├── README.md  
├── requirements.txt  
├── server `backend source code`  
├── server_py `backend server scripts`  
├── tagged_data `tagged news data`  
├── webpack.config.js  
└── webpack.config.server.js

## build the project

1. clone the project
2. install the dependencies

```bash
    npm run install
    pip3 install -r requirements.txt
```

> make sure you have at least `npm @v5 node @v10`

3. create elastic search index
   ```bash
   cd indexer
   python3 indexing_crawled_data.py
   ```
4. build the server and client
   ```bash
   npm run build
   npm run server
   ```
5. Server starts at localhost:3000
6. crawls more data?

   ```bash
   cd crawler
   npm install

   node index.js
   ```

### installing dependencies

to install dependencies, run  
`npm install`  
or  
`pip3 install -r requirements.txt`
