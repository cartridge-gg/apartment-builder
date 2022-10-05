package main

import (
	"context"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(handleRequest)
}

// handleRequest handles the request and returns OK
func handleRequest(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	return events.APIGatewayV2HTTPResponse{
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       "{\"message\": \"you've reached the apartment builder\"}",
		StatusCode: http.StatusOK,
	}, nil
}
