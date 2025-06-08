# K6 Enterprise Performance Testing Suite

## Overview
Comprehensive performance testing suite for Marvin Marzon's QA & SDET Portfolio using K6. This enterprise-grade testing framework includes load testing, stress testing, spike testing, and endurance testing scenarios.

## Test Site
- **Production URL**: https://marvinmarzon.netlify.app
- **Application Type**: React SPA Portfolio
- **Testing Focus**: Frontend performance, API endpoints, user workflows

## Prerequisites
- K6 installed (`brew install k6` or download from https://k6.io/docs/getting-started/installation/)
- Node.js (for test data generation and reporting)
- Docker (optional, for containerized testing)

## Test Structure
```
k6-performance-tests/
├── tests/
│   ├── load/           # Load testing scenarios
│   ├── stress/         # Stress testing scenarios
│   ├── spike/          # Spike testing scenarios
│   ├── endurance/      # Endurance testing scenarios
│   └── smoke/          # Smoke testing scenarios
├── utils/              # Utility functions and helpers
├── data/               # Test data files
├── config/             # Configuration files
├── reports/            # Test reports and results
└── scripts/            # Automation scripts
```

## Quick Start
```bash
# Run smoke test
npm run test:smoke

# Run load test
npm run test:load

# Run stress test
npm run test:stress

# Run all tests
npm run test:all

# Generate HTML report
npm run report
```

## Test Scenarios

### 1. Smoke Tests
- Basic functionality validation
- Critical user journeys
- API endpoint availability

### 2. Load Tests
- Normal expected load
- Gradual ramp-up/ramp-down
- Sustained load over time

### 3. Stress Tests
- Beyond normal capacity
- Breaking point identification
- Recovery testing

### 4. Spike Tests
- Sudden traffic spikes
- Auto-scaling validation
- Performance degradation analysis

### 5. Endurance Tests
- Extended duration testing
- Memory leak detection
- Resource utilization monitoring

## Performance Thresholds
- **Response Time**: 95th percentile < 2000ms
- **Availability**: > 99.5%
- **Error Rate**: < 1%
- **Throughput**: > 100 RPS sustained

## Monitoring & Reporting
- Real-time metrics dashboard
- HTML reports with charts
- CI/CD integration ready
- Slack/email notifications

## Enterprise Features
- Multi-environment support
- Data-driven testing
- Custom metrics collection
- Performance regression detection
- Load balancer testing
- CDN performance validation