
.EXPORT_ALL_VARIABLES:
CAIRO_PATH = ./cairo-contracts/src:./src

.PHONY: build
build: artifacts/dapps.json artifacts/account.json artifacts/proxy.json

artifacts/dapps.json: src/dapps.cairo artifacts
		starknet-compile ./src/dapps.cairo \
			--output ./artifacts/dapps.json \
			--abi ./artifacts/dapps_abi.json || \
			rm -f ./artifacts/dapps.json

artifacts/account.json: src/account.cairo artifacts
		starknet-compile ./src/account.cairo \
			--output ./artifacts/account.json \
			--abi ./artifacts/account_abi.json \
			--account_contract || \
			rm -f ./artifacts/account.json

artifacts/proxy.json: src/proxy.cairo artifacts
		starknet-compile ./src/proxy.cairo \
			--output ./artifacts/proxy.json \
			--abi ./artifacts/proxy_abi.json || \
			rm -f ./artifacts/proxy.json

artifacts:
	mkdir -p artifacts

.PHONY: deploycontracts
deploycontracts:
	go clean -testcache
	go test -v -run TestDeclareClass_Account
	go test -v -run TestDeploy_ProxyAccount
	go test -v -run TestDeploy_DappsContract
