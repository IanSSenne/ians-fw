var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var concat = require("gulp-concat-util");
var run = require("gulp-run-command").default;
gulp.task("tsc-compile", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("build"));
});
gulp.task("pack", function() {
    return gulp.src("./build/**.js")
        .pipe(concat.scripts("build.js"))
        .pipe(gulp.dest("./dist/"));
});
gulp.task("rollup", run("npm run rollup", {}));
gulp.task("minify", run("npm run minify", {
    cwd: __dirname
}));
gulp.task("make", gulp.series("tsc-compile", "pack", "rollup", "minify"));
gulp.task("watch", function() {
    gulp.watch("./src/**/*", gulp.series("make"));
});
gulp.task("default", gulp.series("make", "watch"));