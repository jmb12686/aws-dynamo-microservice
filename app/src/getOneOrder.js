const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';

exports.handler = async function (event, context) {

  const customerId = event.pathParameters.customerId;
  if (!customerId) {
    return { statusCode: 400, body: `Error: You are missing the path parameter customerId` };
  }

  const orderId = event.pathParameters.orderId;
  if (!orderId) {
    return { statusCode: 400, body: `Error: You are missing the path parameter orderId` };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      customerId: customerId,
      orderId: orderId
    }
  };

  try {
    const response = await db.get(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Item) };
  } catch (dbError) {
    console.error('getAllOrders ERROR: ', dbError);
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};