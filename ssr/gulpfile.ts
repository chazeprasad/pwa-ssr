import '@babel/polyfill';
import * as gulp from 'gulp';
import changed from 'gulp-changed';
import nodemon from 'gulp-nodemon';
import * as ts from 'gulp-typescript';
import del from 'del';
import runSequence from 'gulp4-run-sequence';

const src = './src';
const dest = './dist';

const copy = gulp.task('copy', async () => {
    await gulp.src([ src + '/view/**/*.hbs' ])
        .pipe(gulp.dest(dest + '/view'));
});

const serve = gulp.task('serve', async (next) => {
    await nodemon({
        script: './index.js',
        ext: 'js json env hbs',
        ignore: [
            './src/*',
            './dist/*',
            './test/*',
            './docs/*',
            './gulp/*',
            './.git',
            './node_modules/*'
        ],

        watch: ['./src/*'],
        done: next
    });
});


const transpile = gulp.task('transpile', async (next) => {
    const tsProject = ts.createProject('tsconfig.json');

    const tsResult = tsProject.src()
        .pipe(tsProject());

    await tsResult.js.pipe(gulp.dest(dest)); 
});

const clean = gulp.task('clean', async () => {
    await del([dest] );
})

const dev = gulp.task('dev',  (next) => {
    runSequence('clean', 'copy', 'transpile', 'serve', next);
})

const build = gulp.task('build',  (next) => {
    runSequence('clean', 'copy', 'transpile', next);
})
