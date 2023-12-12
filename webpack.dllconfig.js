const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const { library } = require('./dll.js');
// dll文件存放目录
const dllPath = 'dll';
module.exports = {
    entry : {
        ...library
        // vendor: ['vue','element-plus','lodash'] 
    },
    output : {
        path : path.join(__dirname,dllPath),
        filename : '[name].dll.js',
        library : '[name]_[fullhash]'
    },
    plugins : [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            path : path.join(__dirname,dllPath,'[name]-manifest.json'),
            format : true,
            name : '[name]_[fullhash]'
        })
    ]
}