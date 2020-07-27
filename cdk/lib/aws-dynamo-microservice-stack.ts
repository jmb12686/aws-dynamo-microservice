import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";

export class AwsDynamoMicroserviceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create a dynamoDB table.
    const table = new Table(this, "items", {
      partitionKey: {
        name: "itemId",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      
      tableName: "items",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    // table.addGlobalSecondaryIndex(props)
    // table.addLocalSecondaryIndex(props)

    //create a python microservice in lambda.
  }
}
