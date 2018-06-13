import gulp from 'gulp';
import less from 'gulp-sass';
import pug from 'gulp-pug';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import del from 'del';
const browserSync = require('browser-sync').create();

const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'build/assets/styles/'
  },
  templates: {
    src: 'src/templates/*.pug',
    dest: 'build/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'build/assets/scripts/'
  },
  fonts: {
    src: 'src/vendor/fonts/*.ttf',
    dest: 'build/assets/styles/fonts/'
  },
  img: {
    src: 'src/img/**/*',
    dest: 'build/assets/styles/img/'
  },  
  vendor: {
    styles: {
      src: 'src/vendor/styles/**/*.css',
      dest: 'build/assets/styles/'
    },
    scripts: {
      src: 'src/vendor/scripts/**/*.js',
      dest: 'build/assets/scripts/'
    },
  },
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'assets' ]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

export function html() {
  return gulp.src(paths.templates.src)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.templates.dest))
    .pipe(browserSync.stream());
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

export function vendorStyles() {
  return gulp.src(paths.vendor.styles.src)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(paths.vendor.styles.dest))
    .pipe(browserSync.stream());
}

export function vendorScripts() {
  return gulp.src(paths.vendor.scripts.src)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.vendor.scripts.dest))
    .pipe(browserSync.stream());
}

/*========*/
export function vendorFonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
}

export function copyImg() {
  return gulp.src(paths.img.src)
    .pipe(gulp.dest(paths.img.dest))
}

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);

  gulp.watch(paths.vendor.scripts.src, vendorScripts);
  gulp.watch(paths.vendor.styles.src, vendorStyles);

  gulp.watch('src/templates/includes/*.pug', html);

  return gulp.watch(paths.templates.src, html);
}
export { watchFiles as watch };

export function serve() {
  browserSync.init({
    server: "./build",
  });
  watchFiles()
    .on('change', browserSync.reload);
}

/*
 * You can still use `gulp.task`
 * for example to set task names that would otherwise be invalid
 */
const build = gulp.series(clean, gulp.parallel(styles, scripts, vendorStyles, vendorScripts, html, vendorFonts, copyImg));
gulp.task('build', build);

/*
 * Export a default task
 */
export default build;