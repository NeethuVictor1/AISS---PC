const locateBundle = require('./m1_locate_bundle');
const checkBranch = require('./m2_branch_check');
const { execSync } = require('child_process');

console.log('==================================================');
console.log('Executing SGTIM-019 Full Implementation Pipeline');
console.log('==================================================');

locateBundle();
checkBranch();

console.log('[M3] Validating configuration & pushing BigQuery telemetry...');
try {
  execSync('python3 scripts/bigquery_telemetry_logger.py', { stdio: 'inherit' });
  console.log('==================================================');
  console.log('SUCCESS: All steps executed with Pass status.');
  console.log('==================================================');
} catch (e) {
  console.error('[Error] Pipeline failed during M3 execution.');
  process.exit(1);
}
