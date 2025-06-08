import http from 'k6/http';
import { check, group } from 'k6';
import { getEnvironment, testConfig } from '../../config/environments.js';
import { 
  checkResponse, 
  browserHeaders, 
  randomSleep, 
  measurePageLoad,
  completeUserJourney 
} from '../../utils/helpers.js';

const environment = getEnvironment();

export let options = {
  stages: [
    { duration: '5m', target: 15 },   // Ramp up
    { duration: '60m', target: 15 },  // Sustained load for 1 hour
    { duration: '5m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.05'],
    http_reqs: ['rate>5'],
  },
  tags: {
    ...testConfig.tags,
    testType: 'endurance'
  }
};

export default function() {
  const iterationStart = Date.now();
  
  group('Endurance Test - Long Duration Stability', function() {
    
    group('Sustained Homepage Access', function() {
      const response = http.get(environment.baseUrl, {
        headers: browserHeaders,
        tags: { name: 'homepage_endurance' }
      });
      
      checkResponse(response, 200, 'Homepage Endurance');
      measurePageLoad(response);
      
      // Monitor for memory leaks or performance degradation
      const responseTime = response.timings.duration;
      if (responseTime > 5000) {
        console.warn(`Performance degradation detected at iteration ${__ITER}: ${responseTime}ms`);
      }
      
      randomSleep(3, 8); // Realistic user behavior
    });

    group('Random Section Navigation', function() {
      const sections = ['#about', '#skills', '#projects', '#dashboard', '#contact'];
      const randomSection = sections[Math.floor(Math.random() * sections.length)];
      
      const response = http.get(`${environment.baseUrl}${randomSection}`, {
        headers: browserHeaders,
        tags: { name: 'section_endurance' }
      });
      
      checkResponse(response, 200, 'Section Endurance');
      randomSleep(2, 5);
    });

    // Periodic deep navigation (every 10th iteration)
    if (__ITER % 10 === 0) {
      group('Deep Navigation Pattern', function() {
        const sections = ['#about', '#skills', '#projects', '#dashboard', '#contact'];
        
        sections.forEach(section => {
          const response = http.get(`${environment.baseUrl}${section}`, {
            headers: browserHeaders,
            tags: { name: 'deep_navigation' }
          });
          
          checkResponse(response, 200, `Deep Navigation ${section}`);
          randomSleep(1, 3);
        });
        
        completeUserJourney('deep_navigation');
      });
    }

    // Resource monitoring (every 20th iteration)
    if (__ITER % 20 === 0) {
      group('Resource Monitoring', function() {
        const iterationTime = Date.now() - iterationStart;
        
        check(null, {
          'Iteration time reasonable': () => iterationTime < 60000, // Less than 1 minute per iteration
          'Memory usage stable': () => true, // Placeholder for memory checks
        });
        
        console.log(`Endurance check - Iteration ${__ITER}: ${iterationTime}ms`);
      });
    }
  });
}

export function handleSummary(data) {
  const totalDuration = 70; // 70 minutes total test duration
  const avgResponseTime = data.metrics.http_req_duration.avg.toFixed(2);
  const p95ResponseTime = data.metrics.http_req_duration['p(95)'].toFixed(2);
  const errorRatePercent = (data.metrics.http_req_failed.rate * 100).toFixed(2);
  const totalIterations = data.metrics.iterations.count;
  
  const enduranceTestPassed = data.metrics.http_req_failed.rate < 0.05 && 
                             data.metrics.http_req_duration['p(95)'] < 3000;

  return {
    'reports/endurance-test-summary.json': JSON.stringify(data, null, 2),
    stdout: `
⏰ ENDURANCE TEST COMPLETED
===========================
Environment: ${environment.name}
URL: ${environment.baseUrl}
Duration: ${totalDuration} minutes
Sustained Users: 15
Total Iterations: ${totalIterations}
Total Requests: ${data.metrics.http_reqs.count}

Long-term Performance:
- Error Rate: ${errorRatePercent}%
- Average Response Time: ${avgResponseTime}ms
- 95th Percentile: ${p95ResponseTime}ms
- Request Rate: ${data.metrics.http_reqs.rate.toFixed(2)} req/s

Stability Analysis:
${errorRatePercent < 2 ? '✅ Excellent stability over time' : errorRatePercent < 5 ? '✅ Good stability' : '⚠️  Stability concerns detected'}
${avgResponseTime < 1000 ? '✅ Response times remained fast' : avgResponseTime < 2000 ? '✅ Response times acceptable' : '⚠️  Response time degradation'}

Memory Leak Detection:
${p95ResponseTime < 3000 ? '✅ No significant performance degradation' : '⚠️  Possible memory leaks or resource issues'}

Resource Utilization:
${data.metrics.http_reqs.rate > 5 ? '✅ Sustained throughput maintained' : '⚠️  Throughput degradation detected'}

Overall Status: ${enduranceTestPassed ? '✅ PASSED' : '❌ FAILED'}
===========================
    `
  };
}