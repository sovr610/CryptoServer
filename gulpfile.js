var gulp = require("gulp"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  { src, dest } = require("gulp"),
  minify = require("gulp-minify"),
  babel = require("gulp-babel"),
  sourcemaps = require("gulp-sourcemaps");

const { series } = require("gulp");
var concat = require("gulp-concat");

async function concats() {
  return src([
    "./src/init.js",
    "./src/parkersCustomFunctions.js",
    "./src/util.js",
    "./src/server.js",
  ])
    .pipe(concat("all.js"))
    .pipe(dest("./dist/"));
}

function minifys() {
  return src(["./dist/all.js"])
    .pipe(sourcemaps.init())
    .pipe(minify())
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist/"));
}

exports.default = series(concats, minifys);
