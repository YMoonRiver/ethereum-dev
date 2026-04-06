#!/bin/bash

echo "🔄 Syncing ABI..."

mkdir -p shared/abi

# 提取 ABI（需要 jq）
jq '.abi' foundry/out/MyToken.sol/MyToken.json > shared/abi/MyToken.json

echo "✅ ABI extracted"