package contracts

import (
	"flag"
	"fmt"
	"os"
	"testing"

	"github.com/dontpanicdao/caigo/gateway"
	"github.com/joho/godotenv"
)

// testConfiguration is a type that is used to configure tests
type testConfiguration struct {
	client *gateway.Gateway
	base   string
}

var (
	// set the environment for the test, default: devnet
	testEnv = "devnet"

	// testConfigurations are predefined test configurations
	testConfigurations = map[string]testConfiguration{
		"testnet": {
			base: "https://alpha4.starknet.io",
		},
		"devnet": {
			base: "http://localhost:5050",
		},
	}
)

// beforeEach checks the configuration and initializes it before running the script
func beforeEach(t *testing.T) *testConfiguration {
	t.Helper()
	godotenv.Load(fmt.Sprintf(".env.%s", testEnv), ".env")
	testConfig, ok := testConfigurations[testEnv]
	if !ok {
		t.Fatal("env supports testnet and devnet")
	}
	testConfig.client = gateway.NewClient(gateway.WithChain(testEnv))
	t.Cleanup(func() {
	})
	return &testConfig
}

// TestMain is used to trigger the tests and, in that case, check for the environment to use.
func TestMain(m *testing.M) {
	flag.StringVar(&testEnv, "env", "devnet", "set the test environment")
	flag.Parse()
	os.Exit(m.Run())
}
