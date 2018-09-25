const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.run = async (event) => {
  const params = {
    TableName: 'shortUrls',
    IndexName: 'ShortCodeIndex',
    KeyConditionExpression: 'shortCode = :shortcode',
    ExpressionAttributeValues: {
      ':shortcode': event.pathParameters.shortCode,
    },
  };

  const result = await dynamoDB.query(params).promise();
  if (result.Items.length > 0) {
    result.Items[0].visits = result.Items[0].visits + 1;
    const updatedItem = {
      TableName: 'shortUrls',
      Item: result.Items[0],
    };
    await dynamoDB.put(updatedItem).promise();
    return {
      statusCode: 302,
      headers: {
        Location: result.Items[0].url,
      },
      body: null,
    };
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'invalid shortCode url' }),
  };
};
