import * as cdk from "@aws-cdk/core";
import { Table, AttributeType, BillingMode, TableEncryption } from "@aws-cdk/aws-dynamodb";
import { Function, AssetCode, Runtime } from "@aws-cdk/aws-lambda";
import { RestApi, LambdaIntegration, PassthroughBehavior, MockIntegration, IResource } from "@aws-cdk/aws-apigateway";
// import apigateway = require('@aws-cdk/aws-apigateway'); 
// import dynamodb = require('@aws-cdk/aws-dynamodb');

export class AwsDynamoMicroserviceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create a dynamoDB table.
    const table = new Table(this, "customerOrders", {
      partitionKey: {
        name: "customerId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "orderId",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      tableName: "customerOrders",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    // Create a "sparse" index https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes-general-sparse-indexes.html
    table.addGlobalSecondaryIndex({
      indexName: "openOrders",
      partitionKey: {
        name: "customerId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "isOpen",
        type: AttributeType.STRING,
      },
    });

    new cdk.CfnOutput(this, "openOrdersTableARN", {
      value: table.tableArn,
      exportName: "openOrdersTableARN"
    });

    const createOrder = new Function(this, 'createOrderFunction', {
      code: new AssetCode("app/src"),
      handler: 'createOrder.handler',
      runtime: Runtime.NODEJS_12_X,
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    table.grantReadWriteData(createOrder);


    const api = new RestApi(this, 'OrdersAPI', {
      restApiName: 'Order Service'
    });
   
    const orders = api.root.addResource('orders');

    const createOrderIntegration = new LambdaIntegration(createOrder);
    orders.addMethod('POST', createOrderIntegration);
    addCorsOptions(orders)



  }
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },  
    }]
  })
}  
