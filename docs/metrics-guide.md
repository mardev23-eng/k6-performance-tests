# 📊 Performance Metrics Guide

## Overview
This guide explains all performance metrics collected by the K6 Enterprise Performance Testing Suite, their significance, and how to interpret the results for actionable insights.

## Core K6 Metrics

### HTTP Request Metrics

#### `http_req_duration`
**Description**: Total time for HTTP request (sending, waiting, receiving)
**Unit**: Milliseconds (ms)
**Key Percentiles**:
- `avg`: Average response time across all requests
- `p(50)`: Median response time (50th percentile)
- `p(90)`: 90th percentile - 90% of requests faster than this
- `p(95)`: 95th percentile - 95% of requests faster than this  
- `p(99)`: 99th percentile - 99% of requests faster than this
- `max`: Slowest request in the test

**Interpretation**:
```
Excellent: p(95) < 1000ms
Good:      p(95) < 2000ms
Acceptable: p(95) < 3000ms
Poor:      p(95) > 3000ms
```

#### `http_req_failed`
**Description**: Rate of failed HTTP requests
**Unit**: Percentage (0.0 to 1.0, multiply by 100 for %)
**Calculation**: Failed requests / Total requests

**Interpretation**:
```
Excellent: < 0.01 (1%)
Good:      < 0.05 (5%)
Acceptable: < 0.10 (10%)
Poor:      > 0.10 (10%)
```

#### `http_reqs`
**Description**: Total number of HTTP requests generated
**Unit**: Count and Rate (requests per second)
**Components**:
- `count`: Total requests made
- `rate`: Requests per second (RPS/QPS)

#### `http_req_waiting`
**Description**: Time spent waiting for server response (TTFB - Time To First Byte)
**Unit**: Milliseconds (ms)
**Significance**: Server processing time, excludes network latency

#### `http_req_connecting`
**Description**: Time spent establishing TCP connection
**Unit**: Milliseconds (ms)
**Significance**: Network connectivity and DNS resolution

#### `http_req_sending`
**Description**: Time spent sending request data
**Unit**: Milliseconds (ms)
**Significance**: Upload bandwidth and request size impact

#### `http_req_receiving`
**Description**: Time spent receiving response data
**Unit**: Milliseconds (ms)
**Significance**: Download bandwidth and response size impact

### System Performance Metrics

#### `iterations`
**Description**: Number of complete test iterations executed
**Unit**: Count and Rate (iterations per second)
**Usage**: Measure test execution throughput

#### `iteration_duration`
**Description**: Time to complete one full test iteration
**Unit**: Milliseconds (ms)
**Includes**: All requests, think time, and processing in one iteration

#### `vus` (Virtual Users)
**Description**: Number of concurrent virtual users
**Unit**: Count
**Usage**: Current load level indicator

#### `vus_max`
**Description**: Maximum number of virtual users reached
**Unit**: Count
**Usage**: Peak load capacity measurement

## Custom Metrics

### Business-Specific Metrics

#### `page_load_time`
**Description**: Custom metric tracking complete page load performance
**Type**: Trend
**Unit**: Milliseconds (ms)
**Usage**: End-user experience measurement

```javascript
export const pageLoadTime = new Trend('page_load_time');
pageLoadTime.add(response.timings.duration);
```

#### `api_response_time`
**Description**: API-specific response time tracking
**Type**: Trend  
**Unit**: Milliseconds (ms)
**Usage**: Backend service performance isolation

#### `custom_error_rate`
**Description**: Application-specific error tracking
**Type**: Rate
**Unit**: Percentage (0.0 to 1.0)
**Usage**: Business logic error monitoring

```javascript
export const errorRate = new Rate('custom_error_rate');
errorRate.add(!result); // Add 1 for errors, 0 for success
```

#### `user_journey_completed`
**Description**: Successful user journey completion tracking
**Type**: Counter
**Unit**: Count
**Usage**: Business process success measurement

```javascript
export const userJourneyCounter = new Counter('user_journey_completed');
userJourneyCounter.add(1, { journey: 'contact_interaction' });
```

## Performance Thresholds

### Production Environment
```javascript
thresholds: {
  http_req_duration: ['p(95)<2000'],     // 95% under 2s
  http_req_failed: ['rate<0.01'],        // <1% error rate
  http_reqs: ['rate>50'],                // >50 RPS throughput
  page_load_time: ['p(90)<1500'],        // 90% pages under 1.5s
  custom_error_rate: ['rate<0.005']      // <0.5% business errors
}
```

