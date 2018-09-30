const uuid = require('uuid/v4');
const ShortUID = require('short-uid');
const dynamoDB = require('serverless-dynamodb-client');

const shortUID = new ShortUID();
const { URLS_TABLE } = process.env;

class UrlFactory {
  constructor() {
    this.db = dynamoDB.doc;
  }

  async createUrl(url) {
    const params = {
      TableName: URLS_TABLE,
      Item: {
        id: uuid(),
        url,
        shortCode: shortUID.randomUUID(7),
        visits: 0,
      },
    };
    await this.db.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  }

  async getUrl(shortCode) {
    const params = {
      TableName: URLS_TABLE,
      IndexName: 'ShortCodeIndex',
      KeyConditionExpression: 'shortCode = :shortcode',
      ExpressionAttributeValues: {
        ':shortcode': shortCode,
      },
    };

    const result = await this.db.query(params).promise();
    if (result.Items.length > 0) {
      result.Items[0].visits += 1;
      const updatedItem = {
        TableName: URLS_TABLE,
        Item: result.Items[0],
      };
      await this.db.put(updatedItem).promise();
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
  }

  async getStatistics(shortCode) {
    const params = {
      TableName: URLS_TABLE,
      IndexName: 'ShortCodeIndex',
      KeyConditionExpression: 'shortCode = :shortcode',
      ExpressionAttributeValues: {
        ':shortcode': shortCode,
      },
    };
    const result = await this.db.query(params).promise();
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
  }
}

module.exports = UrlFactory;
