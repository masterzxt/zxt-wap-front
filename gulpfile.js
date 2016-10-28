const gulp = require('gulp');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const glob = require('glob');
const pkg = require('./package.json');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------------------------ gulp plugins
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const less = require('gulp-less');
const rev = require('gulp-rev');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const cleancss = new LessPluginCleanCSS({advanced: true});

const htmlmin = require('gulp-htmlmin');

const templateCache = require('gulp-angular-templatecache');
const lazypipe = require('lazypipe');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const htmlreplace = require('gulp-html-replace');
const gulpIgnore = require('gulp-ignore');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const vinylPaths = require('vinyl-paths');
const del = require('del');
const gulpmatch = require('gulp-match');
const map = require('map-stream');
const sass = require('gulp-sass');
const concatCss = require('gulp-concat-css');
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');
const nodemon = require('gulp-nodemon');

// ------------------------------------------------------------------------------ 环境变量
if (!process.env.env) {
    gutil.log("未设定使用哪一种环境 env : [dev|test|prod], 默认使用 dev 环境");
    process.env.env = "dev";
}
if (["dev", "test", "prod", "demo"].indexOf(process.env.env) < 0) {
    gutil.log(`不支持的 env : ${process.env.env}, 默认使用 dev 环境`);
    process.env.env = "dev";
}
gutil.log(`使用 env : ${chalk.red(process.env.env)}`);

const target = "target";
const config = {
    dev: {
        base: "16400/",
    },
    test: {
        base: "11300/",
    },
    prod: {
        // 这里仅仅加载 css， js， font，部分图片等。
        base: "//static1.kingsilk.net/qh-admin-front/prod/2.2.0/"
    }
};

gulp.on("task_stop", e => {
    if (e.task.indexOf("change") >= 0) {
        gutil.log(`------------------------task [${chalk.red(e.task)}] done.`);
    }
});


// ------------------------------------------------------------------------------ task : connect
gulp.task('connect', function () {
    connect.server({
        root: 'target/dist',
        //port: 8888,
        //host: "localhost",
        livereload: true
    });
});

// ------------------------------------------------------------------------------ task : clean
gulp.task("clean", cb => {
    del(target)
        .then(()=> {
            cb();
        });
});

// ------------------------------------------------------------------------------ task : lib.assets
const libAssetsSrc = [
    'src/lib/?*/**/*',
    '!src/lib/!(ueditor)/**/*.js',
    '!src/lib/!(ueditor)/**/*.css',
    '!src/lib/?*/**/*.less',
    '!src/lib/?*/**/*.scss',
    '!src/lib/?*/**/*.map',
    'src/lib/lib-min-*.js',
    'src/lib/lib-min-*.js.map',
    'src/lib/lib-min-*.css',
    'src/lib/lib-min-*.css.map',
    //'src/lib/ueditor/**/*'
];
const libAssetsWatchSrc = libAssetsSrc;
gulp.task("lib.assets", cb => {
    return gulp.src(libAssetsSrc)
        .pipe(gulpIgnore.exclude({isDirectory: true}))
        .pipe(gulp.dest(path.join(target, "dist", "lib")));
});


// ------------------------------------------------------------------------------ task : app.assets
const appAssetsSrc = [
    'src/assets/**/*'
];
const appAssetsWatchSrc = appAssetsSrc;
gulp.task("app.assets", cb => {
    return gulp.src(appAssetsSrc)
        .pipe(gulp.dest(path.join(target, "dist", "assets")));
});