### Staging Environment
```javascript
thresholds: {
  http_req_duration: ['p(95)<3000'],     // More relaxed
  http_req_failed: ['rate<0.05'],        // 5% error tolerance
  http_reqs: ['rate>30'],                // Lower throughput requirement
}
```

### Development Environment
```javascript
thresholds: {
  http_req_duration: ['p(95)<1000'],     // Faster local response
  http_req_failed: ['rate<0.1'],         // 10% error tolerance
  http_reqs: ['rate>10'],                // Minimal throughput
}
```

## Metric Analysis Patterns

### Response Time Analysis

#### Percentile Distribution
```
p(50) = 500ms   # Median user experience
p(90) = 1200ms  # Most users (90%) experience
p(95) = 1800ms  # SLA threshold (95% of users)
p(99) = 3500ms  # Outlier detection (1% worst case)
```

#### Performance Categories
- **Fast**: p(95) < 1000ms - Excellent user experience
- **Acceptable**: p(95) 1000-2000ms - Good user experience  
- **Slow**: p(95) 2000-3000ms - Acceptable but needs optimization
- **Critical**: p(95) > 3000ms - Poor user experience, immediate action needed

### Error Rate Analysis

#### Error Classification
```javascript
// HTTP Status Code Analysis
2xx: Success (target: >99%)
3xx: Redirects (monitor for excessive redirects)
4xx: Client errors (application issues)
5xx: Server errors (infrastructure issues)
```

#### Error Rate Trends
- **Stable**: Consistent low error rate across test duration
- **Spike**: Sudden increase during load peaks
- **Degradation**: Gradual increase over time (capacity issues)
- **Recovery**: Error rate returns to baseline after load reduction

### Throughput Analysis

#### Request Rate Patterns
```
Baseline RPS: Normal traffic simulation
Peak RPS: Maximum sustainable throughput  
Burst RPS: Short-term spike handling
Sustained RPS: Long-term capacity
```

#### Capacity Planning
- **Current Capacity**: Maximum RPS with acceptable response times
- **Growth Buffer**: 20-30% headroom for traffic growth
- **Scaling Triggers**: RPS thresholds for auto-scaling
- **Cost Optimization**: Right-sizing based on actual usage

## Performance Benchmarks

### Industry Standards

#### E-commerce Applications
- Page Load: p(95) < 2000ms
- Search: p(95) < 1000ms
- Checkout: p(95) < 3000ms
- Error Rate: < 0.1%

#### SaaS Applications  
- Dashboard: p(95) < 1500ms
- API Calls: p(95) < 500ms
- Reports: p(95) < 5000ms
- Error Rate: < 0.5%

#### Portfolio/Marketing Sites
- Homepage: p(95) < 2000ms
- Navigation: p(95) < 1000ms
- Contact Forms: p(95) < 3000ms
- Error Rate: < 1%

### Mobile Performance
- **3G Network**: p(95) < 5000ms
- **4G Network**: p(95) < 3000ms
- **WiFi**: p(95) < 2000ms

## Alerting Thresholds

### Critical Alerts (Immediate Action)
```
Error Rate > 5%
p(95) Response Time > 5000ms
Throughput Drop > 50%
Complete Service Failure
```

### Warning Alerts (Monitor Closely)
```
Error Rate > 2%
p(95) Response Time > 3000ms
Throughput Drop > 25%
Sustained High Response Times
```

### Information Alerts (Trend Monitoring)
```
Error Rate > 1%
p(95) Response Time > 2000ms
Throughput Drop > 10%
Performance Degradation Trends
```

## Reporting Best Practices

### Executive Summary Metrics
1. **Availability**: Overall system uptime percentage
2. **Performance**: 95th percentile response time
3. **Reliability**: Error rate percentage
4. **Capacity**: Peak throughput achieved

### Technical Deep Dive
1. **Response Time Distribution**: Full percentile breakdown
2. **Error Analysis**: Status code distribution and root causes
3. **Throughput Patterns**: RPS trends and capacity utilization
4. **Resource Utilization**: CPU, memory, network usage

### Trend Analysis
1. **Week-over-Week**: Performance comparison
2. **Peak vs Off-Peak**: Load pattern analysis
3. **Feature Impact**: Performance changes after deployments
4. **Seasonal Trends**: Traffic pattern variations

---

*This metrics guide ensures consistent interpretation and actionable insights from performance test results.*