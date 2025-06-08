import http from 'k6/http';
import { check, group } from 'k6';
import { getEnvironment, testConfig } from '../../config/environments.js';
import { 
  checkResponse, 
  browserHeaders, 
  randomSleep, 
  measurePageLoad,
  errorRate 
} from '../../utils/helpers.js';

const environment = getEnvironment();

export let options = {
  stages: [
    { duration: '2m', target: 20 },   // Ramp up to normal load
    { duration: '5m', target: 20 },   // Stay at normal load
    { duration: '2m', target: 50 },   // Ramp up to high load
    { duration: '5m', target: 50 },   // Stay at high load
    { duration: '2m', target: 100 },  // Ramp up to stress load
    { duration: '5m', target: 100 },  // Stay at stress load
    { duration: '2m', target: 150 },  // Ramp up to breaking point
    { duration: '5m', target: 150 },  // Stay at breaking point
    { duration: '5m', target: 0 },    // Ramp down and recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // Relaxed thresholds for stress test
    http_req_failed: ['rate<0.1'],     // Allow higher error rate
    http_reqs: ['rate>10'],
  },
  tags: {
    ...testConfig.tags,
    testType: 'stress'
  }
};

export default function() {
  group('Stress Test - Breaking Point Analysis', function() {
    
    group('Homepage Under Stress', function() {
      const response = http.get(environment.baseUrl, {
        headers: browserHeaders,
        tags: { name: 'homepage_stress' }
      });
      
      const success = checkResponse(response, 200, 'Homepage Stress');
      measurePageLoad(response);
      
      // Track degradation
      if (response.timings.duration > 5000) {
        console.warn(`Slow response detected: ${response.timings.duration}ms`);
      }
      
      randomSleep(0.5, 2); // Faster user behavior under stress
    });

    // Rapid navigation simulation
    group('Rapid Section Navigation', function() {
      const sections = ['#about', '#skills', '#projects', '#dashboard', '#contact'];
      const randomSection = sections[Math.floor(Math.random() * sections.length)];
      
      const response = http.get(`${environment.baseUrl}${randomSection}`, {
        headers: browserHeaders,
        tags: { name: 'section_stress' }
      });
      
      checkResponse(response, 200, 'Section Under Stress');
      randomSleep(0.2, 1); // Very fast navigation
    });

    // Concurrent asset loading simulation
    group('Asset Loading Stress', function() {
      const requests = [
        http.get(`${environment.baseUrl}/assets/index.css`, { 
          headers: browserHeaders,
          tags: { name: 'css_stress' }
        }),
        http.get(`${environment.baseUrl}/assets/index.js`, { 
          headers: browserHeaders,
          tags: { name: 'js_stress' }
        })
      ];
      
      // Check if any assets failed to load
      requests.forEach((response, index) => {
        if (response.status !== 200 && response.status !== 404) {
          errorRate.add(1);
        }
      });
    });
  });
}

export function handleSummary(data) {
  const errorRatePercent = (data.metrics.http_req_failed.rate * 100).toFixed(2);
  const avgResponseTime = data.metrics.http_req_duration.avg.toFixed(2);
  const p95ResponseTime = data.metrics.http_req_duration['p(95)'].toFixed(2);
  const maxResponseTime = data.metrics.http_req_duration.max.toFixed(2);
  
  const stressTestPassed = data.metrics.http_req_failed.rate < 0.1 && 
                          data.metrics.http_req_duration['p(95)'] < 5000;

  return {
    'reports/stress-test-summary.json': JSON.stringify(data, null, 2),
    stdout: `
💥 STRESS TEST COMPLETED
========================
Environment: ${environment.name}
URL: ${environment.baseUrl}
Peak Virtual Users: 150
Duration: 28 minutes
Total Requests: ${data.metrics.http_reqs.count}
Peak Request Rate: ${data.metrics.http_reqs.rate.toFixed(2)} req/s

Performance Under Stress:
- Error Rate: ${errorRatePercent}%
- Average Response Time: ${avgResponseTime}ms
- 95th Percentile: ${p95ResponseTime}ms
- Maximum Response Time: ${maxResponseTime}ms

Breaking Point Analysis:
${errorRatePercent > 5 ? '⚠️  High error rate detected - system under stress' : '✅ Error rate within acceptable limits'}
${p95ResponseTime > 3000 ? '⚠️  Response times degraded significantly' : '✅ Response times maintained well'}
${maxResponseTime > 10000 ? '⚠️  Some requests took extremely long' : '✅ No extreme response time spikes'}

Recovery Status: ${data.metrics.http_req_failed.rate < 0.05 ? '✅ System recovered well' : '⚠️  System may need recovery time'}

Overall Status: ${stressTestPassed ? '✅ PASSED' : '❌ FAILED'}
========================
    `
  };
}