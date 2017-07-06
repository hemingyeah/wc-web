/**
 * gulp启动文件
 */
var args = require('yargs').argv, //获取、控制台参数值
    path = require('path'), //
    gulp = require('gulp'), //gulp主体
    connect = require('gulp-connect'), //web服务
    usemin = require('gulp-usemin'),
    watch = require('gulp-watch'), //监视文件变化
    minifyCss = require('gulp-cssnano'), //css压缩
    minifyJs = require('gulp-uglify'), //js压缩
    concat = require('gulp-concat'), //将多个文件合并为一个；
    less = require('gulp-less'), //less编译成css
    rename = require('gulp-rename'), //重命名
    minifyHTML = require('gulp-htmlmin'), //html压缩
    clean = require('gulp-clean'), //文件清除
    //https://github.com/bripkens/connect-history-api-fallback
    historyApiFallback = require('connect-history-api-fallback'), //处理html5模式
    templateCache = require('gulp-angular-templatecache'), //处理模板
    //https://github.com/tinganho/connect-modrewrite
    modRewrite = require('connect-modrewrite'), //api路由转发 处理跨域问题
    gulpSequence = require('gulp-sequence'), //控制gulp执行任务的顺序
    livereload = require('gulp-livereload'),
    //https://github.com/sindresorhus/opn
    opn = require('opn'), //打开浏览器
    gulpif = require('gulp-if'), //判断是开发环境还是生产环境
    nodemon = require('gulp-nodemon'), //开启node后端服务
    rev = require('gulp-rev'), //对文件名加md5后缀
    revCollector = require('gulp-rev-collector'), //路径替换
    compression = require('compression')(), //gzip压缩
    //replace = require('gulp-replace');//文本替换
    qiniu = require('qiniu'); //七牛cdn

var isProduction = args.p || !args.d; //生产环境为true，开发环境为false，默认为false为开发环境
var isRemote = args.r || !args.l; //api调用是否使用java后端接口,默认采用java接口,异常时切回本地模拟api

if (!args.r && !args.l) {
    isRemote = true;
}

if (!args.p && !args.d) {
    isProduction = false;
}

var paths = {
    scripts: 'app/scripts/**/*.*',
    styles: 'app/styles/**/*.*',
    images: 'app/images/**/*.*',
    index: 'app/index.html',
    viewshtml: 'app/views/**/*.html',
    viewscript: 'app/views/**/*.js',
    fonts: 'app/fonts/**/*.*'

};

/**
 * 处理首页bower components
 */
