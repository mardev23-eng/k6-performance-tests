# 🔧 Troubleshooting Guide

## Common Issues and Solutions

This guide helps resolve common issues encountered when running the K6 Enterprise Performance Testing Suite.

## Installation Issues

### K6 Installation Problems

#### Issue: K6 command not found
```bash
k6: command not found
```

**Solutions:**
```bash
# macOS with Homebrew
brew install k6

# Ubuntu/Debian
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows with Chocolatey
choco install k6

# Direct download
# Visit https://k6.io/docs/getting-started/installation/
```

#### Issue: K6 version compatibility
```bash
Error: unsupported JavaScript feature
```

**Solution:**
```bash
# Check K6 version
k6 version

# Update to latest version
brew upgrade k6  # macOS
sudo apt-get update && sudo apt-get upgrade k6  # Ubuntu
```

### Node.js Dependencies

#### Issue: npm install failures
```bash
npm ERR! peer dep missing
```

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific Node.js version
nvm use 18
npm install
```

## Test Execution Issues

### Network Connectivity

#### Issue: Connection timeouts
```bash
ERRO[0030] GoError: Get "https://marvinmarzon.netlify.app": context deadline exceeded
```

**Solutions:**
1. **Check internet connectivity**
```bash
ping marvinmarzon.netlify.app
curl -I https://marvinmarzon.netlify.app
```

2. **Increase timeout values**
```javascript
export let options = {
  timeout: '60s',  // Increase from default 30s
  // ... other options
};
```

3. **Check firewall/proxy settings**
```bash
# Test with curl
curl -v https://marvinmarzon.netlify.app

# Check proxy settings
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

#### Issue: DNS resolution failures
```bash
ERRO[0005] GoError: lookup marvinmarzon.netlify.app: no such host
```

**Solutions:**
```bash
# Test DNS resolution
nslookup marvinmarzon.netlify.app
dig marvinmarzon.netlify.app

# Try different DNS servers
# Add to /etc/resolv.conf (Linux) or network settings
nameserver 8.8.8.8
nameserver 1.1.1.1
```

### High Error Rates

#### Issue: Excessive 4xx errors
```bash
✗ Response check - Status is 200
```

**Debugging Steps:**
1. **Check response details**
```javascript
console.log(`Status: ${response.status}`);
console.log(`Body: ${response.body.substring(0, 200)}`);
console.log(`Headers: ${JSON.stringify(response.headers)}`);
```

2. **Verify URL accessibility**
```bash
curl -I https://marvinmarzon.netlify.app
```

3. **Check for rate limiting**
```javascript
if (response.status === 429) {
  console.log('Rate limited - consider reducing load');
}
```

#### Issue: SSL/TLS certificate errors
```bash
ERRO[0010] GoError: x509: certificate verify failed
```

**Solutions:**
```javascript
export let options = {
  insecureSkipTLSVerify: true,  // Only for testing
  // ... other options
};
```

### Performance Issues

#### Issue: Slow test execution
```bash
Test taking much longer than expected
```

**Optimization Steps:**
1. **Reduce think time**
```javascript
// Instead of
sleep(Math.random() * 5 + 3);  // 3-8 seconds

// Use
sleep(Math.random() * 2 + 1);  // 1-3 seconds
```

2. **Optimize request patterns**
```javascript
// Batch related requests
const responses = http.batch([
  ['GET', `${baseUrl}/page1`],
  ['GET', `${baseUrl}/page2`],
]);
```

3. **Reduce virtual users for debugging**
```javascript
export let options = {
  stages: [
    { duration: '30s', target: 1 },  // Start with 1 user
  ],
};
```

## Docker Issues

### Container Build Problems

#### Issue: Docker build failures
```bash
ERROR: failed to solve: process "/bin/sh -c npm install" did not complete successfully
```

**Solutions:**
```dockerfile
# Use specific Node.js version
FROM node:18-alpine

# Clear npm cache in Dockerfile
RUN npm cache clean --force

# Use npm ci instead of npm install
RUN npm ci --only=production
```

#### Issue: Volume mounting problems
```bash
Error: ENOENT: no such file or directory
```

**Solutions:**
```bash
# Check file paths in docker-compose.yml
volumes:
  - ./reports:/app/reports  # Ensure ./reports exists
  - ./tests:/app/tests

# Create directories first
mkdir -p reports tests config utils

# Check permissions
chmod 755 reports tests config utils
```

### Container Runtime Issues

#### Issue: Permission denied in container
```bash
Error: EACCES: permission denied, open '/app/reports/results.json'
```

**Solutions:**
```dockerfile
# Add user permissions in Dockerfile
RUN mkdir -p /app/reports && chmod 777 /app/reports

# Or run as specific user
USER node
```

```bash
# Fix host directory permissions
sudo chown -R $USER:$USER reports/
chmod -R 755 reports/
```

## Test Script Issues

### JavaScript Errors

#### Issue: Import/export errors
```bash
SyntaxError: Unexpected token 'export'
```

