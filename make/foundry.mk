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

build:
	cd foundry && forge build
	./scripts/sync-abi.sh