gulp.task('usemin', ['rev-html'], function() {

    return gulp.src(['dist/rev/**/**/*.json',
            paths.index,
            'dist/view/print/print-design.html'
        ])
        .pipe(gulpif(isProduction, revCollector()))
        .pipe(usemin({
            css: [minifyCss({
                keepSpecialComments: 0
            }), 'concat'],
        }))
        .pipe(gulpif(isProduction, minifyHTML({
            collapseWhitespace: true, //压缩HTML
            removeComments: true //清除HTML注释
        })))
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

/**
 * 处理打印模板设计页面
 */
gulp.task('rev-html', function() {

    return gulp.src(['dist/rev/js/viewscript/*.json',
            'dist/rev/css/**/*.json',
            'dist/views/print/print-design.html'
        ])
        .pipe(gulpif(isProduction, revCollector()))
        .pipe(gulpif(isProduction, minifyHTML({
            collapseWhitespace: true,
            removeComments: true
        })))
        .pipe(gulp.dest('dist/views/print'));
});

/**
 * 处理bower管理的资源
 */
gulp.task('build-bower-js', function() {

    return gulp.src(['app/bower-components/jquery/dist/jquery.js',
            'app/bower-components/angular/angular.js',
            'app/bower-components/angular-ui-router/release/angular-ui-router.js',
            'app/bower-components/ngstorage/ngStorage.js',
            'app/bower-components/angular-animate/angular-animate.js',
            'app/bower-components/angular-sanitize/angular-sanitize.js',
            'app/bower-components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/bower-components/oclazyload/dist/ocLazyLoad.min.js',
            'app/bower-components/angular-translate/angular-translate.js',
            'app/bower-components/ag-grid/dist/ag-grid-enterprise.js',
            'app/bower-components/ui-select/dist/select.js',
            'app/bower-components/angular-ui-validate/dist/validate.js',
            'app/bower-components/adm-dtp/dist/ADM-dateTimePicker.js',
            'app/bower-components/angular-i18n/angular-locale_zh-cn.js',
            'app/bower-components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'app/bower-components/util/util.js',
            'app/bower-components/angular-md5/angular-md5.js',
            'app/bower-components/angular-socket-io/socket.js',
            'app/bower-components/ng-file-upload/ng-file-upload.js',
            'app/bower-components/lodash/dist/lodash.js',
            'app/bower-components/angular-ui-mask/dist/mask.js',
            'app/bower-components/ng-img-crop/compile/minified/ng-img-crop.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/lib/js'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/vendor')));

});

/**
 * 处理静态资源
 */
gulp.task('build-custom', gulpSequence('custom-images',
    'custom-fonts',
    'custom-icon',
    'custom-i18n',
    'custom-js',
    'custom-auto-css',
    'custom-lib-js',
    'custom-lib-css',
    'custom-lib-file',
    'build-bower-js',
    'custom-views'));

/**
 * 处理favicon.ico
 */
gulp.task('custom-icon', function() {
    return gulp.src('app/favicon.ico')
        .pipe(gulp.dest('dist'));
});

/**
 * 处理国际化资源
 */
gulp.task('custom-i18n', function() {
    return gulp.src('app/i18n/*.json')
        .pipe(gulp.dest('dist/i18n'));
});

/**
 * 处理字体fonts
 */
gulp.task('custom-fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'));
});

/**
 * 处理图片
 */
gulp.task('custom-images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/images'));
});


/**
 * 处理view下所有的控制器
 */
gulp.task('custom-controller', function() {

    return gulp.src('app/views/**/script/*controller.js')
        .pipe(concat('controllers.js'))
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/scripts/controllers'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/controllers')));
});

/**
 * 处理指令
 */
gulp.task('custom-directive', function() {

    return gulp.src('app/scripts/directives/*.js')
        .pipe(concat('iscs-directive.js'))
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/scripts/directives'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/directive')));

});

/**
 * 处理过滤器
 */
gulp.task('custom-filter', function() {

    return gulp.src('app/scripts/filters/*.js')
        .pipe(concat('iscs-filter.js'))
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/scripts/filters'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/filters')));
});

/**
 * 
 * 处理service
 */
gulp.task('custom-service', function() {

    return gulp.src('app/scripts/services/*.js')
        .pipe(concat('iscs-service.js'))
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/scripts/services'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/iscs-service')));

});

/**
 *处理view下所有的service 
 */
gulp.task('custom-viewService', function() {

    return gulp.src('app/views/**/script/*service.js')
        .pipe(concat('services.js'))
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/scripts/services'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/services')));
});

/**
 * 处理js
 */
gulp.task('custom-js', ['custom-controller',
    'custom-viewService',
    'custom-directive',
    'custom-service',
    'custom-filter'
], function() {
    return gulp.src(paths.scripts)
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/scripts')));
});

/**
 * 处理独立引用的js文件
 */
gulp.task('custom-lib-js', function() {

    return gulp.src(['app/bower-components/jquery/dist/jquery.js',
            'app/bower-components/lodash/dist/lodash.js',
            'app/bower-components/super-slide/*.js',
            'app/bower-components/lodop/*.js',
            'app/bower-components/bootstrap/dist/js/bootstrap.js',
            'app/bower-components/echarts/ng-echarts.js',
            'app/bower-components/echarts/theme/iscs-theme.js',
            'app/bower-components/AngularJS-Toaster/toaster.js',
            // 'app/bower-components/toastr/toastr.js',
            'app/bower-components/socket.io-client/socket.io.js',
            'app/bower-components/util/*.js'
        ])
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulp.dest('dist/lib/js'));
});

