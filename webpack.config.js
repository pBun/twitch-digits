var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, './dist/script'),
        publicPath: '/script',
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|public\/)/
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader', options: { sourceMap: true } },
                    { loader: 'css-loader', options: { sourceMap: true } }
                ]
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
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        contentBase: './public'
    },
    performance: {
        hints: false
    },
    devtool: 'eval-source-map',
    plugins: [
        new CopyWebpackPlugin([{
            from: 'public',
            to: path.resolve(__dirname, './dist')
        }])
    ]
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
