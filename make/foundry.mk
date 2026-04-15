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

# ===== 部署 Swap =====
deploy-swap:
	cd $(FOUNDRY_DIR) && \
	forge script script/DeploySimpleSwap.s.sol \
		--rpc-url $(RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast


build:
	cd foundry && forge build
	./scripts/sync-abi.sh