/**
 * 处理lodop安装文件
 * 还有已经压缩的文件
 */
gulp.task('custom-lib-file', function() {

    return gulp.src(['app/bower-components/lodop/*.exe',
            'app/bower-components//echarts/echarts-all.js'
        ])
        .pipe(gulp.dest('dist/lib/js'));

});

/**
 * 处理独立引用的css文件
 */
gulp.task('custom-lib-css', function() {

    return gulp.src(['app/bower-components/toastr/toastr.css',
            'app/bower-components/super-slide/slide-box.css'
        ])
        .pipe(gulpif(isProduction, minifyCss()))
        .pipe(gulp.dest('dist/lib/css'));

});

/**
 * 处理less
 */
gulp.task('custom-less', function() {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest('dist/styles'));
});

/**
 * 处理自定义Css
 */
gulp.task('custom-auto-css', ['custom-less'], function() {
    return gulp.src(['dist/styles/animate.css',
            'dist/styles/bootstrap.css',
            'dist/styles/app.css',
            'dist/styles/iscs-style.css',
            'dist/styles/page.css'
        ])
        .pipe(concat('iscs-css.css'))
        .pipe(gulpif(isProduction, minifyCss()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/styles'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/css/styles')));
});

/**
 * 处理视图页面 将其全部放进缓存里
 * 默认生成templates.js
 */
gulp.task('custom-views', ['custom-viewscript',
        'custom-viewshtml'
    ],
    function() {
        return gulp.src(paths.viewshtml)
            .pipe(gulpif(isProduction, minifyHTML({
                collapseWhitespace: true,
                removeComments: true
            })))
            .pipe(templateCache('templates-cache.js'))
            .pipe(gulpif(isProduction, minifyJs()))
            .pipe(gulpif(isProduction, rev()))
            .pipe(gulp.dest('dist/views'))
            .pipe(gulpif(isProduction, rev.manifest()))
            .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/templateCache')))
            .pipe(livereload());
    });

/**
 * 处理views下js文件
 */
gulp.task('custom-viewscript', function() {
    return gulp.src(paths.viewscript)
        .pipe(gulpif(isProduction, minifyJs()))
        .pipe(gulpif(isProduction, rev()))
        .pipe(gulp.dest('dist/views'))
        .pipe(gulpif(isProduction, rev.manifest()))
        .pipe(gulpif(isProduction, gulp.dest('dist/rev/js/viewscript')))
});

/**
 * 处理views下html文件
 */
gulp.task('custom-viewshtml', function() {
    return gulp.src(['dist/rev/js/viewscript/*.json',
            'dist/rev/css/**/*.json',
            paths.viewshtml
        ])
        .pipe(gulpif(isProduction, revCollector()))
        .pipe(gulpif(isProduction, minifyHTML({
            collapseWhitespace: true,
            removeComments: true
        })))
        .pipe(gulp.dest('dist/views'));
});


/**
 * 监视文件变化
 */
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch([paths.images], ['custom-images']);
    gulp.watch([paths.styles], ['custom-auto-css']);
    gulp.watch([paths.index], ['usemin']);
    gulp.watch([paths.viewscript, paths.scripts, paths.viewshtml], ['custom-views', 'custom-js', 'rev-html']);
});

/**
 * '^/api/(.*)$ http://localhost:8081/api/$1 [P]本地api
 * '^/ecm_api/(.*)$ http://192.168.7.43:8080/ecm_api [P]' Java后端测试api
 * Last [L] If a path matches, any subsequent rewrite rules will be disregarded.
 * Proxy [P] Proxy your requests
 * Type [T=*] (replace * with mime-type) Sets content-type to the specified one.
 * Host [H], [H=*] (replace * with a regular expression that match a hostname)
 * web服务
 */
