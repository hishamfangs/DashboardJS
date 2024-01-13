var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass")(require("sass"));
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var insert = require("gulp-insert");

// Concat All js files
gulp.task("scripts", function () {
  return (
    gulp
      .src("src/dashboardjs/js/*.js")
      .pipe(concat("dashboard-all.js"))
      //.pipe(uglify())
      .pipe(
        insert.transform(function (contents, file) {
          return (
            "var FutureLabs = (function () {" +
            contents +
            `
				return {
					Action: Action,
					ActionsContainer: ActionsContainer,
					ActionsMenu: ActionsMenu,
					Component: Component,
					Dashboard: Dashboard,
					DataManager: DataManager,
					Field: Field,
					FieldHeader: FieldHeader,
					FieldHeaderContainer: FieldHeaderContainer,
					FileLoader: FileLoader,
					Filtering: Filtering,
					FilteringKeyword: FilteringKeyword,
					PageButton: PageButton,
					Paging: Paging,
					Record: Record,
					Recordset: Recordset,
					Sorting: Sorting,
					SortingItem: SortingItem,
					Tab: Tab,
					Tabs: Tabs,
					Template: Template,
					TemplateManager: TemplateManager,
					UserProfile: UserProfile,
					ViewSwitcher: ViewSwitcher,
					ViewSwitcherButton: ViewSwitcherButton
				};
			})();`
          );
        })
      )
      .pipe(gulp.dest("src/dashboardjs/deploy"))
      .pipe(browserSync.stream())
  );
});

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", function () {
  return gulp
    .src(["src/dashboardjs/scss/*.scss"])
    .pipe(sass())
    .pipe(gulp.dest("src/dashboardjs/css"))
    .pipe(browserSync.stream());
});

// Move the javascript files into our /src/js folder
/* gulp.task('js', function() {
		return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js'])
				.pipe(gulp.dest("src/js"))
				.pipe(browserSync.stream());
});
 */
// Static Server + watching scss/html files
gulp.task(
  "serve",
  gulp.parallel("sass", "scripts", function () {
    browserSync.init({
      server: "./src",
    });

    gulp.watch(["src/dashboardjs/scss/*.scss"], gulp.parallel("sass"));
    gulp.watch("src/dashboardjs/*.html").on("change", browserSync.reload);
    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/dashboardjs/js/*.js").on("change", browserSync.reload);
    gulp.watch("src/dashboardjs/deploy/*.js").on("change", browserSync.reload);
  })
);

gulp.task("default", gulp.parallel("serve"));
