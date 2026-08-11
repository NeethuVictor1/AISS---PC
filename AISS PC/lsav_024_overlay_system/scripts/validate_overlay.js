const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../src/design-system/overlays/floating_callout_overlay.json');
const REQUIRED_PROPERTIES = ['canvas_sprawl_limit', 'elevation_tokens', 'fluid_width', 'border_accents'];

function validateOverlayConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('[M1 FAIL] Overlay configuration file missing at expected path.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const tokens = data.token_values || {};
  const missing = REQUIRED_PROPERTIES.filter(prop => !(prop in tokens));

  if (missing.length > 0) {
    console.error(`[M1 FAIL] Missing required layout properties: ${missing.join(', ')}. Halting save.`);
    process.exit(1);
  }

  console.log('[M1 PASSED] All 4 required layout properties verified successfully.');
}

validateOverlayConfig();
