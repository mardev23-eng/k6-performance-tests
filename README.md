# 🚀 K6 Performance Testing Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![K6 Version](https://img.shields.io/badge/K6-Latest-blue.svg)](https://k6.io/)

> **Performance testing framework for QA & SDET portfolio validation**

K6 performance testing suite demonstrating advanced load testing capabilities, comprehensive monitoring, and reporting for [Marvin Marzon's QA & SDET Portfolio](https://marvinmarzon.netlify.app).

## 🎯 Quick Overview

This repository showcases **performance engineering expertise** through a comprehensive testing framework that validates:

- ✅ **Performance under load** (up to 300 concurrent users)
- ✅ **System reliability** (99.5%+ availability target)
- ✅ **Scalability limits** (breaking point analysis)
- ✅ **Long-term stability** (70-minute endurance testing)
- ✅ **Traffic spike handling** (sudden load surge simulation)

## 🚦 Quick Start

### Prerequisites
```bash
# Install K6
brew install k6  # macOS
# or visit https://k6.io/docs/getting-started/installation/

# Install Node.js dependencies
npm install
```

### Run Tests
```bash
# Quick validation
npm run test:smoke     # 30 seconds - basic functionality

# Performance testing
npm run test:load      # 16 minutes - normal load simulation
npm run test:stress    # 28 minutes - breaking point analysis

# Generate reports
npm run report         # HTML dashboard with charts
```

### Docker Execution
```bash
# Run with Docker
docker-compose up k6

# Specific test types
docker-compose up k6-smoke
docker-compose up k6-stress
```

## 📊 Test Scenarios

| Test Type | Duration | Max Users | Purpose |
|-----------|----------|-----------|---------|
| **Smoke** | 30s | 1 | Basic functionality validation |
| **Load** | 16min | 20 | Normal traffic simulation |
| **Stress** | 28min | 150 | Breaking point identification |
| **Spike** | 8min | 300 | Traffic surge handling |
| **Endurance** | 70min | 15 | Long-term stability |

## 🎯 Performance Targets

- **Response Time**: 95th percentile < 2000ms
- **Availability**: > 99.5% uptime
- **Error Rate**: < 1% failed requests
- **Throughput**: > 50 requests/second sustained

## 📈 Features

### 🔧 **Professional Tooling**
- Multi-environment support (dev/staging/production)
- Docker containerization for consistent testing
- CI/CD pipeline integration (GitHub Actions)
- Automated HTML report generation
- Custom metrics and monitoring

### 📊 **Advanced Analytics**
- Real-time performance metrics
- Executive summary dashboards
- Trend analysis and regression detection
- SLA compliance monitoring
- Performance baseline establishment

### 🚀 **Scalable Architecture**
- Modular test design for easy maintenance
- Reusable utility functions and helpers
- Environment-specific configuration
- Comprehensive error handling and logging

## 📁 Project Structure

```
k6-performance-tests/
├── 📋 tests/
│   ├── smoke/          # Basic validation tests
│   ├── load/           # Normal load simulation
│   ├── stress/         # Breaking point analysis
│   ├── spike/          # Traffic surge testing
│   └── endurance/      # Long-term stability
├── 🔧 utils/           # Shared utilities and helpers
├── ⚙️  config/         # Environment configurations
├── 📊 reports/         # Generated test reports
├── 🐳 docker/          # Container configurations
└── 📚 docs/            # Comprehensive documentation
```

## 🔄 CI/CD Integration

### GitHub Actions Pipeline
- **Automated Testing**: Triggered on code changes
- **Scheduled Runs**: Daily performance monitoring
- **PR Validation**: Performance regression detection
- **Report Generation**: Automated HTML dashboards
- **Slack Notifications**: Team alerts and summaries

### Pipeline Features
```yaml
# Example workflow trigger
on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:     # Manual execution
```

## 📊 Sample Results

### Load Test Summary
```
🔥 LOAD TEST COMPLETED
======================
Environment: Production
URL: https://marvinmarzon.netlify.app
Virtual Users: 20 (peak)
Duration: 16 minutes
Total Requests: 2,847
Request Rate: 2.97 req/s
Failed Requests: 0.12%

Performance Metrics:
- Average Response Time: 1,247ms
- 95th Percentile: 1,834ms
- 99th Percentile: 2,156ms

Status: ✅ PASSED
```

## 🛠️ Technology Stack

- **Testing Framework**: [K6](https://k6.io/) by Grafana Labs
- **Scripting**: JavaScript ES6+
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Reporting**: HTML dashboards with Chart.js
- **Monitoring**: Custom metrics and thresholds

## 📚 Documentation

- **[Repository Description](REPOSITORY_DESCRIPTION.md)** - Comprehensive overview
- **[Test Scenarios](docs/test-scenarios.md)** - Detailed test documentation
- **[Metrics Guide](docs/metrics-guide.md)** - Performance metrics explanation
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions

## 🎯 Professional Value

### For QA Engineers
- **Best Practices**: Industry-standard performance testing approaches
- **Scalable Framework**: Easily adaptable to different applications
- **Comprehensive Coverage**: Multiple testing scenarios and metrics

### For Development Teams
- **Early Detection**: Performance issues caught before production
- **Capacity Planning**: Data-driven infrastructure decisions
- **SLA Validation**: Ensure performance requirements are met

### For Business Stakeholders
- **Risk Mitigation**: Prevent performance-related outages
- **User Experience**: Ensure optimal application responsiveness
- **Cost Optimization**: Right-size infrastructure investments

## 🤝 Contributing

This framework demonstrates Professional-level QA engineering capabilities. For questions or collaboration opportunities:

**Marvin Marzon** - QA & SDET Professional
- 📧 **Email**: marvinmarzon@outlook.com
- 💼 **LinkedIn**: [Marvin Marzon](https://www.linkedin.com/in/mmarzon/)
- 🌐 **Portfolio**: [https://marvinmarzon.netlify.app](https://marvinmarzon.netlify.app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**🚀 Professional Performance Testing Excellence**

*Demonstrating professional QA engineering capabilities through comprehensive performance validation*

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=for-the-badge)](https://marvinmarzon.netlify.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/mmarzon/)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:marvinmarzon@outlook.com)

</div>
