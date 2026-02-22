#!/usr/bin/env node
/**
 * Rename the template scope and app identifiers.
 *
 * Usage:
 *   pnpm rename myscope "My App Name"
 *
 * Args:
 *   1) scope (required): replaces all "@template/" occurrences with "@<scope>/"
 *   2) displayName (optional): used for Expo app name/slug/scheme
 */
const fs = require("node:fs");
const path = require("node:path");

const scope = process.argv[2];
const displayName = process.argv[3] || "My App";
if (!scope) {
  console.error("Usage: pnpm rename <scope> [Expo App Name]");
  process.exit(1);
}

const replaceScopeString = (value) =>
  typeof value === "string"
    ? value.replace(/@template\//g, `@${scope}/`)
    : value;

const rewriteDeps = (obj) => {
  if (!obj) return;
  for (const key of Object.keys(obj)) {
    obj[key] = replaceScopeString(obj[key]);
  }
};

const packageFiles = [
  "package.json",
  "apps/web/package.json",
  "apps/expo/package.json",
  "convex/package.json",
  "tooling/typescript/package.json",
];

for (const rel of packageFiles) {
  const file = path.join(process.cwd(), rel);
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  if (typeof json.name === "string" && json.name.startsWith("@template/")) {
    json.name = replaceScopeString(json.name);
  }
  rewriteDeps(json.dependencies);
  rewriteDeps(json.devDependencies);
  rewriteDeps(json.peerDependencies);
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`Updated scope in ${rel}`);
}

// Expo app.json rename
const expoAppJsonPath = path.join(process.cwd(), "apps/expo/app.json");
if (fs.existsSync(expoAppJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(expoAppJsonPath, "utf8"));
  const expo = appJson.expo || appJson;
  const slug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    || "app";
  expo.name = displayName;
  expo.slug = slug;
  expo.scheme = slug;
  appJson.expo = expo;
  fs.writeFileSync(expoAppJsonPath, `${JSON.stringify(appJson, null, 2)}\n`);
  console.log("Updated Expo app.json name/slug/scheme");
}

console.log(
  `Done. Scope is now @${scope}/. If you committed the template, rerun pnpm install to refresh the lockfile.`,
);
