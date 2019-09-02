
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = require('../new-config.json');
const webpackBaseConfig = require('./webpack.base.config');
let rules = webpackBaseConfig.module.rules

let projectPath = path.join(__dirname, '../')

let entry = config['dll-entry'].entry.map((item) => {
    return path.join(projectPath, item);
});

module.exports = {

    mode: 'development',
    entry: {
        vendor: entry
    },
    watch: config['dll-entry'].watch,
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
    output: {
        path: path.join(__dirname, '../dist/hrpub/dll'),
        filename: '[name].js',
        library: '[name]_[hash]_library'
    },
    module: {
        rules,
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     filename: '[name].css'
        // }),
        new webpack.DllPlugin({
            path: path.join(__dirname, '../dist/hrpub/dll/[name]-manifest.json'),
            name: '[name]_[hash]_library'
        })
    ].concat(webpackBaseConfig.plugins)
};