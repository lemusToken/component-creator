# 简介

组件开发环境，用于组件的开发、demo演示、打包，使用的技术栈：nodejs+webpack+eslint+babel+gulpjs+esdoc

# 直接安装使用

`npm install`

# 组件操作命令

src下的各个文件名即为各组建包名称，组建包下的index.js作为组件开发和打包的入口文件；组建包下demo中的index.js作为组件示例的入口文件

1.  组件打包（unix环境下为`/`）：`.\node_modules\.bin\gulp component.build.js --name 组件包名称`
1.  运行组件示例：`.\node_modules\.bin\gulp component.demo.js --name 组件包名称`
1.  组件开发：启动webpack server，`.\node_modules\.bin\gulp component.dev.js --name 组件包名称`
1.  生成文档：`.\node_modules\.bin\gulp component.doc.js`

# 组件列表

1.  box：浮动层，可用作弹框
1.  clone：数据合并、深拷贝、浅拷贝
1.  config：配置管理
1.  dom：DOM操作，增删改查
1.  form：表格数据校验、数据校验
1.  ifs：数据类型判断
1.  layout：自适应布局
1.  listen：DOM事件
1.  middleware：中间件流程控制
1.  observer：事件管理、数据观察者
1.  storage：数据存储，cookie、本地存储
1.  throttle：节流控制

# 组件工厂环境安装（简单介绍）

1.  初始化`npm npm init -y`

1.  如果未配置NPM registry，可以先安装`npm install -g nrm`，国内网络可以选择淘宝

1.  安装webpack和webpack-cli(4.0以后cli需要独立安装) `npm install webpack webpack-cli --save-dev`

1.  目录下运行`.\node_modules\.bin\webpack -h` 出来帮助说明webpack安装成功，如果是全局安装直接使用webpack即可

1.  安装webpack-dev-server(主要是要实现模块热替换，简单点可以使用webpack --watch，如果是定制自己的服务器可以使用webpack-dev-middleware) `npm install webpack-dev-server --save-dev`

1.  安装cross-env，用于跨平台设置nodejs环境变量，windows环境和posix(UNIX)环境下cli设置环境变量会有区别，`npm install cross-env --save-dev`

1.  创建配置文件，webpack默认的配置文件为项目根目录中的webpack.config.js，实际使用时需要分开发和生产环境，所以需要分开配置，利用cross-env区别环境，从而载入不同配置

    1. 配置packjson中wabpack入口，在script中添加
    
        *   开发指令:`"dev": "cross-env NODE_ENV=development ./node_modules/.bin/webpack-dev-server --inline --progress --config config/webpack.dev.js"` 
        *   打包指令：`"build": "cross-env NODE_ENV=prodution ./node_modules/.bin/webpack --config config/webpack.prod.js"`
    
    1. 创建config目录
    
        *   webpack.common.js：通用配置
        *   webpack.dev,js：开发配置
        *   webpack.prod.js：生产或者打包环境配置
        