gulp.task('webserver', function() {
    connect.server({
        root: 'dist',
        livereload: false,
        port: 8080,
        middleware: function(connect, opt) {
            if (isRemote) {
                return [modRewrite([
                    '^/api/(.*)$ http://192.168.6.25:8080/$1 [P]', //远程api配置
                    '^/local_api/(.*)$ http://127.0.0.1:8081/$1 [P]', //本地api配置
                    '^/uploadFile_api/(.*)$ http://10.10.0.54:8001/$1 [P]',
                    // '^/ims_api/(.*)$ http://192.168.6.143:8080/$1 [P]',
                    // '^/oms_api/(.*)$ http://192.168.6.133:8080/oms/$1 [P]',
                    // '^/wos_api/(.*)$ http://192.168.6.144:8080/$1 [P]',
                    // '^/dic_api/(.*)$ http://192.168.200.75:8080/$1 [P]',
                    // '^/demand_api/(.*)$ http://192.168.6.133:8080/oms/$1 [P]',
                ]), historyApiFallback(), compression];
            } else {
                return [modRewrite([
                    '^/api/(.*)$ http://localhost:8081/$1 [P]',
                    '^/local_api/(.*)$ http://127.0.0.1:8081/$1 [P]', //本地api配置
                    '^/uploadFile_api/(.*)$ http://localhost:8081/$1 [P]',
                    // '^/ims_api/(.*)$ http://localhost:8081/$1 [P]',
                    // '^/oms_api/(.*)$ http://localhost:8081/$1 [P]',
                    // '^/wos_api/(.*)$ http://localhost:8081/$1 [P]',
                    // '^/demand_api/(.*)$ http://127.0.0.1:8081/$1 [P]',
                ]), historyApiFallback(), compression];
            }
        }
    });
});

/**
 * 后端api
 * 模拟json数据
 * 使用express
 */
gulp.task('server', function() {
    nodemon({
        script: 'server/app.js',
        // ignore: ['*.*'],
        watch: ['server/app.js'],
        env: {
            'NODE_ENV': 'development'
        }

    }).on('start', function() {
        console.info('api server is running http://localhost:8081');
    }).on('restart', function() {
        console.log('api server is restarted!')
    });
})

/**
 * 前端文档服务
 */
gulp.task('serverDocumnet', function() {
    connect.server({
        root: 'server/frontEnd/document',
        port: 9999
    });
});

/**
 * 重启web服务
 */
gulp.task('livereload', function() {
    gulp.src(['dist/**/*.*'])
        .pipe(watch(['dist/**/*.*']))
        .pipe(connect.reload());
});

//清除dist文件夹
gulp.task('clean', function() {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean());
});

//打开浏览器
gulp.task('openBrowser', function() {
    opn('http://127.0.0.1:8080/');
});

//处理七牛cdn
gulp.task('cdn', function() {

    //七牛密钥
    qiniu.conf.ACCESS_KEY = 'ZAHbEWCIZIk20U3d-z3_-5HpD5m4a7sQwEv3vZBa';
    qiniu.conf.SECRET_KEY = 'xsormIbvt8jgWJDToqMx0kT7KAXaFOwTjxMJ909m';
    var bucket = 'anytao'; //要上传的空间
    var key = 'readme.md'; //上传到七牛后保存的文件名

    function uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        return putPolicy.token();
    }

    var token = uptoken(bucket, key); //生成上传token
    var filePath = 'readme.md'; //要上传的文件的本地路径

    //构造上传函数
    function uploadFile(uptoken, key, localFile) {

        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if (!err) {
                //上传成功 处理返回值
                console.log(ret.hash, ret.key);
            } else {
                //上传失败 处理返回代码
                console.log(err);
            }
        });
    }
    //调用uploadFile上传
    uploadFile(token, key, filePath);
});

/**
 * Gulp任务
 */
gulp.task('build', gulpSequence('clean', 'build-custom', 'usemin'));
gulp.task('default', gulpSequence('build',
    'webserver',
    'server',
    'serverDocumnet',
    'watch',
    'openBrowser'));