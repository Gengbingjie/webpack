const path = require('path');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { VueLoaderPlugin } = require("vue-loader");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const { library } = require('./dll.js');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HappyPack = require('happypack')
const dllFiles = fs.readdirSync(path.resolve(__dirname, 'dll'))
                    .filter(file => file.endsWith('.dll.js') && Object.keys(library).includes(file.split('_')[0]))
                    .map(file => path.resolve(__dirname, 'dll', file));
module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/index.js",
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }, {
                test: /\.vue$/i,
                loader: "vue-loader",
                options: {
                    hotReload: false // 关闭热重载
                }
            }, {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource"  //内置loader
            }, {
                test: /\.js$/,
                exclude: /node_modules/,    //排除node_modules，因为node_modules中代码是编译过的
                // use: {
                //     loader: "babel-loader",
                //     options: {
                //         presets: ["@babel/preset-env"]
                //     }
                // }
                use : "happypack/loader?id=happybabel"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "./index.html")
        }),
        new VueLoaderPlugin(),
        ...Object.keys(library).map((name)=>{
            return new webpack.DllReferencePlugin({
                manifest : require("./dll/"+name+"-manifest.json"),
            })
        }),
        ...dllFiles.map(file=>{
            return new AddAssetHtmlPlugin({
                filepath: file,
                publicPath : "./dll",
                outputPath : "./dll"
            })
        }),
        // new webpack.DllReferencePlugin({
        //     manifest : require("./dll/vendor-manifest.json"),
        // }),
        // new AddAssetHtmlPlugin({
        //     filepath: path.resolve(__dirname,'./dll/vendor.dll.js'),
        //     publicPath : "./dll",
        //     outputPath : "./dll"
        // }),
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader?cacheDirectory'],
            threads: 4, // 线程开启数
        })
        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin()],
        concatenateModules: true,
        providedExports: true,
        usedExports : true,
        innerGraph : true,
        sideEffects : true,
        chunkIds : "named",
        splitChunks: {
            chunks: 'all',
            minSize: 2000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'chunk-common',
                    filename : "chunk_common_[fullhash].js",
                    chunks: 'all',
                    minChunks: 1,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 10,
                    reuseExistingChunk: true
                },
                default : {
                    minChunks : 1,
                    filename : "default_[fullhash].js",
                    priority: 1,
                    reuseExistingChunk: true
                }
            }
        }
    },
    devServer: {
        static: "./dist"
    },
    
    // optimization: {
    //     chunkIds : "named",
    //     splitChunks: {
    //         chunks: 'all',
    //         minSize: 2000,
    //         minRemainingSize: 0,
    //         minChunks: 1,
    //         maxAsyncRequests: 30,
    //         maxInitialRequests: 30,
    //         enforceSizeThreshold: 50000,
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'chunk-common',
    //                 filename : "chunk_common_[fullhash].js",
    //                 chunks: 'all',
    //                 minChunks: 1,
    //                 maxInitialRequests: 5,
    //                 minSize: 0,
    //                 priority: 10,
    //                 reuseExistingChunk: true
    //             },
    //             default : {
    //                 minChunks : 1,
    //                 filename : "default_[fullhash].js",
    //                 priority: 1,
    //                 reuseExistingChunk: true
    //             },
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]vue[\\/]/,
    //                 // name: 'vendor',
    //                 minSize: 200,
    //                 filename : "vue_vendor_[fullhash].js",
    //                 chunks: 'all',
    //                 priority: 20,
    //                 reuseExistingChunk: true,
    //                 enforce: true
    //             }
    //         }
    //     }
    // }
}