const uuid = require('uuid/v4');
const shortId = require('shortid');

class UrlFactory {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  async createUrl(url) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: uuid(),
        url,
        shortCode: shortId.generate(),
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
      TableName: this.tableName,
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
        TableName: this.tableName,
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
      TableName: this.tableName,
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
