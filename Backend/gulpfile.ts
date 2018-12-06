import gulp = require('gulp')
import del = require('del')
import ts = require("gulp-typescript")

//import sass from 'gulp-sass'
//import {Options} from 'node-sass'
//import shell from 'gulp-shell'


const tsconfigServer = {
    "target": "esnext",                       
    "module": "commonjs",                    
    "strict": true,                          
    "esModuleInterop": true ,                  
    "experimentalDecorators": true,           
    "emitDecoratorMetadata": true,             
}

/*
//für Express, nicht nötig für Angular
const tsconfigClient = {
    "target": "es5",                       
    "module": "amd",                    
    "strict": true,                          
    "esModuleInterop": true ,                  
    "experimentalDecorators": true,           
    "emitDecoratorMetadata": true, 
    outFile:"./main.js"
}
*/

/*
const sassBuildOptions:Options = {
    outputStyle:"compressed", 
}

const sassWatchOptions:Options = {
    outputStyle:"expanded"
}
*/

//###################################################################
//###  Javascript Build erstellen ( src >> build )
//###################################################################


gulp.task('clean-build', function(){
    return del('build/**', {force:true});
})

gulp.task('typescript-server-build', () => 
    gulp.src(['**/*.ts', '!node_modules/**/*', '!client/**/*.ts'])
        .pipe(ts(tsconfigServer))
        .pipe(gulp.dest('build'))
)

//gulp.task('typescript-client-build', () => 
//   gulp.src('src/client/**/*.ts')
//        .pipe(ts(tsconfigClient))
//        .pipe(gulp.dest('build/public/js'))
//)


//gulp.task('hbs-copy-build',() =>
//     gulp.src('src/**/*.handlebars').pipe(gulp.dest('build'))
//)


//gulp.task('sass-build',() => 
//    gulp.src('src/sass/**/*.scss')
//        .pipe(sass(sassBuildOptions).on('error', sass.logError))
//        .pipe(gulp.dest('./build/public/css'))
//)

gulp.task('pem-copy-build',() =>
    gulp.src(['**/*.pem', '!node_modules/**/*']).pipe(gulp.dest('build'))
)

gulp.task('public-copy-build', () => 
    gulp.src(['public/**/*', '!node_modules/**/*']).pipe(gulp.dest('build/public'))
)

gulp.task('config-copy-build', () => 
    gulp.src(['**/*.json', '!node_modules/**/*']).pipe(gulp.dest('build'))
)

gulp.task('node-copy-build', () => 
    gulp.src(['node_modules/**/*']).pipe(gulp.dest('build/node_modules'))
)

gulp.task('build' ,gulp.series([
    'clean-build',
    gulp.parallel([
        'typescript-server-build',
        'pem-copy-build',
        'config-copy-build',
        'public-copy-build',
        'node-copy-build'
    ])
]))