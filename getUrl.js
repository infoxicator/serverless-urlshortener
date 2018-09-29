const AWS = require('aws-sdk'); // eslint-disable-line import/no-unresolved

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const { URLS_TABLE } = process.env;

module.exports.run = async (event) => {
  const params = {
    TableName: URLS_TABLE,
    IndexName: 'ShortCodeIndex',
    KeyConditionExpression: 'shortCode = :shortcode',
    ExpressionAttributeValues: {
      ':shortcode': event.pathParameters.shortCode,
    },
  };
  try {
    const result = await dynamoDB.query(params).promise();
    if (result.Items.length > 0) {
      result.Items[0].visits += 1;
      const updatedItem = {
        TableName: URLS_TABLE,
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
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
