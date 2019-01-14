var gulp = require('gulp');
var minify = require('gulp-minify');
var htmlmin = require('gulp-htmlmin');

// Run 'gulp build' to create production build

gulp.task('build', async function() {
    gulp.src('./*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        })).pipe(gulp.dest('build'));
    gulp.src('./assets/js/*.js')
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('build/assets/js'));
    gulp.src('./assets/sounds/*')
        .pipe(gulp.dest('build/assets'));
    gulp.src('./assets/css/*.css')
        .pipe(gulp.dest('build/assets/css'));
});

// Then git checkout to gh-pages and run 'git checkout master -- build' 