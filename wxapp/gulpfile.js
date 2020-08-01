var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");

var fs = require('fs');
var Excel = require('exceljs');
var WorkbookParse = new (require('./script/WorkbookParse'));

sass.compiler = require('node-sass');

var STYLE_FILES = ['./**/*.scss', '!node_modules/**'];

gulp.task('sass', function () {
    return gulp.src(STYLE_FILES)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            extname: '.wxss'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('sass:watch', function () {
    gulp.watch(STYLE_FILES, gulp.series(['sass']));
});

gulp.task('database', async function (next) {
    {
        var workbook = new Excel.Workbook();
        await workbook.xlsx.readFile('../doc/element.xlsx');
        let element = WorkbookParse.Map(workbook);
        fs.writeFileSync('./database/element.js', 'export default ' + JSON.stringify(element), { encoding: 'utf8' });
    }
    {
        var workbook = new Excel.Workbook();
        await workbook.xlsx.readFile('../doc/ptable.xlsx');
        let ptable = WorkbookParse.Pos(workbook);
        fs.writeFileSync('./database/ptable.js', 'export default ' + JSON.stringify(ptable), { encoding: 'utf8' });
    }
    {
        var workbook = new Excel.Workbook();
        await workbook.xlsx.readFile('../doc/discovers.xlsx');
        let discovers = WorkbookParse.Array(workbook, true, false);
        fs.writeFileSync('./database/discovers.js', 'export default ' + JSON.stringify(discovers), { encoding: 'utf8' });
    }
});


gulp.task('default', gulp.series(['sass', 'sass:watch']));


