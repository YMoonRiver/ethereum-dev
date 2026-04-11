# ===== 基础配置 =====
RPC_URL=http://127.0.0.1:8545
FOUNDRY_DIR=foundry
FRONTEND_DIR=frontend
SHARED_DIR=shared

# 读取环境变量
-include foundry/.env

# # ===== 默认任务 =====
# .PHONY: all
# all: deploy

# ===== 启动本地链 =====
anvil:
	anvil

# ===== 部署 Token（如果你有）=====
deploy-mytoken:
	cd $(FOUNDRY_DIR) && \
	forge script script/DeployMyToken.s.sol \
		--rpc-url $(RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast

# # ===== 部署 AMM =====
# deploy-amm:
# 	cd $(FOUNDRY_DIR) && \
# 	forge script script/DeployAMM.s.sol \
# 		--rpc-url $(RPC_URL) \
# 		--broadcast -vvvv

# # ===== 添加流动性 =====
# add-liquidity:
# 	cd $(FOUNDRY_DIR) && \
# 	forge script script/AddLiquidity.s.sol \
# 		--rpc-url $(RPC_URL) \
# 		--broadcast -vvvv

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

# ===== 一键部署（核心）=====
deploy:
	@echo "🚀 Starting full deploy..."
	make deploy-mytoken
	@echo "✅ ALL DONE"

build:
	cd foundry && forge build
	./scripts/sync-abi.sh