1.  配置webpack配置的一般步骤(各环境具体配置见项目)

    1.  mode：用于定义环境 开发：`development`, 生产：`production`
    1.  entry：入口文件，*文件名:需要编译的文件路径*，用于通知webpack需要编译的文件入口
    1.  context：上下文，辅助计算entry中的文件路径，*entry实际地址 = context + entry文件路径*，不填默认为根目录
    1.  output：
    
        1.  filename：编译后的文件名称，可以使用占位符`[name]`，`[hash]`， `[chunkhash]`等，注意`[chunkhash]`不能再开发环境中使用
        1.  path：编译后文件输出的目录，绝对地址
        1.  publicPath：静态资源最终访问路径，*编译后的资源路径 = output.publicPath + 资源loader或插件等配置路径*，可以设置为CDN地址
        
    1.  module：模块loader
    
        1.  babel-loader：用于将es6+编译成es5，兼容老版本浏览器中的js版本
        1.  css-loader：将css文件直接做为js模块载入
        1.  url-loader：载入url资源，图片、字体、多媒体等，当文件大小小于一定数值时，会用data-source代替
        
    1.  devtool：开发时便于错误调试，用于定位编译前的错误位置
        
    1.  devServer：webpack-dev-server配置
    
        1.  contentBase：静态文件，可以是数组，webpack-dev-server服务器使用的是express，其实contentBase就是express的静态文件地址设置，例如设置了dist目录，dist下的index.js访问就是src="index.js"注意：*不用加dist*
        1.  host： localhost，设置0.0.0.0可以允许外部访问
        1.  port：端口
        1.  publicPath：设置dev服务器访问的根路径(以'/'结尾)，server访问地址host+port+publicPath，注意：*webpack-dev-server输出的文件只存在于内存中,不输出真实的文件*，默认为'/'
        1.  inline：自动刷新方式
        1.  historyApiFallback：使用HTML5 History Api，任意的跳转或404响应均指向 index.html页面，用于创建spa应用
        1.  hot： 热模块加载
        
    1.  plugin：插件
    
        1.  new webpack.DefinePlugin：定义webpack变量，注意该变量是编译时直接替换的，所以值需要加上引号。
            ```js
            //  例
            new webpack.DefinePlugin({
              'process.env': {
                NODE_ENV: '"development"'
              }
            })
            ```
        1.  new webpack.HotModuleReplacementPlugin()，热加载插件
        1.  new webpack.NamedModulesPlugin()，当开启 HMR 的时候使用该插件会显示模块的相对路径
        1.  new webpack.HashedModuleIdsPlugin()，用hash命名modelid，用于稳定模块名称
        1.  new webpack.NamedChunksPlugin()，稳定chunkid从而稳定chunkhash，用于持久化缓存
        1.  new HtmlWebpackPlugin()，用于将资源整合成html文件，注意：*默认访问地址devServer.publicPath/index.html*
        
    1. optimization：优化（多数配置根据mode自动设置）
    
        1.  minimize：启动压缩，mode是production自动设置为true
        1.  runtimeChunk：transform-runtime，chunk自动独立打包
        1.  splitChunks：webpack4+用于替代CommonsChunkPlugin
        
1.  利用webpack merge进行配置合并，`npm install webpack-merge --save-dev`

1.  运行`npm run dev`，打包成功后，运行页面无错误，说明webpack安装成功

1.  优化：为了es6+代码兼容es5，代码中引用了bable-polyfill，因为bable-polyfill体积大，并且模块众多，导致开发时编译速度慢以及打包后的文件体积大，所以使用`dll`进行优化

    1.  配置webpack.dll.js，定义`entry`，生成的dll名称:打包成dll的文件路径
    1.  配置webpack.dll.js，定义`output.path`:dll文件输出的目录，`output.filename`:文件名，`output.library`:dll对外输出的变量名
    1.  配置webpack.dll.js，`plugins`中添加`new webpack.DllPlugin`中的`context`上下文为需要打包的入口文件（业务文件非dll文件）所在路径；`path`:manifest（dll的功能清单）的输出目录
    1.  配置packjson中wabpack入口，在script中添加`"build:dll": "./node_modules/.bin/webpack --config config/webpack.dll.js"`，执行命令，生成dll
    1.  在webpack.common.js中的plugins下添加`new webpack.DllReferencePlugin`，指定与上面相同的上下文以及manifest文件路径
    1.  在index.html中添加script标签，src指向dll文件路径
    1.  在入口代码中添加`babel-polyfill`，执行打包指令后即可自动添加dll
    
1.  执行`npm run dev`

1.  gulpjs安装`npm install --save-dev gulp`

1.  安装gulpjs是为了便于管理任务

1.  任务系统文件夹结构
    ```
    dist
      dll
        es6.dll.js #dll文件
      其余build后的文件
    docs #文档目录
    task
      libs #功能库
      component.build.js
      component.demo.js
      component.dev.js
      component.doc.js
      ...
      其余自定义任务文件
    src
      各个组件包名 # 一个文件夹作为一个组件包
        demo #示例代码目录
          index.html
          index.js
    ```
1. 任务列表(`.\node_modules\.bin\gulp 任务名 --参数名 参数值 ...`，windows下环境下为`\`，unix环境下为`/`)

    1.  `component.build.js`，组件打包，`.\node_modules\.bin\gulp component.build.js --name 组件包名称`
    1.  `component.demo.js`，运行组件示例，`.\node_modules\.bin\gulp component.demo.js --name 组件包名称`
    1.  `component.dev.js`，运行组件，启动webpack server，`.\node_modules\.bin\gulp component.dev.js --name 组件包名称`
    1.  `component.doc.js`，生成文档，`.\node_modules\.bin\gulp component.doc.js`