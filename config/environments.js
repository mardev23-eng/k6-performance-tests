// Environment configurations for different testing stages
export const environments = {
  production: {
    baseUrl: 'https://marvinmarzon.netlify.app',
    name: 'Production',
    thresholds: {
      http_req_duration: ['p(95)<2000'],
      http_req_failed: ['rate<0.01'],
      http_reqs: ['rate>50']
    }
  },
  staging: {
    baseUrl: 'https://staging-marvinmarzon.netlify.app',
    name: 'Staging',
    thresholds: {
      http_req_duration: ['p(95)<3000'],
      http_req_failed: ['rate<0.05'],
      http_reqs: ['rate>30']
    }
  },
  development: {
    baseUrl: 'http://localhost:5173',
    name: 'Development',
    thresholds: {
      http_req_duration: ['p(95)<1000'],
      http_req_failed: ['rate<0.1'],
      http_reqs: ['rate>10']
    }
  }
};

// Get environment configuration
export function getEnvironment() {
  const env = __ENV.ENVIRONMENT || 'production';
  return environments[env] || environments.production;
}

// Common test configuration
export const testConfig = {
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
  summaryTimeUnit: 'ms',
  noConnectionReuse: false,
  userAgent: 'K6-Performance-Test/1.0 (Enterprise QA Suite)',
  timeout: '30s',
  tags: {
    testType: 'performance',
    application: 'portfolio',
    tester: 'marvin-marzon'
  }
};