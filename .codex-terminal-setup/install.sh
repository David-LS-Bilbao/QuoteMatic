#!/bin/zsh

set -euo pipefail

SOURCE_DIR="${0:A:h}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$HOME/.config"

if [ -f "$HOME/.zshrc" ]; then
  cp "$HOME/.zshrc" "$HOME/.zshrc.backup-$TIMESTAMP"
fi

if [ -f "$HOME/.config/starship.toml" ]; then
  cp "$HOME/.config/starship.toml" "$HOME/.config/starship.toml.backup-$TIMESTAMP"
fi

cp "$SOURCE_DIR/.zshrc" "$HOME/.zshrc"
cp "$SOURCE_DIR/starship.toml" "$HOME/.config/starship.toml"

echo "Installed:"
echo "  - $HOME/.zshrc"
echo "  - $HOME/.config/starship.toml"
echo
echo "Backups:"
echo "  - $HOME/.zshrc.backup-$TIMESTAMP"
if [ -f "$HOME/.config/starship.toml.backup-$TIMESTAMP" ]; then
  echo "  - $HOME/.config/starship.toml.backup-$TIMESTAMP"
fi