// ------------------------------------------------------------------------------ task : lib.js
const libJsSrc = [

    'src/lib/holderjs/holder.js',

    //七牛图片上传
    'src/lib/StringView/stringview.js',
    'src/lib/qiniu/qiniu.js',
    'src/lib/qiniu/qiniu-etag.js',

    'src/lib/jquery/jquery.js',
    'src/lib/jquery/jquery.event.drag.js',
    'src/lib/detectmobilebrowser/detectmobilebrowser.js',

    'src/lib/modernizr/modernizr.js',

    //'src/lib/jquery.flexslider/jquery.flexslider.js',
    //'src/lib/jQuery.mmenu/js/jquery.mmenu.min.all.js',

    //'src/lib/jQuery.mmenu/src/js/jquery.mmenu.oncanvas.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.offcanvas.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.autoheight.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.backbutton.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.counters.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.dividers.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.dragopen.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.fixedelements.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.iconpanels.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.navbars.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.navbar.breadcrumbs.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.navbar.close.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.navbar.next.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.navbar.prev.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.navbar.searchfield.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.navbar.title.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.searchfield.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.sectionindexer.js',
    //'src/lib/jQuery.mmenu/src/js/addons/jquery.mmenu.toggles.js',

    'src/lib/bootstrap/js/bootstrap.js',

    // bootstrap-datepicker 
    'src/lib/bootstrap-datepicker/js/bootstrap-datepicker.js',

    // eonasdan-bootstrap-datetimepicker
    'src/lib/moment/moment-with-locales.js',
    'src/lib/moment-timezone/moment-timezone-with-data.js',
    'src/lib/eonasdan-bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',


    'src/lib/remarkable-bootstrap-notify/bootstrap-notify.js',

    'src/lib/bootstrap-treeview/bootstrap-treeview.min.js',

    'src/lib/angular/angular.js',
    'src/lib/angular-resource/angular-resource.js',
    'src/lib/angular-touch/angular-touch.js',
    'src/lib/angular-animate/angular-animate.js',
    'src/lib/angular-aria/angular-aria.js',
    'src/lib/angular-sanitize/angular-sanitize.js',
    'src/lib/angular-cookies/angular-cookies.js',
    'src/lib/angular-material/angular-material.js',
    //'src/lib/angular-material-icons/angular-material-icons.js',
    'src/lib/angular-material-data-table/md-data-table.js',
    'src/lib/angular-messages/angular-messages.js',
    'src/lib/flexslider/jquery.flexslider.js',

    'src/lib/angular-file-upload/angular-file-upload.js',

    // QRcode
    'src/lib/qrcode-generator/qrcode.js',
    'src/lib/qrcode-generator/qrcode_UTF8.js',
    'src/lib/angular-qrcode/angular-qrcode.js',

    'src/lib/angular-ui/angular-ui.js',
    'src/lib/angular-ui/angular-ui-ieshiv.js',
    'src/lib/angular-bootstrap/ui-bootstrap-tpls.js',
    'src/lib/angular-ui-router/angular-ui-router.js',
    'src/lib/ui-router-extras/ct-ui-router-extras.js',
    'src/lib/angular-material-sidenav/angular-material-sidenav.js',
    'src/lib/angular-flexslider/angular-flexslider.js',
    //'src/lib/marquee/jquery.marquee.js',

    'src/lib/cropper/cropper.js',
    'src/lib/fex-webuploader/webuploader.html5only.js',


    // UEditor
    'src/ueditor.config.js',
    'src/lib/ueditor/ueditor.all.js',
    'src/lib/ueditor/lang/zh-cn/zh-cn.js',


    //simditor
    'src/lib/js-beautiful/beautify-html.js',
    'src/lib/simditor/javascripts/simditor/simditor-all.js',

    'src/lib/angular-ueditor/angular-ueditor.min.js',
    // ECharts
    'src/lib/echarts/dist/echarts.js',

    //'src/lib/remarkable-bootstrap-notify/bootstrap-notify.js',
    'src/lib/jweixin/jweixin-1.0.0.js',

    //'src/lib/swiper/js/swiper.js',
    //'src/lib/swiper/js/angular-swiper.js'
    //'src/lib/angular-swiper/dist/angular-swiper.js',
    //'src/lib/angular-pageslide-directive/dist/angular-pageslide-directive.js'

    // iscroll
    'src/lib/iscroll/iscroll.js',
    'src/lib/platform/platform.js',
    'src/lib/angular-iscroll/angular-iscroll.js',

    //
    'src/lib/angular-hotkeys/hotkeys.js',
];
const libJsWatchSrc = libJsSrc;
gulp.task('lib.js', cb => {

    // 先删除已经生成的文件
    glob("src/lib/lib.js", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));
    glob("src/lib/lib-min-*.js", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));
    glob("src/lib/lib-min-*.js.map", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));

    // 再重新生成
    return gulp.src(libJsSrc, {base: 'src/lib'})

        // 合并
        .pipe(sourcemaps.init())
        .pipe(concat('lib.js'))
        //.pipe(gulp.dest(path.join("src", "lib")))
        //.pipe(rev())
        //.pipe(gulp.dest(target))

        // 压缩
        .pipe(uglify())
        .pipe(rename(p => {
            p.basename += "-min";
        }))
        .pipe(rev())
        // .pipe(sourcemaps.write(".", {
        //     debug: true,
        //     sourceRoot:"/lib.js/",
        //     mapSources: function (sourcePath) {
        //
        //         // source paths are prefixed with '../src/'
        //         console.log(":::::: " + sourcePath);
        //         return 'lib.js22/' + sourcePath;
        //     }
        // }))
        .pipe(sourcemaps.write(".", {
            includeContent: true,
            sourceRoot: "/lib.js"
        }))
        .pipe(gulp.dest(path.join("src", "lib")));
});

