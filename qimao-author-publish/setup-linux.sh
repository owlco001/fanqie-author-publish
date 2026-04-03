#!/usr/bin/env bash

set -euo pipefail

BASE_DIR="${1:-$HOME/openclaw-skills}"
SKILL_DIR="$BASE_DIR/qimao-author-publish"

mkdir -p "$SKILL_DIR/logs"
mkdir -p "$SKILL_DIR/screenshots"

echo "初始化完成: $SKILL_DIR"
echo "下一步：手动登录七猫作者后台，并按 real-site-calibration-checklist.md 做联调。"
