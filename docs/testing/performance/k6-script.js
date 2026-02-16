import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Custom Metrics
const loginTrend = new Trend('login_duration');
const getPropertiesTrend = new Trend('get_properties_duration');
const createContractTrend = new Trend('create_contract_duration');
const errorRate = new Rate('error_rate');

// Environment Variables (can be set via -e flag)
const BASE_URL = __ENV.BASE_URL || 'https://staging-api.munsiq.sa/v1';
const USER_EMAIL = __ENV.USER_EMAIL || 'testuser@example.com';
const USER_PASSWORD = __ENV.USER_PASSWORD || 'password';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp-up to 100 virtual users over 2 minutes
    { duration: '10m', target: 100 }, // Stay at 100 VUs for 10 minutes
    { duration: '2m', target: 0 },   // Ramp-down to 0 VUs
  ],
  thresholds: {
    'http_req_duration': ['p(95)<300', 'p(99)<500'], // P95 < 300ms, P99 < 500ms
    'error_rate': ['rate<0.01'], // Error rate < 1%
  },
};

// Setup function: runs once before the test, used for login
export function setup() {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({ email: USER_EMAIL, password: USER_PASSWORD }), { headers: { 'Content-Type': 'application/json' } });
  check(loginRes, { 'login successful': (r) => r.status === 200 });
  const authToken = loginRes.json('accessToken');
  return { authToken };
}

// Default function: main test logic, runs in a loop for each VU
export default function (data) {
  const authToken = data.authToken;
  const params = {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  };

  group('Property Flow', function () {
    const res = http.get(`${BASE_URL}/properties`, params);
    const checkRes = check(res, { 'get properties is 200': (r) => r.status === 200 });
    errorRate.add(!checkRes);
    getPropertiesTrend.add(res.timings.duration);
    sleep(1);
  });

  group('Contract Flow', function () {
    // In a real test, you would need dynamic data for creating contracts
    const payload = JSON.stringify({
        property_id: 'uuid-for-a-property',
        unit_id: 'uuid-for-a-unit',
        tenant_id: 'uuid-for-a-tenant',
        start_date: '2026-05-01',
        end_date: '2027-04-30',
        annual_rent: 50000
    });
    const res = http.post(`${BASE_URL}/contracts`, payload, params);
    const checkRes = check(res, { 'create contract is 201': (r) => r.status === 201 });
    errorRate.add(!checkRes);
    createContractTrend.add(res.timings.duration);
    sleep(2);
  });

  sleep(1);
}
