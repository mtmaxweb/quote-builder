const fs = require("fs")
const path = require("path")

const buildDir = path.join(__dirname, "build")
const staticDir = path.join(buildDir, "static")

// Rename main JS file
const jsDir = path.join(staticDir, "js")
fs.readdirSync(jsDir).forEach((file) => {
  if (file.startsWith("main-")) {
    fs.renameSync(path.join(jsDir, file), path.join(jsDir, "main.js"))
  }
})

// Rename main CSS file
const cssDir = path.join(staticDir, "css")
fs.readdirSync(cssDir).forEach((file) => {
  if (file.startsWith("main-")) {
    fs.renameSync(path.join(cssDir, file), path.join(cssDir, "main.css"))
  }
})

console.log("Post-build processing completed.")

