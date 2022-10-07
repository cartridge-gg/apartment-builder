package contracts

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"math/big"
	"net/http"
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
	fmt.Println("contract", deploy.ContractAddress)
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

// MintEth
func MintEth(t *testing.T, accountAddress string) {
	payload := fmt.Sprintf(`{"address": "%s","amount": 1000000000000000}`, accountAddress)
	resp, err := http.Post(
		"http://localhost:5050/mint",
		"application/json",
		bytes.NewBuffer([]byte(payload)),
	)

	if err != nil {
		log.Fatal("could not POST data", err)
	}

	if resp.StatusCode != http.StatusOK {
		log.Fatal("unexpected status code:", resp.StatusCode)
	}
	ret, err := io.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		log.Fatal("could not read body", err)
	}
	fmt.Println("output", string(ret))
}

// CallContract
func CallContract(t *testing.T, call types.FunctionCall) []string {
	testConfig := beforeEach(t)

	gw := testConfig.client
	ctx := context.Background()
	result, err := gw.Call(ctx, call, "latest")
	if err != nil {
		t.Fatalf("could not 'DEPLOY' contract: %v\n", err)
	}
	return result
}

func TestAccount_MintEth(t *testing.T) {
	accountAddress := "0x386cabdfdf6369d81f583bfcd2a49a9fda7a4bf41ebdfd3309ee0d5c4708e86"
	ethAddress := "0x62230ea046a9a5fbc261ac77d03c8d41e5d442db2284587570ab46455fd2488"
	accountAddressBigInt, _ := big.NewInt(0).SetString(accountAddress, 0)

	MintEth(t, accountAddress)
	res := CallContract(t, types.FunctionCall{
		ContractAddress:    ethAddress,
		EntryPointSelector: "balanceOf",
		Calldata: []string{
			accountAddressBigInt.Text(10),
		},
	})
	if len(res) == 0 || res[0] == "0x0" {
		t.Fatalf("no ETH sent to the account yet: %+v\n", res)
	}
}

func AddInvokeV1Transaction(t *testing.T, accountAddress string) {
	testConfig := beforeEach(t)

	godotenv.Load(fmt.Sprintf(".env.%s", testEnv))
	privateString := os.Getenv("PRIVATE_KEY")
	privateInt, _ := big.NewInt(0).SetString(privateString, 0)

	gw := testConfig.client
	ctx := context.Background()
	nonce, err := gw.Nonce(ctx, accountAddress, "pending")
	if err != nil {
		t.Fatalf("could not get nonce: %v", err)
	}
	maxFee, _ := big.NewInt(0).SetString("0x6000000000001", 0)
	MaxFee := &types.Felt{Int: maxFee}

	accountAddressInt, _ := big.NewInt(0).SetString(accountAddress, 0)
	dappAddress, _ := big.NewInt(0).SetString("0x77fb20172a7691c763a38fb8dc5e5ac9ef989ae0fe15befa9cfe5afeb7efbde", 0)

	calldataString := []string{
		"1",
		dappAddress.Text(10), // contract
		caigo.GetSelectorFromName("mint").Text(10), // mint
		"0",                        // offset
		"3",                        // # parameter
		"3",                        // Total parameters
		accountAddressInt.Text(10), // call
		"1",
		"0",
	}
	calldata := []*big.Int{}
	for _, v := range calldataString {
		vInt, _ := big.NewInt(0).SetString(v, 0)
		calldata = append(calldata, vInt)
	}
	cdHash, err := caigo.Curve.ComputeHashOnElements(calldata)
	if err != nil {
		t.Fatalf("could not get calldata hash: %v", err)
	}
	multiHashData := []*big.Int{
		caigo.UTF8StrToBig(caigo.TRANSACTION_PREFIX),
		big.NewInt(1),
		accountAddressInt,
		big.NewInt(0),
		cdHash,
		MaxFee.Int,
		caigo.UTF8StrToBig(gw.ChainId),
		nonce,
	}
	fmt.Println(gw.ChainId)
	txHash, err := caigo.Curve.ComputeHashOnElements(multiHashData)
	fmt.Printf("tx 0x%s\n", txHash.Text(16))
	if err != nil {
		t.Fatalf("could not get signature: %v", err)
	}
	r, s, _ := caigo.Curve.Sign(txHash, privateInt)

	res, err := gw.Invoke(ctx, types.FunctionInvoke{
		FunctionCall: types.FunctionCall{
			ContractAddress: accountAddress,
			Calldata:        calldataString,
		},
		Signature: []*types.Felt{{Int: r}, {Int: s}},
		MaxFee:    MaxFee,
		Version:   1,
		Nonce:     &types.Felt{Int: nonce},
	})
	if err != nil {
		t.Fatalf("could not get Nonce for contract: %v", err)
	}
	if nonce == nil {
		t.Fatalf("could not get Nonce for contract: 0x%s", nonce.Text(16))
	}
	fmt.Printf("%+v\n", res)
}

func TestAccount_addInvokeTransaction(t *testing.T) {
	accountAddress := "0x386cabdfdf6369d81f583bfcd2a49a9fda7a4bf41ebdfd3309ee0d5c4708e86"
	AddInvokeV1Transaction(t, accountAddress)
}
