const fs = require('fs');
const path = require('path');
function checkBranch() {
  const targetDir = path.join(process.cwd(), 'src', 'components', 'layout');
  const testFile = path.join(targetDir, '.write_test.tmp');
  fs.writeFileSync(testFile, 'permission_test');
  fs.unlinkSync(testFile);
  console.log('[M2 Pass] Workspace branch write permissions validated.');
}
if (require.main === module) checkBranch();
module.exports = checkBranch;
