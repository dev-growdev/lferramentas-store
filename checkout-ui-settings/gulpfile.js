const gulp = require("gulp"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass")(require("sass")),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  http = require('http'),
  st = require('st'),
  fs = require('fs');
const livereload = require('gulp-livereload');

/**
    ___ _           _            _             _
  / __| |_  ___ __| |_____ _  _| |_   ___ ___| |_ _  _ _ __
 | (__| ' \/ -_) _| / / _ \ || |  _| (_-</ -_)  _| || | '_ \
  \___|_||_\___\__|_\_\___/\_,_|\__| /__/\___|\__|\_,_| .__/
                                                      |_|
 */

// const webpack = require("webpack");
// const pacote = require("package.json");

// const isProduction = process.env.NODE_ENV === "production";

const paths = {
  styles: {
    src: "styles/sass/*.{scss,css,sass}",
    watch: "styles/sass/**/*.scss",
  },
  scripts: {
    src: "js/*.js",
    watch: "js/*.js",
  },
  output: "checkout-ui-custom",
  outputStatic: "checkout-ui-custom",
  tmp: ".temp",
};

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(
      rename({
        prefix: "",
        extname: ".css",
      })
    )
    .pipe(gulp.dest(paths.outputStatic))
    .pipe(livereload());
}

function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat("checkout6-custom.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.outputStatic));
}

function watch(done) {
  gulp.watch(paths.scripts.watch, { ignoreInitial: false }, scripts);
  gulp.watch(paths.styles.watch, { ignoreInitial: false }, styles);
  done()
}

function serverFiles(done) {
  http.createServer(
    st({ path: __dirname + '/checkout-ui-custom', index: '/checkout6-custom.css', cache: false })
  ).listen(8080, () => {
    fs.readdir('./checkout-ui-custom', (err, files) => {
      if (err) {
        done(err);
        return;
      }
      console.log("\nServing files:")
      files.forEach(fn => {
        console.log("http://localhost:8080/files/" + fn)
      })
      console.log("\n")
      done()
    });
  });
}

const build = gulp.series(gulp.parallel(styles, scripts));

exports.build = build;
exports.scripts = scripts;
exports.styles = styles;
exports.watch = gulp.series(build, watch, serverFiles);
exports.default = gulp.series(build, watch, serverFiles);
livereload.listen({ basePath: 'checkout-ui-custom' });