var path = require('path');
var webpack = require('webpack');
var CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: process.env.NODE_ENV || 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist/script'),
        publicPath: '/script',
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        static: path.join(__dirname, 'public'),
    },
    performance: {
        hints: false
    },
    devtool: 'eval-source-map',
    plugins: [
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'public', to: path.resolve(__dirname, './dist') },
            ],
            options: {},
        }),
    ],
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = 'source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}
