const path = require('path');
const merge = require('webpack-merge');

module.exports = merge(require('./webpack.base'), {
    context: __dirname,

    entry: {
        index: './src/index.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'laravel-translator-ui',
        libraryTarget: 'umd',
    },

    externals: [
        'vue',
        'vue-ckeditor2',
    ],
});
