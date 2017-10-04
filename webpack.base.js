const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader',
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    },
                    extractCSS: true
                }
            },
        ],
    },

    resolve: {
        extensions: ['.js', '.vue'],
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.js$/,
            minimize: true,
        }),
    ],
};
