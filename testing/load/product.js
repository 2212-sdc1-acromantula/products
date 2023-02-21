import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

// test product
export default function testProduct() {
  const productId = Math.floor(Math.random() * 1000000) + 1;
  const res = http.get(`http://localhost:3000/products/${productId}`);
  if (res.status === 404) {
    const errorMsg = `Product ${productId} returned a 404 error`;
    console.error(errorMsg);
  } else {
    check(res, { 'status was 200': (r) => r.status == 200 });
  }
  sleep(1);
}
