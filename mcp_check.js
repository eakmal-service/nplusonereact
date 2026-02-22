const fs = require('fs');
try {
  const config = JSON.parse(fs.readFileSync('/Users/hanzalaqureshi/Library/Application Support/CloudCode/mcp.json', 'utf8'));
  console.log(JSON.stringify(config, null, 2));
} catch (e) {
  console.log("No default mcp.json found");
}
