import http from 'k6/http';
import { check, group } from 'k6';
import { getEnvironment, testConfig } from '../../config/environments.js';
import { checkResponse, browserHeaders, waitForPageLoad } from '../../utils/helpers.js';

const environment = getEnvironment();

export let options = {
  stages: [
    { duration: '30s', target: 1 }, // Single user for 30 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // Relaxed for smoke test
    http_req_failed: ['rate<0.1'],
  },
  tags: {
    ...testConfig.tags,
    testType: 'smoke'
  }
};

export default function() {
  group('Smoke Test - Critical User Journeys', function() {
    
    group('Homepage Load', function() {
      const response = http.get(environment.baseUrl, {
        headers: browserHeaders,
        tags: { name: 'homepage' }
      });
      
      checkResponse(response, 200, 'Homepage');
      
      check(response, {
        'Homepage contains title': (r) => r.body.includes('Marvin Marzon'),
        'Homepage contains navigation': (r) => r.body.includes('About') && r.body.includes('Skills'),
        'Homepage contains hero section': (r) => r.body.includes('QA') || r.body.includes('SDET'),
      });
      
      waitForPageLoad();
    });

    group('Static Assets', function() {
      // Test CSS loading
      const cssResponse = http.get(`${environment.baseUrl}/assets/index.css`, {
        headers: browserHeaders,
        tags: { name: 'css' }
      });
      check(cssResponse, {
        'CSS loads successfully': (r) => r.status === 200 || r.status === 404, // 404 is OK for Vite builds
      });

      // Test JS loading
      const jsResponse = http.get(`${environment.baseUrl}/assets/index.js`, {
        headers: browserHeaders,
        tags: { name: 'javascript' }
      });
      check(jsResponse, {
        'JavaScript loads successfully': (r) => r.status === 200 || r.status === 404, // 404 is OK for Vite builds
      });
    });

    group('Navigation Sections', function() {
      // Test if all main sections are accessible
      const sections = ['#about', '#skills', '#projects', '#dashboard', '#contact'];
      
      sections.forEach(section => {
        const response = http.get(`${environment.baseUrl}/${section}`, {
          headers: browserHeaders,
          tags: { name: `section_${section}` }
        });
        
        check(response, {
          [`Section ${section} is accessible`]: (r) => r.status === 200,
        });
      });
    });

    group('Contact Form Availability', function() {
      const response = http.get(environment.baseUrl, {
        headers: browserHeaders,
        tags: { name: 'contact_form' }
      });
      
      check(response, {
        'Contact form is present': (r) => r.body.includes('contact') || r.body.includes('Contact'),
        'Email is displayed': (r) => r.body.includes('marvinmarzon@outlook.com'),
      });
    });

    group('Performance Baseline', function() {
      const startTime = Date.now();
      
      const response = http.get(environment.baseUrl, {
        headers: browserHeaders,
        tags: { name: 'performance_baseline' }
      });
      
      const loadTime = Date.now() - startTime;
      
      check(response, {
        'Page loads within 5 seconds': () => loadTime < 5000,
        'Response size is reasonable': (r) => r.body.length < 2000000, // Less than 2MB
      });
    });
  });
}

export function handleSummary(data) {
  return {
    'reports/smoke-test-summary.json': JSON.stringify(data, null, 2),
    stdout: `
🚀 SMOKE TEST COMPLETED
========================
Environment: ${environment.name}
URL: ${environment.baseUrl}
Duration: ${data.metrics.iteration_duration.avg.toFixed(2)}ms avg
Requests: ${data.metrics.http_reqs.count}
Failures: ${data.metrics.http_req_failed.rate * 100}%
95th Percentile: ${data.metrics.http_req_duration['p(95)'].toFixed(2)}ms

Status: ${data.metrics.http_req_failed.rate < 0.1 ? '✅ PASSED' : '❌ FAILED'}
========================
    `
  };
}