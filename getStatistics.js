const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.run = async (event) => {
  const params = {
    TableName: "shortUrls",
    IndexName: "ShortCodeIndex",
    KeyConditionExpression: 'shortCode = :shortcode',
    ExpressionAttributeValues: {
      ':shortcode': event.pathParameters.shortCode,
    }
  };

  const result = await dynamoDB.query(params).promise();
  if (result.Items.length > 0) {
    const response = {
      visits: result.Items[0].visits
    }
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "invalid shortCode url" })
    };
  }
}