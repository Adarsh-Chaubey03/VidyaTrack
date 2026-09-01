import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  const res = http.get(`${BASE_URL}/api/course/all`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}