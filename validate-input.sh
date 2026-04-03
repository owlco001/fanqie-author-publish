#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA_FILE="$SCRIPT_DIR/input.schema.json"
INPUT_FILE="${1:-}"

if [[ -z "$INPUT_FILE" ]]; then
  cat <<EOF
用法：
  bash validate-input.sh /path/to/input.json

说明：
  - 用于校验单章节或批量章节 JSON 输入
  - 依赖 Node.js 和 npx
  - 使用 input.schema.json 进行校验
EOF
  exit 1
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "输入文件不存在: $INPUT_FILE" >&2
  exit 1
fi

if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "Schema 文件不存在: $SCHEMA_FILE" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "未检测到 node，请先安装 Node.js。" >&2
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "未检测到 npx，请先安装 npm / npx。" >&2
  exit 1
fi

echo "开始校验输入文件..."
echo "Schema: $SCHEMA_FILE"
echo "Input : $INPUT_FILE"

npx --yes ajv-cli validate -s "$SCHEMA_FILE" -d "$INPUT_FILE"

echo
echo "校验通过。"
