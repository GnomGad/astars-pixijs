import gulp from "gulp";
import imagemin from "gulp-imagemin";
import csso from "gulp-csso";
import htmlmin from "gulp-htmlmin";
import uglify from "gulp-uglify";
import browserify from "gulp-browserify";
import plumber from "gulp-plumber";
import babel from "gulp-babel";

const html = {
        in: "./index.html",
        out: "./dist",
    },
    js = {
        in: "./src/js/**/*.*s",
        out: "./dist/src/js",
        name: "main.min.js",
    },
    css = {
        in: "./src/css/**/*.css",
        out: "./dist/src/css",
        name: "main.min.css",
    },
    img = {
        in: "./src/assets/**/*.*",
        out: "./dist/src/assets",
    };

// task for html
gulp.task("html", async function () {
    gulp.src(html.in)
        .pipe(plumber())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(html.out));
});

// task for css
gulp.task("css", async function () {
    gulp.src(css.in).pipe(plumber()).pipe(csso()).pipe(gulp.dest(css.out));
});

// task for js
gulp.task("js", async function () {
    gulp.src(js.in)
        .pipe(plumber())

        // .pipe(
        //     babel({
        //         presets: ["@babel/preset-env"],
        //     })
        // )
        //.pipe(uglify())
        .pipe(gulp.dest(js.out));
});

// task for images
gulp.task("img", async function () {
    gulp.src(img.in).pipe(plumber()).pipe(imagemin()).pipe(gulp.dest(img.out));
});

// task for
gulp.task("build", gulp.series("html", "css", "js", "img"));
