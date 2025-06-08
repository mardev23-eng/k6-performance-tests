import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { getEnvironment, testConfig } from '../../config/environments.js';
import { 
  checkResponse, 
  browserHeaders, 
  generateUserData, 
  randomSleep, 
  measurePageLoad,
  completeUserJourney 
} from '../../utils/helpers.js';

const environment = getEnvironment();

export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users over 2 minutes
    { duration: '5m', target: 10 },   // Stay at 10 users for 5 minutes
    { duration: '2m', target: 20 },   // Ramp up to 20 users over 2 minutes
    { duration: '5m', target: 20 },   // Stay at 20 users for 5 minutes
    { duration: '2m', target: 0 },    // Ramp down to 0 users over 2 minutes
  ],
  thresholds: environment.thresholds,
  tags: {
    ...testConfig.tags,
    testType: 'load'
  }
};

export default function() {
  const userData = generateUserData();
  
  group('Load Test - User Journey Simulation', function() {
    
    // Homepage visit
    group('1. Homepage Visit', function() {
      const response = http.get(environment.baseUrl, {
        headers: browserHeaders,
        tags: { name: 'homepage_load' }
      });
      
      checkResponse(response, 200, 'Homepage Load');
      measurePageLoad(response);
      
      randomSleep(2, 4); // User reads homepage content
    });

    // Navigate to About section
    group('2. About Section', function() {
      const response = http.get(`${environment.baseUrl}#about`, {
        headers: browserHeaders,
        tags: { name: 'about_section' }
      });
      
      checkResponse(response, 200, 'About Section');
      randomSleep(3, 6); // User reads about content
    });

    // Navigate to Skills section
    group('3. Skills Section', function() {
      const response = http.get(`${environment.baseUrl}#skills`, {
        headers: browserHeaders,
        tags: { name: 'skills_section' }
      });
      
      checkResponse(response, 200, 'Skills Section');
      randomSleep(2, 5); // User reviews skills
    });

    // Navigate to Projects section
    group('4. Projects Portfolio', function() {
      const response = http.get(`${environment.baseUrl}#projects`, {
        headers: browserHeaders,
        tags: { name: 'projects_section' }
      });
      
      checkResponse(response, 200, 'Projects Section');
      randomSleep(4, 8); // User explores projects
    });

    // Navigate to Dashboard section
    group('5. Testing Dashboard', function() {
      const response = http.get(`${environment.baseUrl}#dashboard`, {
        headers: browserHeaders,
        tags: { name: 'dashboard_section' }
      });
      
      checkResponse(response, 200, 'Dashboard Section');
      randomSleep(3, 6); // User views metrics
    });

    // Contact form interaction (50% of users)
    if (Math.random() < 0.5) {
      group('6. Contact Form Interaction', function() {
        // Visit contact section
        const contactResponse = http.get(`${environment.baseUrl}#contact`, {
          headers: browserHeaders,
          tags: { name: 'contact_section' }
        });
        
        checkResponse(contactResponse, 200, 'Contact Section');
        randomSleep(2, 4); // User reads contact info
        
        // Simulate form filling (without actual submission in load test)
        sleep(Math.random() * 10 + 5); // 5-15 seconds to fill form
        
        completeUserJourney('contact_interaction');
      });
    }

    // Resume/CV download simulation (30% of users)
    if (Math.random() < 0.3) {
      group('7. Resume Download', function() {
        // Simulate clicking resume link
        randomSleep(1, 2);
        completeUserJourney('resume_download');
      });
    }

    completeUserJourney('full_site_visit');
  });
}

export function handleSummary(data) {
  const passedThresholds = Object.keys(data.thresholds).every(
    threshold => data.thresholds[threshold].ok
  );

  return {
    'reports/load-test-summary.json': JSON.stringify(data, null, 2),
    stdout: `
🔥 LOAD TEST COMPLETED
======================
Environment: ${environment.name}
URL: ${environment.baseUrl}
Virtual Users: 20 (peak)
Duration: 16 minutes
Total Requests: ${data.metrics.http_reqs.count}
Request Rate: ${data.metrics.http_reqs.rate.toFixed(2)} req/s
Failed Requests: ${(data.metrics.http_req_failed.rate * 100).toFixed(2)}%

Performance Metrics:
- Average Response Time: ${data.metrics.http_req_duration.avg.toFixed(2)}ms
- 95th Percentile: ${data.metrics.http_req_duration['p(95)'].toFixed(2)}ms
- 99th Percentile: ${data.metrics.http_req_duration['p(99)'].toFixed(2)}ms

User Journeys Completed: ${data.metrics.user_journey_completed?.count || 0}

Status: ${passedThresholds ? '✅ PASSED' : '❌ FAILED'}
======================
    `
  };
}