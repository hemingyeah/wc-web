**web前端更新操作说明**

>说明web前端项目和开发文档的部署和更新说明


修改日志
  
|版本号|修改内容|修改日期|修改人|
|---|----|----|---|
|v0.1|添加文档|2016-05-21|王涛|

# 前端web项目部署和更新说明

## 概述

1、[NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/)):开发工具运行环境  
2、[Bower](http://bower.io)：twitter 推出的一款包管理工具，基于nodejs的模块化思想，把功能分散到各个模块中，让模块和模块之间存在联系，通过 Bower 来管理模块间的这种联系。  
3、[Gulp](http://gulpjs.com)：  
基于Nodejs的自动任务运行器， 她能自动化地完成 javascript/coffee/sass/less/html/image/css 等文件的的测试、检查、合并、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些步骤。在实现上，她借鉴了Unix操作系统 的管道（pipe）思想，前一级的输出，直接变成后一级的输入，使得在操作上非常简单。通过本文，我们 将学习如何使用Gulp来改变开发流程，从而使开发 更加快速高效。    
4、[Git](https://git-scm.com/download/):一款免费、开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目  
5、[Cnpm](http://npm.taobao.org/):nodejs包管理工具npm的替代品，这是一个完整 npmjs.org 镜像，由于在国内，能够提高安装的速度  

## 安装

1、首先需要安装NodeJS,到官网https://nodejs.org/en/ 下载安装即可  

2、安装 cnpm

```  bash
npm install cnpm -g 

``` 

3、安装gulp

``` bash
cnpm install gulp -g

```

4、安装 bower

``` bash
cnpm install bower -g

```

## 部署

``` bash
git clone http://192.168.6.115:7990/scm/dev/web.git
cd web
bower install  --allow-root
cnpm install
gulp build -p

```

使用gulp构建完毕后会生成dist文件，该目录为前端最终部署的web主目录

``` bash
[root@localhost /] cd /webapp/nginx/webapp/
[root@localhost webapp] ls
iscs  web
[root@localhost webapp]  cd web/
[root@localhost web] ls
app         gulpfile.js   package.json  server         typings.json
bower.json  node_modules  readme.md     tsconfig.json
[root@localhost web] gulp build -p
[09:33:10] Using gulpfile /webapp/nginx/webapp/web/gulpfile.js
[09:33:10] Starting 'build'...
[09:33:10] Starting 'clean'...
[09:33:10] Finished 'clean' after 14 ms
[09:33:10] Starting 'usemin'...
[09:33:11] Finished 'usemin' after 451 ms
[09:33:11] Starting 'build-custom'...
[09:33:11] Starting 'custom-images'...
[09:33:11] Finished 'custom-images' after 30 ms
[09:33:11] Starting 'custom-fonts'...
[09:33:11] Finished 'custom-fonts' after 11 ms
[09:33:11] Starting 'custom-icon'...
[09:33:11] Finished 'custom-icon' after 2.59 ms
[09:33:11] Starting 'custom-controller'...
[09:33:11] Starting 'custom-viewService'...
[09:33:11] Starting 'custom-directive'...
[09:33:11] Starting 'custom-service'...
[09:33:11] Starting 'custom-filter'...
[09:33:11] Finished 'custom-filter' after 42 ms
[09:33:11] Finished 'custom-viewService' after 55 ms
[09:33:11] Finished 'custom-service' after 54 ms
[09:33:11] Finished 'custom-directive' after 59 ms
[09:33:11] Finished 'custom-controller' after 63 ms
[09:33:11] Starting 'custom-js'...
[09:33:11] Finished 'custom-js' after 25 ms
[09:33:11] Starting 'custom-less'...
[09:33:11] Finished 'custom-less' after 579 ms
[09:33:11] Starting 'custom-lib-js'...
[09:33:12] Finished 'custom-lib-js' after 19 ms
[09:33:12] Starting 'custom-lib-css'...
[09:33:12] Finished 'custom-lib-css' after 1.38 ms
[09:33:12] Starting 'custom-lib-file'...
[09:33:12] Finished 'custom-lib-file' after 6.91 ms
[09:33:12] Starting 'build-bower-js'...
[09:33:12] Finished 'build-bower-js' after 32 ms
[09:33:12] Starting 'custom-viewscript'...
[09:33:12] Starting 'custom-viewshtml'...
[09:33:12] Finished 'custom-viewscript' after 54 ms
[09:33:12] Finished 'custom-viewshtml' after 53 ms
[09:33:12] Starting 'custom-views'...
[09:33:12] Finished 'custom-views' after 36 ms
[09:33:12] Finished 'build-custom' after 868 ms
[09:33:12] Finished 'build' after 1.34 s
[root@localhost web]#

```

使用nginx发布dist目录

``` bash
[root@localhost conf]  cd /webapp/nginx/conf/
[root@localhost conf] ls
fastcgi.conf          fastcgi_params.default  mime.types          nginx.conf.default   uwsgi_params
fastcgi.conf.default  koi-utf                 mime.types.default  scgi_params          uwsgi_params.default
fastcgi_params        koi-win                 nginx.conf          scgi_params.default  win-utf
[root@localhost conf] vi nginx.conf

```

``` bash
server {
        listen       80;
        server_name  192.168.6.135;
 
        #charset koi8-r;
 
        #access_log  logs/host.access.log  main;
         
        # 跨域配置
       location /api {
          root   /webapp/nginx/webapp/web/server;
        }
 
        location / {
            root   /webapp/nginx/webapp/web/dist;
 
            try_files $uri $uri/ /index.html =404;
            index  index.html;
        }
 
        location /ecm_api {
 
         rewrite ^/ecm_api/(.*)$ /$1 break;
         proxy_pass  http://192.168.200.59:8080;
 
        }
 
        location /ims_api {
 
          rewrite ^/ims_api/(.*)$  /$1 break;
          proxy_pass http://192.168.6.143:8080;
 
        }
 
        location /oms_api {
          rewrite ^/oms_api/(.*)$   /$1 break;
          proxy_pass  http://192.168.6.133:8080;
 
        }
}

```

重启nginx

``` bash
[root@localhost nginx]  cd /webapp/nginx/webapp/web
[root@localhost sbin] ls
nginx
[root@localhost sbin] ./nginx -s reload

```

## 更新

当前master代码有变化时需要先拉取代码，再执行命令

``` bash
cd /webapp/nginx/sbin/
cnpm install
bower install  --allow-root
gulp build -p

```

# 前端开发文档部署和更新说明

## 概述

1、主要是将markDown文件生成html部署到nginx下面,方便前端查看  
2、使用的工具是 https://github.com/i5ting/tocmd.npm 页面的样式我们进行了修改  
3、效果 http://192.168.6.135:9999/main.html

## 部署

``` bash
cd /webapp/nginx/webapp/web/server/frontEnd/   #进入前端开发文档目录
cnpm install #安装依赖包
gulp build #将当前目录下的所有markDown文件生成html

```

执行完毕后 所有的markDown文件在document下面都有一个对应的相同文件名字的html文件

``` bash
[root@localhost frontEnd]  cd document/
[root@localhost document] ls
assets                html-style-guide.html  index.html                   oms.html            useMarkdown.html
css-style-guide.html  img                    iscsCssUse.html              printTemplate.html
doc                   ims.html               javascript-style-guide.html  toc
frontEnd.html         indexcss               main.html                    toc_conf.js

```

document就是前端开发文档部署的web主目录

使用nginx发布document目录

``` bash
server {
      listen  9999;
      server_name  192.168.6.135;
      location / {
        root /webapp/nginx/webapp/web/server/frontEnd/document;
        index   index.html;
      }
   }

```

## 更新

master代码有更新时 先拉取代码 然后执行

``` bash
cd /webapp/nginx/webapp/web/server/frontEnd/   #进入前端开发文档目录
gulp build

```