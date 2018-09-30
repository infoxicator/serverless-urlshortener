const url = 'http://localhost:3000';
const request = require('supertest')(url);

describe('/url route', () => {
  it('POST /url creates a new url and returns its shortcode and visits', () => {
    const postObj = {
      url: 'http://www.melodyvr.com',
    };

    return request
      .post('/url')
      .send(postObj)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('url', 'http://www.melodyvr.com');
        expect(res.body).toHaveProperty('shortCode');
        expect(res.body).toHaveProperty('visits', 0);
      });
  });

  it('GET /url/{shortCode} returns a url', () => {
    request
      .get('/url/U001')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('/statistics route', () => {
  it('GET /statistics/{shortCode} returns statistics for a shorcode url', () => {
    request
      .get('/statistics/U001')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
