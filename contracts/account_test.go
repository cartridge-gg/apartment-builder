package contracts

import (
	"context"
	"fmt"
	"math/big"
	"os"
	"strings"
	"testing"

	"github.com/dontpanicdao/caigo"
	"github.com/dontpanicdao/caigo/gateway"
	"github.com/dontpanicdao/caigo/types"
	"github.com/joho/godotenv"
)

func TestGeneratePrivateKey(t *testing.T) {
	privateKey, _ := caigo.Curve.GetRandomPrivateKey()
	fmt.Printf("private key: 0x%s\n", privateKey.Text(16))
	publicKey, _, _ := caigo.Curve.PrivateToPoint(privateKey)
	fmt.Printf("public key: 0x%s\n", publicKey.Text(16))
}

// DeclareClass
func DeclareClass(t *testing.T, compiledContractFile string) types.AddDeclareResponse {
	testConfig := beforeEach(t)

	gw := testConfig.client
	ctx := context.Background()
	declare, err := gw.Declare(ctx, compiledContractFile, types.DeclareRequest{})
	if err != nil {
		t.Fatalf("could not 'DECLARE' contract: %v\n", err)
	}
	tx, err := gw.Transaction(context.Background(), gateway.TransactionOptions{TransactionHash: declare.TransactionHash})
	if err != nil {
		t.Errorf("could not get 'DECLARE' transaction: %v\n", err)
	}
	if tx.Transaction.Type != gateway.DECLARE {
		t.Errorf("incorrect declare transaction: %v\n", tx)
	}
	return declare
}

// DeclareClass
func TestDeclareClass_Account(t *testing.T) {
	declare := DeclareClass(t, "artifacts/account.json")
	if !strings.HasPrefix(declare.TransactionHash, "0x") ||
		!strings.HasPrefix(declare.ClassHash, "0x") {
		t.Fatalf("could not 'DECLARE' contract, %+v\n", declare)
	}
	fmt.Println("...")
	fmt.Println("   verify transaction")
	fmt.Println("...")
	fmt.Println("export STARKNET_WALLET=starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount")
	fmt.Println("export STARKNET_NETWORK=alpha-goerli")
	fmt.Printf("export HASH=%s\n", declare.TransactionHash)
	fmt.Println("starknet get_transaction --hash $HASH --feeder_gateway http://localhost:5050/feeder_gateway")
	fmt.Println("...")
}

// DeployContract
func DeployContract(t *testing.T, compiledContractFile string, deployConfig types.DeployRequest) types.AddDeployResponse {
	testConfig := beforeEach(t)

	gw := testConfig.client
	ctx := context.Background()
	deploy, err := gw.Deploy(ctx, compiledContractFile, deployConfig)
	if err != nil {
		t.Fatalf("could not 'DEPLOY' contract: %v\n", err)
	}
	tx, err := gw.Transaction(context.Background(), gateway.TransactionOptions{TransactionHash: deploy.TransactionHash})
	if err != nil {
		t.Errorf("could not get 'DEPLOY' transaction: %v\n", err)
	}
	if tx.Transaction.Type != gateway.DEPLOY {
		t.Errorf("incorrect deploy transaction: %v\n", tx)
	}
	return deploy
}

func TestDeploy_ProxyAccount(t *testing.T) {
	accountClassHash := "0x31d8604c8e4615723d19667da361b00c844d79c849f43a0d05f1494693d05dd"
	accountClassHashDecimal, _ := big.NewInt(0).SetString(accountClassHash, 0)
	err := godotenv.Load(".env." + testEnv)
	if err != nil {
		t.Fatalf("cannot load dotenv file: %v\n", err)
	}
	publickKey := os.Getenv("PUBLIC_KEY")
	if !strings.HasPrefix(publickKey, "0x") {
		t.Fatalf("should have a public key registered, instead: %s", publickKey)
	}
	publickKeyDecimal, _ := big.NewInt(0).SetString(publickKey, 0)
	deploy := DeployContract(t,
		"artifacts/proxy.json",
		types.DeployRequest{
			ContractAddressSalt: "0x0",
			ConstructorCalldata: []string{
				accountClassHashDecimal.Text(10),
				caigo.GetSelectorFromName("initialize").Text(10),
				"1",
				publickKeyDecimal.Text(10),
			},
		},
	)
	fmt.Println("transaction", deploy.TransactionHash)
	fmt.Println("contract", deploy.ContractAddress)
	if !strings.HasPrefix(deploy.TransactionHash, "0x") {
		t.Fatalf("could not 'DEPLOY' contract, %+v\n", deploy)
	}
	fmt.Println("...")
	fmt.Println("   verify transaction")
	fmt.Println("...")
	fmt.Println("export STARKNET_WALLET=starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount")
	fmt.Println("export STARKNET_NETWORK=alpha-goerli")
	fmt.Printf("export HASH=%s\n", deploy.TransactionHash)
	fmt.Println("starknet get_transaction --hash $HASH --feeder_gateway http://localhost:5050/feeder_gateway")
	fmt.Println("...")
}

func TestDeploy_DappsContract(t *testing.T) {
	accountAddress := "0x386cabdfdf6369d81f583bfcd2a49a9fda7a4bf41ebdfd3309ee0d5c4708e86"
	accountAddressDecimal, _ := big.NewInt(0).SetString(accountAddress, 0)
	deploy := DeployContract(t,
		"artifacts/dapps.json",
		types.DeployRequest{
			ContractAddressSalt: "0x0",
			ConstructorCalldata: []string{
				caigo.UTF8StrToBig("ApartmentBuilder Dapp").Text(10),
				caigo.UTF8StrToBig("DAPP").Text(10),
				accountAddressDecimal.Text(10),
			},
		},
	)
	fmt.Println("transaction", deploy.TransactionHash)
	if !strings.HasPrefix(deploy.TransactionHash, "0x") {
		t.Fatalf("could not 'DEPLOY' dapps, %+v\n", deploy)
	}
	fmt.Println("...")
	fmt.Println("   verify transaction")
	fmt.Println("...")
	fmt.Println("export STARKNET_WALLET=starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount")
	fmt.Println("export STARKNET_NETWORK=alpha-goerli")
	fmt.Printf("export HASH=%s\n", deploy.TransactionHash)
	fmt.Println("starknet get_transaction --hash $HASH --feeder_gateway http://localhost:5050/feeder_gateway")
	fmt.Println("...")
}
