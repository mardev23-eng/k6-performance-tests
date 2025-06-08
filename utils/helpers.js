import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
export const errorRate = new Rate('custom_error_rate');
export const pageLoadTime = new Trend('page_load_time');
export const apiResponseTime = new Trend('api_response_time');
export const userJourneyCounter = new Counter('user_journey_completed');

// Common check functions
export function checkResponse(response, expectedStatus = 200, description = 'Response check') {
  const result = check(response, {
    [`${description} - Status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    [`${description} - Response time < 2s`]: (r) => r.timings.duration < 2000,
    [`${description} - Has content`]: (r) => r.body && r.body.length > 0,
  });
  
  errorRate.add(!result);
  return result;
}

// Simulate realistic user behavior
export function randomSleep(min = 1, max = 3) {
  sleep(Math.random() * (max - min) + min);
}

// Generate random user data
export function generateUserData() {
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
  const companies = ['TechCorp', 'DataSystems', 'QualityFirst', 'TestingPro', 'AutomationInc'];
  const subjects = ['Job Opportunity', 'Project Inquiry', 'Consultation', 'Collaboration'];
  
  return {
    name: names[Math.floor(Math.random() * names.length)],
    email: `test${Math.floor(Math.random() * 10000)}@example.com`,
    company: companies[Math.floor(Math.random() * companies.length)],
    subject: subjects[Math.floor(Math.random() * subjects.length)],
    message: `This is a test message generated during performance testing. Random ID: ${Math.random().toString(36).substring(7)}`
  };
}

// Performance monitoring utilities
export function measurePageLoad(response) {
  if (response.status === 200) {
    pageLoadTime.add(response.timings.duration);
  }
}

export function measureApiCall(response) {
  if (response.status >= 200 && response.status < 300) {
    apiResponseTime.add(response.timings.duration);
  }
}

// User journey tracking
export function completeUserJourney(journeyName) {
  userJourneyCounter.add(1, { journey: journeyName });
}

// Wait for page elements (simulate real user behavior)
export function waitForPageLoad() {
  sleep(Math.random() * 2 + 1); // 1-3 seconds
}

// Simulate form filling delays
export function simulateFormFilling() {
  sleep(Math.random() * 5 + 3); // 3-8 seconds
}

// Browser simulation headers
export const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};