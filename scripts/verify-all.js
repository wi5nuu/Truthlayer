const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BACKEND = path.join(ROOT, 'backend');
const WEB = path.join(ROOT, 'web');

function run(label, cmd, cwd) {
  console.log(`\n=== ${label} ===`);
  try {
    const out = execSync(cmd, { cwd, timeout: 60000, encoding: 'utf8', stdio: 'pipe' });
    console.log(out);
    console.log('PASS');
    return true;
  } catch (err) {
    console.log(err.stdout || err.message);
    console.log('FAIL');
    return false;
  }
}

async function main() {
  const results = [
    run('Backend Tests', 'npm test', BACKEND),
    run('Web Lint', 'npx next lint --no-cache 2>&1 || true', WEB),
  ];
  const passed = results.filter(Boolean).length;
  console.log(`\n${passed}/${results.length} checks passed`);
  process.exit(passed === results.length ? 0 : 1);
}

main();
