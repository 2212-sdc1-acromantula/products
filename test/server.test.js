const request = require('supertest');
const { app, db } = require('../server');
var mongoose = require('mongoose');

describe('GET Product', () => {
  it('returns a status of 200', async () => {
    const response = await request(app).get('/products/1');
    expect(response.status).toBe(200);
  });

  it('returns an object', async () => {
    const response = await request(app).get('/products/1');
    expect(typeof response.body).toBe('object');
  });

  it('returns an object with the correct info', async () => {
    const response = await request(app).get('/products/1');
    expect(response.body).toMatchObject([
      {
        _id: '63f12eaf1615949e84ad0ed1',
        id: 1,
        name: 'Camo Onesie',
        slogan: 'Blend in to your crowd',
        description:
          'The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.',
        category: 'Jackets',
        default_price: '140',
        related_products: [2, 3, 8, 7],
        features: [
          {
            feature: 'Fabric',
            value: 'Canvas',
            _id: '63f136a71615949e84dad5b1',
          },
          {
            feature: 'Buttons',
            value: 'Brass',
            _id: '63f136a71615949e84dad5b3',
          },
        ],
        __v: 0,
      },
    ]);
  });
});

describe('GET Products', () => {
  it('returns a status of 200', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
  });

  it('returns an array with ten elements', async () => {
    const response = await request(app).get('/products');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(10);
  });

  it('returns the correct number of products if count is a paramter', async () => {
    const response = await request(app).get('/products?count=5');
    expect(response.body.length).toBe(5);
  });

  it('returns the correct products if page is a paramter', async () => {
    const response = await request(app).get('/products?page=2');
    expect(response.body[0].id).toBe(11);
  });
});

describe('GET Related Products', () => {
  // afterAll((done) => {
  //   app.db.close();
  //   app.close();
  // });

  it('returns a status of 200', async () => {
    const response = await request(app).get('/products/1/related');
    expect(response.status).toBe(200);
  });

  it('returns an array of products', async () => {
    const response = await request(app).get('/products/1/related');
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('returns the correct array of products', async () => {
    const response = await request(app).get('/products/1/related');
    expect(response.body).toEqual([2, 3, 8, 7]);
  });
});

describe('GET Product Styles', () => {
  it('returns a status of 200', async () => {
    const response = await request(app).get('/products/1/styles');
    expect(response.status).toBe(200);
  });

  it('returns the correct product', async () => {
    const response = await request(app).get('/products/1/styles');
    expect(response.body[0].product_id).toEqual(1);
  });

  it('returns a results array with the correct number of styles', async () => {
    const response = await request(app).get('/products/1/styles');
    expect(Array.isArray(response.body[0]['results'])).toBe(true);
    expect(response.body[0].results.length).toEqual(6);
  });
});
