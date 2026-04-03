#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA_FILE="$SCRIPT_DIR/input.schema.json"
INPUT_FILE="${1:-}"

if [[ -z "$INPUT_FILE" ]]; then
  echo "用法: bash validate-input.sh /path/to/input.json"
  exit 1
fi

npx --yes ajv-cli validate -s "$SCHEMA_FILE" -d "$INPUT_FILE"
