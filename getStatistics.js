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
      const response = {
        visits: result.Items[0].visits,
      };
      return {
        statusCode: 200,
        body: JSON.stringify(response),
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