//// ------------------------------------------------------------------------------ task : lib.less
const libLessSrc = 'src/lib/lib.less';
const libLessWatchSrc = libLessSrc;
gulp.task('lib.less', cb => {

    // 先删除已经生成的文件
    glob("src/lib/lib.css", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));
    glob("src/lib/lib-min-*.css", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));
    glob("src/lib/lib-min-*.css.map", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));

    // 再重新生成
    return gulp.src('src/lib/lib.less')

        .pipe(sourcemaps.init())
        .pipe(less({
            relativeUrls: true,
            plugins: [
                cleancss
            ]
        }))
        //.pipe(gulp.dest(path.join("src", "lib")))
        .pipe(rename(function (path) {
            if (path.basename === "lib") {
                path.basename = "lib-min";
            }
        }))
        .pipe(rev())


        .pipe(sourcemaps.write(".", {
            includeContent: true,
            sourceRoot: "/lib.less"
        }))

        .pipe(gulp.dest(path.join("src", "lib")));
});


// ------------------------------------------------------------------------------ task : lib.css
const libCssSrc = [

    "src/lib/normalize-css/normalize.css",
    "src/lib/animate-css/animate.css",
    "src/lib/cropper/cropper.css",
    "src/lib/webuploader/webuploader.css",
    "src/lib/iconfont/iconfont.css",
    "src/lib/bootstrap/css/bootstrap.css",
    "src/lib/bootstrap/css/bootstrap-theme.css",
    "src/lib/angular-ui/angular-ui.css",
    "src/lib/flexslider/flexslider.css",
    "src/lib/jQuery.mmenu/css/jquery.mmenu.all.css",
    "src/lib/marquee/jquery.marquee.css",
    "src/lib/swiper/css/swiper.css",
    "src/lib/angular-material/angular-material.css",
    "src/lib/material-design-icons/iconfont/material-icons.css",


    //simditor
   /* "src/lib/simditor/stylesheets/simditor.css",
    "src/lib/simditor/stylesheets/font-awesome.css",*/

    /*  "src/lib/ueditor/themes/iframe.css",
     "src/lib/ueditor/themes/default/css/ueditor.css",
     "src/lib/ueditor/third-party/codemirror/codemirror.css"*/
    //"src/lib/angular-material-icons/angular-material-icons.css"
];
const libCssWatchSrc = libCssSrc;
gulp.task('lib.css', cb => {

    // 先删除已经生成的文件
    glob("src/lib/lib-min-*.css", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));
    glob("src/lib/lib-min-*.css.map", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));

    // 再重新生成
    return gulp.src(libCssSrc, {
            base: process.cwd()
        })

        .pipe(concatCss("src/lib/lib.css"), {rebaseUrls: true})
        .pipe(sourcemaps.init())
        .pipe(rename(function (path) {
            console.log("====== path = ", path);
            if (path.basename === "lib") {
                path.basename = "lib-min";
            }
        }))

        .pipe(cleanCSS({keepSpecialComments: 1, sourceMap: false}))
        .pipe(rev())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("."));
});
//
//// ------------------------------------------------------------------------------ task : lib.scss
//const libScssSrc = 'src/lib/lib.scss';
//const libScssWatchSrc = libScssSrc;
//gulp.task('lib.scss', cb => {
//
//    // 先删除已经生成的文件
//    glob("src/lib/lib-min-*.css", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));
//    glob("src/lib/lib-min-*.css.map", (err, matches) => matches.forEach(filePath => fs.unlink(filePath)));
//
//    // 再重新生成
//    return gulp.src('src/lib/lib.scss')
//
//        .pipe(rename(function (path) {
//            if (path.basename === "lib") {
//                path.basename = "lib-min";
//            }
//        }))
//
//        .pipe(sourcemaps.init())
//        .pipe(sass({
//            errLogToConsole: true,
//            relativeUrls: true,
//            importer: [(url, prev, done)=> {
//                "use strict";
//                console.log("----------------- " + url + ",   " + prev + ",    " + done);
//                done(url);
//            }]
//            //outputStyle:"compressed"
//        }))
//        .pipe(rev())
//        .pipe(sourcemaps.write("."))
//
//        .pipe(gulp.dest(path.join("src", "lib")));
//});


