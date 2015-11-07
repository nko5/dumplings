module.exports = {
    resolve: {
        extensions: ['.es6.js', '.js', '']
    },

    entry: './public/scripts/main',

    output: {
        filename: 'bundle.js',
        path: 'public/dist'
    },

    module: {
        loaders: [
            {
                test: /\.es6\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    }
};
