const fs = require('fs');
const path = require('path');

function runComplianceCheck() {
  const tokenFilePath = path.join(__dirname, '../tokens/md3StatusTokens.json');
  const rawData = fs.readFileSync(tokenFilePath, 'utf-8');
  const { tokens } = JSON.parse(rawData);

  const minContrastFloor = 4.5;
  let passedCount = 0;
  const totalTokens = Object.keys(tokens).length;
  const auditResults = [];

  for (const [key, token] of Object.entries(tokens)) {
    const pass = token.contrastRatio >= minContrastFloor;
    if (pass) passedCount++;
    auditResults.push({
      statusState: key,
      colorCode: token.hex,
      contrastRatio: token.contrastRatio,
      pass: pass
    });
  }

  const score = Number((passedCount / totalTokens).toFixed(2));
  const result = {
    metricName: "MD3 Design Token Compliance (status icon colors)",
    score: score,
    floorBoundary: 0.9,
    target: 1.0,
    status: score >= 0.9 ? "Pass" : "Fail",
    timestamp: new Date().toISOString(),
    auditResults: auditResults
  };

  console.log("=== MD3 DESIGN TOKEN COMPLIANCE REPORT ===");
  console.log(JSON.stringify(result, null, 2));

  return result;
}

if (require.main === module) {
  runComplianceCheck();
}

module.exports = runComplianceCheck;
