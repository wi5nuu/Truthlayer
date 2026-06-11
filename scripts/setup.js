#!/usr/bin/env node
/**
 * Setup script for TruthLayer development environment.
 * Run once after cloning: node scripts/setup.js
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");

function run(cmd, cwd = REPO_ROOT) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

function main() {
  console.log("=== TruthLayer Dev Setup ===\n");

  // 1. Backend
  console.log("── Backend ──");
  run("npm install", path.join(REPO_ROOT, "backend"));
  if (!fs.existsSync(path.join(REPO_ROOT, "backend", ".env"))) {
    fs.copyFileSync(
      path.join(REPO_ROOT, "backend", ".env.example"),
      path.join(REPO_ROOT, "backend", ".env")
    );
    console.log("Created backend/.env from .env.example");
  }
  run("npm test", path.join(REPO_ROOT, "backend"));

  // 2. Web
  console.log("\n── Web Dashboard ──");
  run("npm install", path.join(REPO_ROOT, "web"));

  // 3. Extension (no deps needed)
  // 4. Git hooks
  if (fs.existsSync(path.join(REPO_ROOT, ".git"))) {
    console.log("\n── Git Hooks ──");
    execSync(
      'git config core.hooksPath .githooks 2>nul || echo "No .githooks directory"',
      { cwd: REPO_ROOT, stdio: "inherit" }
    );
  }

  console.log("\n✓ Setup complete! See README.md for next steps.");
}

main();