// ------------------------------------------------------------------------------ task : lib.compile
gulp.task('lib.compile', cb => {
    runSequence(
        [
            "lib.js",
            "lib.less"
        ],
        ()=> {
            cb(); // 指示该任务已经执行完毕
        });
});

// ------------------------------------------------------------------------------ task : app.js
const appJsSrc = [
    // js 文件
    'src/index.js',
    `src/settings-${process.env.env}.js`,
    'src/config.js',
    'src/services/**/*.js',
    'src/filters/**/*.js',
    'src/directives/**/*.js',
    'src/controllers/**/*.js',

    // html文件，需要转成js文件
    'src/views/**/*.html'
];
const appJsWatchSrc = appJsSrc;
gulp.task('app.js', cb => {

    del([
        `${target}/dist/js/app-min-*.js`,
        `${target}/dist/js/app-min-*.js.map`
    ]).then(paths => {

        gulp.src(appJsSrc)
            .pipe(plumber())

            .pipe(gulpif(/.*\.html$/,
                lazypipe()
                    .pipe(
                        htmlmin,
                        {
                            removeComments: true,
                            collapseWhitespace: true
                        }
                    )
                    .pipe(
                        templateCache,
                        "app.views.js",
                        {
                            standalone: true,
                            module: `${pkg.name}.views`,
                            base: path.join(process.cwd(), 'src')
                        }
                    )
                    ()
            ))
            // 合并
            .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            //.pipe(gulp.dest(path.join(target, "dist", "js")))

            // 压缩
            .pipe(uglify())
            .pipe(rename(function (path) {
                path.basename += "-min";
            }))
            .pipe(rev())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(path.join(target, "dist", "js")))
            .on('finish', () => {
                cb();
            });
    });

});


//// ------------------------------------------------------------------------------ task : app.less
//const appLessSrc = 'src/less/index.less';
//const appLessWatchSrc = 'src/less/**/*.less';
//gulp.task('app.less', cb => {
//
//    del([
//        `${target}/dist/css/app-min-*.css`,
//        `${target}/dist/css/app-min-*.css.map`
//    ]).then(paths => {
//        gulp.src(appLessSrc)
//            .pipe(rename(function (path) {
//                if (path.basename === "index") {
//                    path.basename = "app-min";
//                }
//            }))
//
//            .pipe(sourcemaps.init())
//            .pipe(rev())
//            .pipe(less({
//                plugins: [
//                    cleancss
//                ]
//            }))
//            .pipe(sourcemaps.write("."))
//
//            .pipe(gulp.dest(path.join(target, "dist", "css")))
//            .on('finish', () => {
//                cb();
//            });
//    });
//});


// ------------------------------------------------------------------------------ task : app.scss
const appScssSrc = 'src/scss/index.scss';
const appScssWatchSrc = 'src/scss/**/*.scss';
gulp.task('app.scss', cb => {

    del([
        `${target}/dist/css/app-min-*.css`,
        `${target}/dist/css/app-min-*.css.map`
    ]).then(paths => {
        gulp.src(appScssSrc)
            .pipe(plumber())
            .pipe(rename(function (path) {
                if (path.basename === "index") {
                    path.basename = "app-min";
                }
            }))

            .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle: "compressed"
            }).on('error', sass.logError))
            .pipe(rev())
            .pipe(sourcemaps.write("."))

            .pipe(gulp.dest(path.join(target, "dist", "css")))
            .on('finish', () => {
                cb();
            });
    });
});


// ------------------------------------------------------------------------------ task : index.html
const indexHtmlSrc = "src/index.html";
const indexHtmlWatchSrc = indexHtmlSrc;
gulp.task('index.html', cb => {

    var libCss = fs.readdirSync(path.join(target, "dist", "lib")).find(ele => /^lib-min-\w+\.css$/.test(ele));
    var appCss = fs.readdirSync(path.join(target, "dist", "css")).find(ele => /^app-min-\w+\.css$/.test(ele));
    var libJs = fs.readdirSync(path.join(target, "dist", "lib")).find(ele => /^lib-min-\w+\.js$/.test(ele));
    var appJs = fs.readdirSync(path.join(target, "dist", "js")).find(ele => /^app-min-\w+\.js$/.test(ele));

    return gulp.src(indexHtmlSrc)
        .pipe(plumber())
        .pipe(htmlreplace({
            // 追加自定义属性 "data-build" 是为了方便在 qh-app 中进行处理
            'base': {src: null, tpl: `<base data-build="base" href="${config[process.env.env].base}" />`},
            'libCss': {src: null, tpl: `<link rel="stylesheet" href="lib/${libCss}"/>`},
            'appCss': {src: null, tpl: `<link rel="stylesheet" href="css/${appCss}"/>`},
            'libJs': {src: null, tpl: `<script src="lib/${libJs}"></script>`},
            'appJs': {src: null, tpl: `<script src="js/${appJs}"></script>`}
            //'ueditor': {src: null, tpl: `<script src="${config[process.env.env].ueditor}/ueditor.config.js"></script>`}
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            preserveLineBreaks: true
        }))
        .pipe(gulp.dest(path.join(target, "dist")))
        .pipe(connect.reload());
});


