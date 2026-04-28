import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const settingsPath = path.join(
  os.homedir(),
  "Library",
  "Application Support",
  "Code",
  "User",
  "settings.json",
);

const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+/, "")
  .replace("T", "-");

const backupPath = `${settingsPath}.backup-${timestamp}`;

const raw = fs.readFileSync(settingsPath, "utf8");
const settings = JSON.parse(raw);

const updates = {
  "terminal.integrated.fontFamily":
    "'JetBrainsMono Nerd Font Mono', Menlo, Monaco, 'Courier New', monospace",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.lineHeight": 1.2,
  "terminal.integrated.letterSpacing": 0.2,
  "terminal.integrated.fontLigatures.enabled": true,
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.cursorWidth": 2,
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.cursorStyleInactive": "outline",
  "terminal.integrated.minimumContrastRatio": 1,
  "terminal.integrated.tabs.enabled": true,
  "terminal.integrated.tabs.hideCondition": "singleTerminal",
};

fs.copyFileSync(settingsPath, backupPath);

Object.assign(settings, updates);

fs.writeFileSync(settingsPath, `${JSON.stringify(settings, null, 4)}\n`, "utf8");

console.log(`Updated: ${settingsPath}`);
console.log(`Backup: ${backupPath}`);
