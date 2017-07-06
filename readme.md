## Usage

### Requirements

* [NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/))
* [Bower](http://bower.io)
* [Gulp](http://gulpjs.com)

### Installation

1. Clone the repository: `git clone http://192.168.6.115:7990/scm/dev/web.git'
2. Install the NodeJS dependencies: `sudo npm install`.
3. Install the Bower dependencies: `bower install`.
4. Run the gulp build task: `gulp build`.
5. Run the gulp default task: `gulp`. This will build any changes made automatically, and also run a live reload server on [http://localhost:8080](http://localhost:8080).

**注意：**

gulp 构建时不带参数默认为*开发环境* 不启用js和css压缩

gulp -p 表示为*生产环境*  启用js和css压缩并且使用gulp-rev对必要的文件添加md5后缀控制版本

Ensure your preferred web server points towards the `dist` directory.

### Development

visual studio code 代码提示

npm install typings --global

typings install 

使用 [gulp-livereload](https://github.com/vohof/gulp-livereload)实现自动刷新

需要在浏览器中安装插件

[安装方法](http://livereload.com/extensions/)

Continue developing the dashboard further by editing the `app` directory. With the `gulp` command, any file changes made will automatically be compiled into the specific location within the `dist` directory.

### 前端开发文档使用

所有关于前端的文档现在全部放在server/frontEnd下面

使用时先进入到frontEnd目录下面

第一次使用需要 cnpm install 或者 npm install 安装依赖包

安装完毕后 gulp build 

打开http://127.0.0.1:9999 查看文档

### 前端数据模拟接口使用

由于java后端数据接口数据不稳定

前端使用express框架提供模拟数据接口

首次使用时需要到server目录下  执行 npm install 安装依赖包

当使用gulp -l 启动gulp时 前端接口全部使用本地模拟接口

gulp  或者 gulp -r 采用java后端接口

即默认使用java后端接口

后续需要添加本地接口时 可以到app.js文件中添加处理逻辑