// ------------------------------------------------------------------------------ task : demo.js
const demoJsSrc = [
    // js 文件
    'src/demo/index.js',

    'src/filters/**/*.js',
    'src/directives/**/*.js',

    'src/demo/biz/**/*.js',

    // html文件，需要转成js文件
    'src/demo/biz/**/*.html'
];
const demoJsWatchSrc = demoJsSrc;
gulp.task('demo.js', cb => {

    del([
        `src/demo/demo.js`,
        `src/demo/demo.js.map`
    ]).then(paths => {

        gulp.src(demoJsSrc)
            .pipe(plumber())

            .pipe(gulpif(/.*\.html$/,
                lazypipe()
                    .pipe(
                        htmlmin,
                        {
                            removeComments: true,
                            collapseWhitespace: true
                        }
                    )
                    .pipe(
                        templateCache,
                        "demo.views.js",
                        {
                            standalone: true,
                            module: `${pkg.name}.views`,
                            base: path.join(process.cwd(), 'src/demo')
                        }
                    )
                    ()
            ))
            // 合并
            .pipe(concat('demo.js'))
            .pipe(gulp.dest("src/demo"))
            .on('finish', () => {
                cb();
            });
    });

});

//// ------------------------------------------------------------------------------ task : demo.less
//const demoLessSrc = appLessSrc;
//const demoLessWatchSrc = appLessWatchSrc;
//gulp.task('demo.less', cb => {
//
//    del([
//        `src/demo/demo.css`,
//        `src/demo/demo.map`
//    ]).then(paths => {
//        gulp.src(demoLessSrc)
//            .pipe(rename(function (path) {
//                if (path.basename === "index") {
//                    path.basename = "demo";
//                }
//            }))
//
//            .pipe(sourcemaps.init())
//            .pipe(less({
//                plugins: [
//                    cleancss
//                ]
//            }))
//            .pipe(sourcemaps.write("."))
//
//            .pipe(gulp.dest("src/demo"))
//            .on('finish', () => {
//                cb();
//            });
//    });
//});


// ------------------------------------------------------------------------------ task : demo.scss
const demoScssSrc = ["src/scss/index.scss"];
const demoScssWatchSrc = ["src/scss/**/*.scss"];
gulp.task('demo.scss', cb => {

    del([
        `src/demo/demo.css`,
        `src/demo/demo.css.map`
    ]).then(paths => {
        gulp.src(demoScssSrc)
            .pipe(plumber())

            .pipe(sourcemaps.init())
            .pipe(rename(function (path) {
                if (path.basename === "index") {
                    path.basename = "demo";
                }
            }))

            .pipe(sass({
                errLogToConsole: true,
                outputStyle: "compressed"
            }))
            .pipe(sourcemaps.write(".", {
                includeContent: true,
                sourceRoot: "/demo.scss/"
            }))

            .pipe(gulp.dest("src/demo"))
            .on('finish', () => {
                cb();
            });
    });
});


// ------------------------------------------------------------------------------ task : demo.compile
gulp.task('demo.compile', cb => {

    runSequence(
        [
            "demo.scss",
            "demo.js"
        ],
        ()=> {
            "use strict";
            cb(); // 指示该任务已经执行完毕
        });

});


// ------------------------------------------------------------------------------ task : lib.assets.change
gulp.task('lib.assets.change', cb => {
    runSequence(
        'app.assets',
        'index.html',
        ()=> {
            cb();
        }
    );
});

// ------------------------------------------------------------------------------ task : app.assets.change
gulp.task('lib.assets.change', cb => {
    runSequence(
        'app.assets',
        'index.html',
        ()=> {
            cb();
        }
    );
});

