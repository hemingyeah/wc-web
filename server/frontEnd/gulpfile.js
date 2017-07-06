var gulp = require('gulp');
//var i5ting_toc = require('gulp-i5ting-toc');
var tocmd = require('./index');
var fs = require('fs')
var minimist = require('minimist');
var pwd = process.cwd()

// var source_file_name = pwd + '/' + source_file
// var file_name = source_file_name.split('/').pop();;
// var _file_name = file_name.split('.')[0];

// var dest_file_path = pwd + '/preview/' + _file_name + '.html';

// console.log('pwd=' + pwd);
// console.log('source_file_name=' + source_file_name);
// console.log('dest_file_path=' + dest_file_path);

var knownOptions = {
    string: 'f',
    default: {
        f: ''
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

var opt = {
    source_file_name: 'useMarkdown.md',
    is_open: true,
    debug: false,
    markd_config: {
        debug: false
    }
}

/**
 * 将当前目录下md文件生成html
 */
gulp.task('build', function() {

    if (options.f === '') {
        //所有的md文件生成html
        fs.readdir('.', function(err, data) {
            data.forEach(function(name) {
                if (name.lastIndexOf('.md') > 0) {
                    var tempName = name.replace('.md', '').trim();
                    //console.log(tempName);
                    tocmd(pwd, name, 'document/' + tempName + '.html', false, opt)
                }
            });
        });

    } else { //单个md文件生成html

        var tempName = options.f.replace('.md', '').trim();

        tocmd(pwd, options.f, 'document/' + tempName + '.html', false, opt)
    }
});

/**
 * 监视文件变化 自动生成html
 */
gulp.task('watch', function() {

    gulp.watch(['*.md'], function(event) {

        //s=s.replace(/(.*/){0,}([^.]+).*/ig,"$2") ;//Page1.htm 

        var name = event.path.replace(/.*\\/, '').trim();

        var tempName = name.replace('.md', '').trim();

        tocmd(pwd, name, 'document/' + tempName + '.html', false, opt)

        console.log('文件：'+name+'已重新生成html');
        
    });
});

/**
 * 开发使用说明
 * gulp build 将当前目录下所有md文件全部重新生成html
 * gulp build --f api.md 将指定的md文件生成html
 * gulp 将监视文件变化 实时生成html
 * 
 */

gulp.task('default', ['watch']);