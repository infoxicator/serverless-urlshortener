const UrlFactory = require('./lib/UrlFactory');

module.exports.run = async (event) => {
  const urlFactory = new UrlFactory();
  const { shortCode } = event.pathParameters;
  try {
    const response = await urlFactory.getStatistics(shortCode);
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
