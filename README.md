# aws-dynamo-microservice

This is a simple demo microservice API utilizing AWS Lambda, API Gateway, and DynamoDB provisioned via AWS CDK.  The application exposes a RESTful CRUD API backed by a DynamoDB table.

## Build

To build this application run the following:

```bash
npm install -g aws-cdk
npm install
npm run build
```

## Deploy

To deploy this application, use `cdk` and run the following commands:

```bash
cdk bootstrap; #only have to run once, no-op if ran again
cdk deploy
```

After CDK completes the deployment, the API's URL will be printed as output

## Lambda application code

The Lambda application code is under `app/src` and contains:

* `app/src/createOrder` - used to store an order in the DynamoDB table
* `app/src/getOneOrder` - used to get a single order from the DynamoDB table
* `app/src/getAllOrders` - used to get all orders from the DynamoDB table

## API

### Create an order

HTTP POST to `{OrdersAPIEndpoint}/orders` with `customerId` and `orderId` elements in the body as JSON.  Example:

```bash
curl -X POST -d '{"customerId":"JoeUser1234", "orderId":"3", "amount":"12"}' https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod/orders
```

### Get a single order

HTTP GET to `{OrdersAPIEndpoint}/orders/{customerId}/{orderId}`  Example:

```bash
curl -X GET https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod/orders/JoeUser1234/3
```

### Get all orders

HTTP GET to `{OrdersAPIEndpoint}/orders`  Example:

```bash
curl -X GET https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod/orders/
```
