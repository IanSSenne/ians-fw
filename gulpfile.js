
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var concat = require("gulp-concat-util");
var uglify = require("gulp-uglify");
var run = require("gulp-run-command").default;
gulp.task("tsc-compile", function () {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("build"));
});
gulp.task("pack", function () {
  return gulp.src("./build/**.js")
    .pipe(concat.scripts("build.js"))
    // .pipe(closureCompiler({}))
    // .pipe(uglify())
    .pipe(gulp.dest("./dist/"));
});
gulp.task("rollup", run("npm run rollup", {}));
gulp.task("minify", run("npm run minify", {
  cwd: __dirname
}));
// gulp.task("minify", function () {
//   return gulp.src('./dist/index.js', { base: './' })
//     .pipe(closureCompiler({
//       compilation_level: 'ADVANCED',
//       warning_level: 'VERBOSE',
//       language_in: 'ECMASCRIPT6_STRICT',
//       language_out: 'ECMASCRIPT5_STRICT',
//       // output_wrapper: '(function(){\n%output%\n}).call(this);',
//       output_wrapper: '%output%',
//       js_output_file: 'index.min.js'
//     }, {
//         platform: ['native', 'java', 'javascript']
//       }))
//     .pipe(gulp.dest('./dist'));
// })
gulp.task("make", gulp.series("tsc-compile", "pack", "rollup", "minify"));
gulp.task("watch", function () {
  gulp.watch("./src/**/*", gulp.series("make"));
});
gulp.task("default", gulp.series("make", "watch"));