**Solutions:**
```javascript
// Use proper ES6 module syntax
export { getEnvironment } from './config/environments.js';

// Not CommonJS
module.exports = { getEnvironment };  // ❌ Wrong for K6
```

#### Issue: Undefined variables
```bash
ReferenceError: __ENV is not defined
```

**Solutions:**
```javascript
// Check environment variable access
const env = __ENV.ENVIRONMENT || 'production';

// Provide defaults
const baseUrl = __ENV.BASE_URL || 'https://marvinmarzon.netlify.app';
```

### Logic Errors

#### Issue: Incorrect test flow
```bash
Tests not following expected user journey
```

**Debugging:**
```javascript
// Add logging for debugging
console.log(`Current VU: ${__VU}, Iteration: ${__ITER}`);
console.log(`Response status: ${response.status}`);

// Use groups for organization
group('User Journey Step 1', function() {
  // Test logic here
});
```

## Environment Issues

### Configuration Problems

#### Issue: Wrong environment selected
```bash
Tests running against wrong URL
```

**Solutions:**
```bash
# Set environment explicitly
export ENVIRONMENT=production
k6 run tests/load/load-test.js

# Or inline
ENVIRONMENT=staging k6 run tests/load/load-test.js
```

#### Issue: Missing environment variables
```bash
Error: Missing required environment configuration
```

**Solutions:**
```javascript
// Add validation in config
export function getEnvironment() {
  const env = __ENV.ENVIRONMENT || 'production';
  const config = environments[env];
  
  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }
  
  return config;
}
```

## Reporting Issues

### Report Generation Failures

#### Issue: HTML report not generated
```bash
Error: Cannot read property 'metrics' of undefined
```

**Solutions:**
```bash
# Check if JSON reports exist
ls -la reports/*.json

# Verify Node.js dependencies
npm list chart.js chartjs-node-canvas

# Run report generation manually
node scripts/generate-report.js
```

#### Issue: Charts not displaying
```bash
Charts showing as blank in HTML report
```

**Solutions:**
```javascript
// Check data format in generate-report.js
if (!data || !data.metrics) {
  console.log('No metrics data available');
  return '';
}

// Verify chart.js version compatibility
npm update chart.js chartjs-node-canvas
```

## CI/CD Issues

### GitHub Actions Failures

#### Issue: K6 installation fails in CI
```yaml
Error: Unable to locate package k6
```

**Solutions:**
```yaml
# Use official K6 action
- name: Run K6 test
  uses: grafana/k6-action@v0.3.1
  with:
    filename: tests/load/load-test.js

# Or manual installation
- name: Install K6
  run: |
    sudo gpg -k
    sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
    sudo apt-get update
    sudo apt-get install k6
```

#### Issue: Artifacts not uploaded
```yaml
Error: No files were found with the provided path
```

**Solutions:**
```yaml
- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: k6-results
    path: |
      k6-performance-tests/reports/
      !k6-performance-tests/reports/.gitkeep
    retention-days: 30
```

## Performance Debugging

### Slow Response Times

#### Investigation Steps:
1. **Check target server status**
```bash
curl -w "@curl-format.txt" -o /dev/null -s https://marvinmarzon.netlify.app
```

2. **Monitor during test execution**
```javascript
if (response.timings.duration > 5000) {
  console.warn(`Slow response: ${response.timings.duration}ms for ${response.url}`);
}
```

3. **Analyze response time components**
```javascript
console.log(`DNS: ${response.timings.dns}ms`);
console.log(`Connect: ${response.timings.connecting}ms`);
console.log(`Waiting: ${response.timings.waiting}ms`);
console.log(`Receiving: ${response.timings.receiving}ms`);
```

### Memory Issues

#### Issue: K6 process consuming excessive memory
```bash
K6 process killed due to memory usage
```

**Solutions:**
```javascript
// Reduce concurrent users
export let options = {
  stages: [
    { duration: '5m', target: 10 },  // Reduce from 50
  ],
};

// Optimize data handling
// Don't store large response bodies
const response = http.get(url, { responseType: 'none' });
```

## Getting Help

### Debug Information Collection
```bash
# System information
k6 version
node --version
npm --version
docker --version

# Test environment
echo $ENVIRONMENT
echo $PATH

# Network connectivity
ping marvinmarzon.netlify.app
curl -I https://marvinmarzon.netlify.app

# File permissions
ls -la k6-performance-tests/
ls -la k6-performance-tests/reports/
```

### Log Analysis
```bash
# Run with verbose logging
k6 run --verbose tests/load/load-test.js

# Capture output
k6 run tests/load/load-test.js 2>&1 | tee test-output.log

# Check system logs
tail -f /var/log/syslog  # Linux
tail -f /var/log/system.log  # macOS
```

### Contact Support
If issues persist after trying these solutions:

1. **Create GitHub Issue**: Include debug information and error logs
2. **Email Support**: marvinmarzon@outlook.com with detailed problem description
3. **Check Documentation**: Review K6 official docs at https://k6.io/docs/

---

*This troubleshooting guide covers the most common issues encountered in enterprise performance testing environments.*