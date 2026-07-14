var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass")(require("sass"));
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var insert = require("gulp-insert");
var zip = require("gulp-zip").default;

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

// Concat & minify all js files (production build)
gulp.task("scripts:build", function () {
  return (
    gulp
      .src("src/dashboardjs/js/*.js")
      .pipe(concat("dashboard-all.js"))
      .pipe(uglify())
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

// The hand-maintained example folders under dist/ that mirror the built dashboardjs assets
var exampleDirs = [
  "dist/Full Example - Loads Seperate HTML Template - Server Only",
  "dist/Full Example - Uses Current HTML file - Works Locally",
  "dist/Simplest Example - No Configuration - Uses Current HTML file",
];

// Copy the freshly built dashboardjs assets into each example folder in dist/
gulp.task("syncExamples", function (done) {
  exampleDirs.forEach(function (exampleDir) {
    fs.cpSync(
      "src/dashboardjs/deploy/dashboard-all.js",
      path.join(exampleDir, "dashboardjs/js/dashboard-all.js"),
      { recursive: true }
    );
    fs.cpSync("src/dashboardjs/css", path.join(exampleDir, "dashboardjs/css"), {
      recursive: true,
    });
    fs.cpSync(
      "src/dashboardjs/dashboard.html",
      path.join(exampleDir, "dashboardjs/dashboard.html"),
      { recursive: true }
    );
    fs.cpSync("src/dashboardjs/fonts", path.join(exampleDir, "dashboardjs/fonts"), {
      recursive: true,
    });
    fs.cpSync("src/dashboardjs/assets", path.join(exampleDir, "dashboardjs/assets"), {
      recursive: true,
    });

    var exampleDataJs = path.join(exampleDir, "dashboardjs/js/data.js");
    if (fs.existsSync(exampleDataJs)) {
      fs.cpSync("src/dashboardjs/deploy/data.js", exampleDataJs, { recursive: true });
    }
  });

  done();
});

// Zip up the dist folder (excluding any stale zip already inside it)
gulp.task("zipDist", function () {
  return gulp
    .src(["dist/**/*", "!dist/DashboardJS.zip"], { base: "dist" })
    .pipe(zip("DashboardJS.zip"))
    .pipe(gulp.dest("dist"));
});

// Full production build: compile assets, sync into examples, then zip dist
gulp.task(
  "build",
  gulp.series(gulp.parallel("sass", "scripts:build"), "syncExamples", "zipDist")
);

gulp.task("default", gulp.parallel("serve"));
