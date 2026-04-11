.PHONY: frontend generate-types

# # ===== 导出 ABI 到 shared =====
# export-abi:
# 	mkdir -p $(SHARED_DIR)/abi
# 	jq '.abi' $(FOUNDRY_DIR)/out/SimpleAMM.sol/SimpleAMM.json > $(SHARED_DIR)/abi/SimpleAMM.json

# ===== 前端生成 wagmi types =====
generate-types:
	cd $(FRONTEND_DIR) && npx wagmi generate

# ===== 前端准备（ABI + types）=====
frontend:
	make generate-types