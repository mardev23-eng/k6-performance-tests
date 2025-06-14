# 📋 Test Scenarios Documentation

## Overview
This document provides detailed information about each test scenario in the K6 Enterprise Performance Testing Suite, including objectives, execution patterns, and success criteria.

## Test Scenario Matrix

| Test Type | Duration | Max Users | Pattern | Primary Focus |
|-----------|----------|-----------|---------|---------------|
| Smoke | 30s | 1 | Constant | Functionality |
| Load | 16min | 20 | Ramp-up/down | Normal capacity |
| Stress | 28min | 150 | Progressive | Breaking points |
| Spike | 8min | 300 | Sudden spikes | Traffic surges |
| Endurance | 70min | 15 | Sustained | Long-term stability |

## 1. Smoke Testing

### Objective
Validate basic functionality and critical user paths to ensure the application is ready for more intensive testing.

### Test Pattern
```
Users: 1
Duration: 30 seconds
Pattern: Constant load
```

### Test Scenarios
- **Homepage Load**: Basic page loading and content validation
- **Static Assets**: CSS, JavaScript, and image loading
- **Navigation**: Core navigation functionality
- **Contact Form**: Form availability and basic validation
- **Performance Baseline**: Initial performance measurement

### Success Criteria
- All requests return HTTP 200 status
- Page load time < 5 seconds
- No JavaScript errors
- All critical assets load successfully
- Contact form is accessible

### Key Validations
```javascript
check(response, {
  'Homepage contains title': (r) => r.body.includes('Marvin Marzon'),
  'Homepage contains navigation': (r) => r.body.includes('About'),
  'Response time < 3s': (r) => r.timings.duration < 3000,
});
```

## 2. Load Testing

### Objective
Simulate normal expected traffic patterns to validate performance under typical user loads.

### Test Pattern
```
Stage 1: 2min ramp-up to 10 users
Stage 2: 5min sustained at 10 users  
Stage 3: 2min ramp-up to 20 users
Stage 4: 5min sustained at 20 users
Stage 5: 2min ramp-down to 0 users
```

### User Journey Simulation
1. **Homepage Visit** (2-4s think time)
2. **About Section** (3-6s think time)
3. **Skills Section** (2-5s think time)
4. **Projects Portfolio** (4-8s think time)
5. **Testing Dashboard** (3-6s think time)
6. **Contact Interaction** (50% probability)
7. **Resume Download** (30% probability)

### Success Criteria
- 95th percentile response time < 2000ms
- Error rate < 1%
- Request rate > 50 RPS
- All user journeys complete successfully

### Performance Thresholds
```javascript
thresholds: {
  http_req_duration: ['p(95)<2000'],
  http_req_failed: ['rate<0.01'],
  http_reqs: ['rate>50']
}
```

## 3. Stress Testing

### Objective
Push the system beyond normal capacity to identify breaking points and performance degradation patterns.

### Test Pattern
```
Stage 1: 2min ramp-up to 20 users (normal)
Stage 2: 5min sustained at 20 users
Stage 3: 2min ramp-up to 50 users (high)
Stage 4: 5min sustained at 50 users
Stage 5: 2min ramp-up to 100 users (stress)
Stage 6: 5min sustained at 100 users
Stage 7: 2min ramp-up to 150 users (breaking point)
Stage 8: 5min sustained at 150 users
Stage 9: 5min recovery ramp-down
```

### Stress Scenarios
- **Homepage Under Stress**: Core page performance
- **Rapid Navigation**: Fast section switching
- **Asset Loading Stress**: Concurrent resource requests
- **Performance Degradation Monitoring**: Response time tracking

### Success Criteria
- 95th percentile response time < 5000ms
- Error rate < 10%
- System recovers gracefully
- No complete service failures

### Monitoring Points
```javascript
if (response.timings.duration > 5000) {
  console.warn(`Slow response detected: ${response.timings.duration}ms`);
}
```

## 4. Spike Testing

### Objective
Validate system behavior during sudden traffic spikes and auto-scaling effectiveness.

### Test Pattern
```
Stage 1: 1min normal load (10 users)
Stage 2: 30s sudden spike (200 users)
Stage 3: 1min sustained spike
Stage 4: 30s quick recovery (10 users)
Stage 5: 2min recovery period
Stage 6: 30s bigger spike (300 users)
Stage 7: 1min sustained bigger spike
Stage 8: 1min complete recovery
```

### Spike Scenarios
- **Homepage During Spike**: Core functionality under sudden load
- **Viral Content Access**: Popular section simulation
- **CDN Performance**: Static asset delivery during spikes
- **Auto-scaling Response**: Infrastructure adaptation

### Success Criteria
- Error rate < 20% during spikes
- 95th percentile response time < 10000ms
- System maintains basic functionality
- Quick recovery after spike ends

### Spike Metrics
```javascript
if (__VU > 50) { // During spike periods
  if (response.timings.duration > 3000) {
    console.log(`Spike impact: ${response.timings.duration}ms with ${__VU} VUs`);
  }
}
```

## 5. Endurance Testing

### Objective
Validate long-term system stability and detect memory leaks or performance degradation over time.

### Test Pattern
```
Stage 1: 5min ramp-up to 15 users
Stage 2: 60min sustained at 15 users
Stage 3: 5min ramp-down to 0 users
```

### Endurance Scenarios
- **Sustained Homepage Access**: Long-term page performance
- **Random Navigation**: Varied user behavior patterns
- **Deep Navigation** (every 10th iteration): Complete site traversal
- **Resource Monitoring** (every 20th iteration): Performance tracking

### Success Criteria
- 95th percentile response time < 3000ms
- Error rate < 5%
- No significant performance degradation
- Stable memory usage patterns

### Long-term Monitoring
```javascript
if (__ITER % 20 === 0) {
  const iterationTime = Date.now() - iterationStart;
  console.log(`Endurance check - Iteration ${__ITER}: ${iterationTime}ms`);
}
```

## Test Data & User Simulation

### Realistic User Data
```javascript
const userData = {
  names: ['John Doe', 'Jane Smith', 'Mike Johnson'],
  companies: ['TechCorp', 'DataSystems', 'QualityFirst'],
  subjects: ['Job Opportunity', 'Project Inquiry', 'Consultation']
};
```

### Think Time Simulation
- **Homepage Reading**: 2-4 seconds
- **Content Review**: 3-6 seconds
- **Form Filling**: 5-15 seconds
- **Navigation**: 1-3 seconds

### Browser Simulation
```javascript
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br'
};
```

## Performance Baselines

### Response Time Targets
- **Excellent**: < 1000ms
- **Good**: 1000-2000ms  
- **Acceptable**: 2000-3000ms
- **Poor**: > 3000ms

### Error Rate Thresholds
- **Production**: < 1%
- **Staging**: < 5%
- **Development**: < 10%

### Throughput Expectations
- **Minimum**: 10 RPS
- **Normal**: 50 RPS
- **Peak**: 100+ RPS

## Troubleshooting Common Issues

### High Response Times
1. Check CDN performance
2. Verify database query efficiency
3. Monitor server resource utilization
4. Analyze network latency

### High Error Rates
1. Review server logs
2. Check rate limiting settings
3. Verify SSL certificate validity
4. Monitor third-party service dependencies

### Failed Test Scenarios
1. Validate test environment connectivity
2. Check K6 version compatibility
3. Review test script syntax
4. Verify environment configuration

---

*This documentation ensures consistent test execution and reliable performance validation across all testing scenarios.*