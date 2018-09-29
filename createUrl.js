const AWS = require('aws-sdk'); // eslint-disable-line import/no-unresolved
const uuid = require('uuid/v4');
const ShortUID = require('short-uid');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const shortUID = new ShortUID();
const { URLS_TABLE } = process.env;

module.exports.run = async (event) => {
  const data = JSON.parse(event.body);
  const { url } = data;
  const params = {
    TableName: URLS_TABLE,
    Item: {
      id: uuid(),
      url,
      shortCode: shortUID.randomUUID(7),
      visits: 0,
    },
  };
  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
