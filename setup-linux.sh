#!/usr/bin/env bash

set -euo pipefail

SKILL_NAME="fanqie-author-publish"
BASE_DIR="${1:-$HOME/openclaw-skills}"
SKILL_DIR="$BASE_DIR/$SKILL_NAME"

REQUIRED_FILES=(
  "README.md"
  "SKILL.md"
  "manifest.json"
  "browser-workflow.md"
  "execution-policy.md"
  "selectors.md"
  "input.schema.json"
  "output.schema.json"
  "chapter.template.json"
  "chapter.example.json"
  "chapters.batch.template.json"
  "chapters.batch.example.json"
  "publish-log.template.md"
  "test-cases.md"
  "real-site-calibration-checklist.md"
)

echo "[1/5] 初始化目录"
mkdir -p "$SKILL_DIR"
mkdir -p "$SKILL_DIR/logs"
mkdir -p "$SKILL_DIR/screenshots"

echo "[2/5] 检查技能目录"
if [[ ! -d "$SKILL_DIR" ]]; then
  echo "技能目录不存在: $SKILL_DIR" >&2
  exit 1
fi

echo "[3/5] 检查关键文件"
missing=0
for file in "${REQUIRED_FILES[@]}"; do
  if [[ ! -f "$SKILL_DIR/$file" ]]; then
    echo "缺少文件: $SKILL_DIR/$file"
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  cat <<EOF

检测到关键文件缺失。

请先把本地技能包完整复制到：
  $SKILL_DIR

然后重新执行：
  bash "$SKILL_DIR/setup-linux.sh"
EOF
  exit 1
fi

echo "[4/5] 写入目录占位文件"
touch "$SKILL_DIR/logs/.gitkeep"
touch "$SKILL_DIR/screenshots/.gitkeep"

echo "[5/5] 输出后续步骤"
cat <<EOF

初始化完成。

技能目录：
  $SKILL_DIR

建议下一步：
1. 确认 OpenClaw 可以访问这个目录
2. 使用独立浏览器 profile 手动登录番茄作者后台
3. 先用以下文件做单章测试：
   $SKILL_DIR/chapter.example.json
4. 按以下清单做真实页面联调：
   $SKILL_DIR/real-site-calibration-checklist.md
5. 把运行日志写入：
   $SKILL_DIR/logs/
6. 把截图保存到：
   $SKILL_DIR/screenshots/

如果你还没复制技能包内容，可先执行：
  rsync -av ./fanqie-author-publish/ "$SKILL_DIR/"

EOF
