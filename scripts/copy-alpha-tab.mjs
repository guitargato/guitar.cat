import fs from "node:fs";
import path from "node:path";

const alphaTabDir = path.resolve("node_modules/@coderline/alphatab/dist");
const publicDir = path.resolve("public/alphatab");

// Clean and recreate destination directory
fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

// Copy alphaTab.min.js
const jsSrc = path.join(alphaTabDir, "alphaTab.min.js");
const jsDst = path.join(publicDir, "alphaTab.min.js");
fs.copyFileSync(jsSrc, jsDst);

// Helper to copy directories recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

// Copy font and soundfont directories if they exist
const fontSrc = path.join(alphaTabDir, "font");
const soundfontSrc = path.join(alphaTabDir, "soundfont");

if (fs.existsSync(fontSrc)) copyDir(fontSrc, path.join(publicDir, "font"));
if (fs.existsSync(soundfontSrc)) copyDir(soundfontSrc, path.join(publicDir, "soundfont"));

console.log("alphaTab.min.js, font, and soundfont copied to /public/alphatab");
