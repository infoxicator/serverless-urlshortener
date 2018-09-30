const UrlFactory = require('./lib/UrlFactory');

module.exports.run = async (event) => {
  const urlFactory = new UrlFactory();
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
