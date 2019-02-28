const webpack = require('webpack') // eslint-disable-line
const entries = {
    app: './src/app.jsx',
}
module.exports = {
    entry: entries,
    output: {
        path: '/home/zhongyuan/Mdix_Related/mern-svdict/static/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].js',
    },
    devtool: 'source-map',
    devServer: {
        port: 8888,
        contentBase: 'static',
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000',
            },
        },
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                // vendor chunk
                vendor: {
                    // sync + async chunks
                    chunks: 'all',
                    name: 'vendor',
                    // import file path containing node_modules
                    test: /node_modules/,
                },

            },
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                },
            },
        ],
    },
};
