const fs = require('fs');
const path = require('path');
function locateBundle() {
  const targetDir = path.join(process.cwd(), 'src', 'components', 'layout');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  console.log('[M1 Pass] Layout component bundle located:', targetDir);
  return targetDir;
}
if (require.main === module) locateBundle();
module.exports = locateBundle;
