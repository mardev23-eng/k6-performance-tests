FROM grafana/k6:latest

# Set working directory
WORKDIR /app

# Copy test files
COPY . .

# Create reports directory
RUN mkdir -p reports

# Default command runs load test
CMD ["run", "tests/load/load-test.js"]