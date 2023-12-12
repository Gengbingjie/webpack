webpack打包相关
功能：代码转换/文件优化/代码分割/模块合并/自动刷新/代码校验/自动发布
1、创建目录  
2、初始化webpack项目   npm init -y 
3、添加webpack依赖  npm add --include=dev webpack webpack-cli
4、创建目录文件
5、打包webpack  npx webpack     npx webpack index.js -o dist.js
    npx 检测node_modules有没有webpack，如果没有会下载
    webpack打包之后的文件：
        1、自执行函数
        2、参数通过对象形式传递 "key(文件路径)" : function(){}
6、创建webpack.config.js文件 并配置webpack配置
7、加载cssloader  npm add --include=dev css-loader style-loader
8、图片使用内置loader "asset/resource"
9、安装插件 html-webpack-plugin
10、安装babel loader
11、配置压缩 terser-webpack-plugin
12、热更新打包：webpack-dev-server
13、打包分析工具 webpack-bundle-analyzer

优化项：
    自带优化 ： 
        tree-sharking : 依赖关系的解析（不用的代码不打包，生产环境才有效） mode:production
        scope-hoisting ：作用域提升  
            一个变量如果只是用他的结果就不打包
    自己实现的优化
    体积更小：
        IgnorePlugin  把不需要的语言包删掉  减少不必要的模块 比如moment
        external不打包 noParse不解析
    速度更快:
        happypack:多线程打包

    打包完之后体积过大：

        dllPlugin：
            1、构建动态链接库文件 webpack.dllconfig.js
            2、添加打包命令 "dll" : "webpack --config webpack.dllconfig.js"
            3、使用动态链接库文件，在主配置文件中配置webpack.referencePlugin({})

