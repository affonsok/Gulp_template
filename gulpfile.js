const {src, dest, watch, parallel} = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const browserify = require('browserify');
const babelify = require("babelify");
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const connect = require("gulp-connect");
const paths = {
    imgs:       { all: "src/assets/**/*", },
    html:       { all: "src/templates/**/*.html", },
    styles:     { all: "src/styles/**/*.scss", main: "src/styles/main.scss"  },
    scripts:    { all: 'src/scripts/**/*.js', main: "src/scripts/app.js" },
    output:     "dist",
}

function server() {
    connect.server({
        root: 'public',
        livereload: true,
        port: 3001,

    });
}

function sentinel() {
    watch(paths.imgs.all, { ignoreInitial: false }, imgs);
    watch(paths.html.all, { ignoreInitial: false }, html);
    watch(paths.styles.all, { ignoreInitial: false }, styles);
    watch(paths.scripts.all, { ignoreInitial: false }, scripts);
}

function html() {
    return src(paths.html.all).pipe(dest(paths.output));
}

function imgs() {
    return src(paths.imgs.all).pipe(dest(paths.output));
}

function styles() {
    return src(paths.styles.main)
        .pipe(sass({ outputStyle: 'compressed' }).on( 'error', sass.logError ))
        .pipe(dest( paths.output ) )
        .pipe(connect.reload());
}

function scripts() {
    return browserify(paths.scripts.main)
        .transform(
            babelify.configure({
                presets: ["@babel/preset-env"],
            })
        )
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(dest(paths.output))
        .pipe(connect.reload());
}

exports.default = parallel( server, sentinel) ;
