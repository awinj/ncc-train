const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const happyPack = require('happypack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')



module.exports = {
    mode: 'production',
    entry: {},
    output: {
        filename: '[name]_[hash:8].js',
        path: path.join(__dirname, '../dist'),
        publicPath: '../../../../',
        library: '[name]',
        libraryTarget: 'umd',
        chunkFilename: '[name].js'
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter',
        'redux': 'Redux',
        'react-redux': 'ReactRedux',
        'axios': 'axios',
        'nc-lightapp-front': 'nc-lightapp-front',
        'nc-report': 'nc-report',
        'nc-hr-report': 'nc-hr-report'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'src': path.resolve(__dirname, '../src/')
        }
    },
    module: {
        rules: [{
            test: /\.(jsx|js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'happypack/loader',
                options: {
                    presets: ['env', 'react'],
                    plugins: [
                        ['import-bee', {
                            "style": true
                        }],
                        'transform-class-properties'
                    ]
                }
            }
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'less-loader'
            ]
        },  {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        mode: 'local',
                        modules: true,
                        localIdentName: '[name]--[local]--[hash:base64:5]'
                    }
                },
                'postcss-loader'
            ]
        },
        {
            test: /\.css$/,
            include: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                loader: 'css-loader',
                    options: {
                        modules: false,
                    }
                },
                'postcss-loader',
            ]
        }, {
            test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz|xlsx)(\?.+)?$/,
            exclude: /favicon\.png$/,
            use: [{
                loader: 'url-loader'
            }]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new happyPack({
            loaders: ['babel-loader']
        }),
        new FriendlyErrorsWebpackPlugin(),
        new OptimizeCssAssetsPlugin()
    ],
    stats: 'errors-only'
};