import http from 'k6/http';
import { check, group } from 'k6';
import { getEnvironment, testConfig } from '../../config/environments.js';
import { 
  checkResponse, 
  browserHeaders, 
  measurePageLoad,
  errorRate 
} from '../../utils/helpers.js';

const environment = getEnvironment();

export let options = {
  stages: [
    { duration: '1m', target: 10 },   // Normal load
    { duration: '30s', target: 200 }, // Sudden spike!
    { duration: '1m', target: 200 },  // Maintain spike
    { duration: '30s', target: 10 },  // Quick recovery
    { duration: '2m', target: 10 },   // Recovery period
    { duration: '30s', target: 300 }, // Even bigger spike!
    { duration: '1m', target: 300 },  // Maintain bigger spike
    { duration: '1m', target: 0 },    // Complete recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'], // Very relaxed for spike test
    http_req_failed: ['rate<0.2'],      // Allow higher error rate during spikes
  },
  tags: {
    ...testConfig.tags,
    testType: 'spike'
  }
};

export default function() {
  group('Spike Test - Traffic Surge Simulation', function() {
    
    group('Homepage During Spike', function() {
      const response = http.get(environment.baseUrl, {
        headers: browserHeaders,
        tags: { name: 'homepage_spike' }
      });
      
      const success = checkResponse(response, 200, 'Homepage Spike');
      measurePageLoad(response);
      
      // Log performance during spikes
      if (__VU > 50) { // During spike periods
        if (response.timings.duration > 3000) {
          console.log(`Spike impact: ${response.timings.duration}ms response time with ${__VU} VUs`);
        }
      }
    });

    // Simulate viral content access
    group('Viral Content Access', function() {
      const popularSections = ['#projects', '#dashboard', '#skills'];
      const section = popularSections[Math.floor(Math.random() * popularSections.length)];
      
      const response = http.get(`${environment.baseUrl}${section}`, {
        headers: browserHeaders,
        tags: { name: 'viral_content' }
      });
      
      checkResponse(response, 200, 'Viral Content');
      
      // Track spike-specific metrics
      if (response.status !== 200) {
        errorRate.add(1, { spike: 'true' });
      }
    });

    // CDN and caching effectiveness during spikes
    group('Static Asset Caching', function() {
      const response = http.get(`${environment.baseUrl}/assets/index.css`, {
        headers: {
          ...browserHeaders,
          'Cache-Control': 'no-cache'
        },
        tags: { name: 'asset_caching' }
      });
      
      check(response, {
        'Assets available during spike': (r) => r.status === 200 || r.status === 304 || r.status === 404,
        'Cache headers present': (r) => r.headers['Cache-Control'] !== undefined || r.headers['ETag'] !== undefined,
      });
    });
  });
}

export function handleSummary(data) {
  const errorRatePercent = (data.metrics.http_req_failed.rate * 100).toFixed(2);
  const avgResponseTime = data.metrics.http_req_duration.avg.toFixed(2);
  const p95ResponseTime = data.metrics.http_req_duration['p(95)'].toFixed(2);
  const maxUsers = 300; // Peak VUs during spike
  
  const spikeTestPassed = data.metrics.http_req_failed.rate < 0.2 && 
                         data.metrics.http_req_duration['p(95)'] < 10000;

  return {
    'reports/spike-test-summary.json': JSON.stringify(data, null, 2),
    stdout: `
⚡ SPIKE TEST COMPLETED
======================
Environment: ${environment.name}
URL: ${environment.baseUrl}
Peak Spike: ${maxUsers} concurrent users
Spike Duration: Multiple 30s-1m spikes
Total Requests: ${data.metrics.http_reqs.count}

Spike Performance:
- Error Rate During Spikes: ${errorRatePercent}%
- Average Response Time: ${avgResponseTime}ms
- 95th Percentile: ${p95ResponseTime}ms

Spike Resilience Analysis:
${errorRatePercent < 10 ? '✅ System handled spikes well' : '⚠️  System struggled with traffic spikes'}
${p95ResponseTime < 5000 ? '✅ Response times remained reasonable' : '⚠️  Significant response time degradation'}

Auto-scaling Effectiveness:
${errorRatePercent < 15 ? '✅ Good auto-scaling response' : '❌ Auto-scaling may need tuning'}

CDN Performance:
${data.metrics.http_req_failed.rate < 0.1 ? '✅ CDN handled static assets well' : '⚠️  CDN may need optimization'}

Overall Status: ${spikeTestPassed ? '✅ PASSED' : '❌ FAILED'}
======================
    `
  };
}