// ------------------------------------------------------------------------------ task : app.js.change
gulp.task('app.js.change', cb => {
    runSequence(
        'app.js',
        'index.html',
        ()=> {
            cb();
        }
    );
});
//// ------------------------------------------------------------------------------ task : app.less.change
//gulp.task('app.less.change', cb => {
//    runSequence(
//        'app.less',
//        'index.html',
//        ()=> {
//            cb();
//        }
//    );
//});
// ------------------------------------------------------------------------------ task : app.scss.change
gulp.task('app.scss.change', cb => {
    runSequence(
        'app.scss',
        'index.html',
        ()=> {
            cb();
        }
    );
});
// ------------------------------------------------------------------------------ task : index.html.change
gulp.task('index.html.change', cb => {
    runSequence(
        'index.html',
        ()=> {
            cb();
        }
    );
});


// ------------------------------------------------------------------------------ task : demo.js.change
gulp.task('demo.js.change', cb => {
    runSequence(
        'demo.js',
        ()=> {
            cb();
        }
    );
});
// ------------------------------------------------------------------------------ task : demo.scss.change
gulp.task('demo.scss.change', cb => {
    runSequence(
        'demo.scss',
        ()=> {
            cb();
        }
    );
});

// ------------------------------------------------------------------------------ task : app.compile
gulp.task('app.compile', cb => {

    runSequence(
        "clean",
        [
            "lib.assets",
            "app.assets",
            "app.js",
            "app.scss"
        ],
        "index.html",
        ()=> {
            "use strict";
            cb(); // 指示该任务已经执行完毕
        });

});


// ------------------------------------------------------------------------------ task : package
const packageSrc = target + "/dist/**/*";
gulp.task('package', cb => {

    runSequence(
        "app.compile",
        () => {
            "use strict";
            gulp.src(packageSrc)
                .pipe(rename(p=> {
                    p.dirname = pkg.name + "/" + p.dirname;
                }))
                .pipe(tar(`${pkg.name}.tar`))
                .pipe(gzip())
                .pipe(gulp.dest(target))
                .on('finish', () => {
                    cb();
                });
        });
});


// ------------------------------------------------------------------------------ task : mock
gulp.task('mock', cb => {

    var mockDemon = nodemon({
        script: 'mock/index.js',
        watch: ['mock']
    }).on('restart', function () {
        gutil.log(`${ chalk.red('mock express server restarted')}`);
    }).on('start', function () {
        gutil.log(`${ chalk.red('mock express server started')}`);
    }).on('exit', function () {
        gutil.log(`${ chalk.red('mock express server exited')}`);
    }).on('crash', function () {
        gutil.log(`${ chalk.red('mock express server crashed')}`);
    });
    process.once('uncaughtException', function () {
        mockDemon.emit('quit');
    });
    cb();
});

// ------------------------------------------------------------------------------ task : default / watch
gulp.task('app.compile.end.notify', cb => {

    gutil.log(`${chalk.red('已经编译完毕，开始监听')}，请浏览器访问： http://dev.test.me/qh/admin/local/1xx00/`);
    cb();
});
gulp.task('default', cb => { //['connect'],

    // 先手动执行一遍
    runSequence(
        //"mock",
        "app.compile",
        'app.compile.end.notify'
    );

    // 再进行监测
    gulp.watch(libAssetsWatchSrc, ["lib.assets.change"])
        .on('change', logChange);

    gulp.watch(appAssetsWatchSrc, ["app.assets.change"])
        .on('change', logChange);

    gulp.watch(appJsWatchSrc, ["app.js.change"])
        .on('change', logChange);

    gulp.watch(appScssWatchSrc, ['app.scss.change'])
        .on('change', logChange);

    gulp.watch(indexHtmlWatchSrc, ['index.html.change'])
        .on('change', logChange);

    function logChange(event) {
        gutil.log(`File ${chalk.cyan(event.path)} was ${event.type}, running tasks...`);
    }
});


// ------------------------------------------------------------------------------ task : demo

gulp.task('demo', cb => {

    // 先手动执行一遍
    runSequence(
        "demo.compile"
    );

    // 再进行监测
    gulp.watch(demoJsWatchSrc, ["demo.js.change"])
        .on('change', logChange);

    gulp.watch(demoScssWatchSrc, ['demo.scss.change'])
        .on('change', logChange);

    function logChange(event) {
        gutil.log(`File ${chalk.cyan(event.path)} was ${event.type}, running tasks...`);
    }
});
