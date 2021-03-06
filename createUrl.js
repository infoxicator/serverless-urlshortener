const dynamoDB = require('serverless-dynamodb-client');
const UrlFactory = require('./lib/UrlFactory');

const { URLS_TABLE } = process.env;

const db = dynamoDB.doc;

module.exports.run = async (event) => {
  const urlFactory = new UrlFactory(db, URLS_TABLE);
  const data = JSON.parse(event.body);
  const { url } = data;

  try {
    const response = await urlFactory.createUrl(url);
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
