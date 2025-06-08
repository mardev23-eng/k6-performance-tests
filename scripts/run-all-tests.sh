#!/bin/bash

# K6 Enterprise Performance Testing Suite
# Run all test scenarios for Marvin Marzon's Portfolio

echo "🚀 Starting K6 Enterprise Performance Testing Suite"
echo "=================================================="
echo "Target: https://marvinmarzon.netlify.app"
echo "Date: $(date)"
echo ""

# Create reports directory
mkdir -p reports

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run test and check result
run_test() {
    local test_name=$1
    local test_file=$2
    
    echo -e "${BLUE}Running $test_name...${NC}"
    
    if k6 run "$test_file"; then
        echo -e "${GREEN}✅ $test_name PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name FAILED${NC}"
        return 1
    fi
}

# Test execution order
tests=(
    "Smoke Test:tests/smoke/smoke-test.js"
    "Load Test:tests/load/load-test.js"
    "Stress Test:tests/stress/stress-test.js"
    "Spike Test:tests/spike/spike-test.js"
    "Endurance Test:tests/endurance/endurance-test.js"
)

passed_tests=0
total_tests=${#tests[@]}

# Run all tests
for test in "${tests[@]}"; do
    IFS=':' read -r test_name test_file <<< "$test"
    
    if run_test "$test_name" "$test_file"; then
        ((passed_tests++))
    fi
    
    echo ""
done

# Generate HTML report
echo -e "${BLUE}Generating HTML report...${NC}"
if node scripts/generate-report.js; then
    echo -e "${GREEN}✅ HTML report generated successfully${NC}"
else
    echo -e "${YELLOW}⚠️  HTML report generation failed${NC}"
fi

# Final summary
echo ""
echo "=================================================="
echo -e "${BLUE}🏁 TEST EXECUTION SUMMARY${NC}"
echo "=================================================="
echo "Total Tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    exit 1
fi