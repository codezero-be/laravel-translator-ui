const path = require('path');
const merge = require('webpack-merge');

module.exports = merge(require('./webpack.base'), {
    context: __dirname,

    entry: {
        translator: './src/index.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'laravel-translator-ui',
        libraryTarget: 'umd',
    },

    externals: [
        'vue',
        'form-backend-validation',
        'vue-ckeditor2',
        'sweetalert2',
    ],
});
