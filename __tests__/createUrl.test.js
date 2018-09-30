const UrlFactory = require('../lib/UrlFactory');

describe('create new url', () => {
  const dbMock = {};
  dbMock.put = jest
    .fn((params, callback) => {
      callback(null, {});
    })
    .mockName('db.put');

  const urlFactory = new UrlFactory(dbMock, 'urls-table-teststage');

  const url = 'www.melodyvr.com';

  it('it calls put once', () => {
    urlFactory.createUrl(url, () => {});

    expect(dbMock.put.mock.calls).toHaveLength(1);
  });

  it('Calls the put method with the correct arguments', () => {
    urlFactory.createUrl(url, () => {});

    expect(dbMock.put.mock.calls[0][0].TableName).toBe('urls-table-teststage');
    expect(dbMock.put.mock.calls[1][0].Item).toHaveProperty('id');
    expect(dbMock.put.mock.calls[1][0].Item).toHaveProperty('url', 'www.melodyvr.com');
    expect(dbMock.put.mock.calls[1][0].Item).toHaveProperty('shortCode');
    expect(dbMock.put.mock.calls[1][0].Item).toHaveProperty('visits', 0);
  });

  it('get a response with status 200', () => {
    urlFactory.createUrl(url, (err, res) => {
      expect(res.statusCode).toBe(200);
    });
  });

  it('Receives the correct object in the body', () => {
    urlFactory.createUrl(url, (err, res) => {
      const parsedBody = JSON.parse(res.body);
      expect(parsedBody).toHaveProperty('id');
      expect(parsedBody).toHaveProperty('url', 'http://www.melodyvr.com');
      expect(parsedBody).toHaveProperty('shortCode');
      expect(parsedBody).toHaveProperty('visits', 0);
    });
  });
});
