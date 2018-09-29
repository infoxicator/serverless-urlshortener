const AWS = require('aws-sdk'); // eslint-disable-line import/no-unresolved
const uuid = require('uuid/v4');
const randomstring = require('randomstring');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { URLS_TABLE } = process.env;

module.exports.run = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: URLS_TABLE,
    Item: {
      id: uuid(),
      url: data.url,
      shortCode: randomstring.generate(7),
      visits: 0,
    },
  };

  await dynamoDB.put(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};
