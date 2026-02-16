# Performance Test Plan — Munsiq API

## 1. Objectives

- Validate that the API meets the performance NFRs (P99 < 500ms).
- Determine the maximum throughput (requests per second) the system can handle.
- Identify performance bottlenecks under load.
- Ensure the system remains stable and available during peak load.

## 2. Scope

### In Scope

- High-traffic, read-heavy endpoints:
  - `GET /properties`
  - `GET /contracts`
  - `GET /tenants/{id}/payments`
- Critical, write-heavy endpoints:
  - `POST /contracts`
  - `POST /maintenance-requests`
- Mixed-load scenarios simulating real-world user behavior.

### Out of Scope

- Frontend performance (FCP, LCP) - this is covered by Lighthouse tests.
- Performance of third-party systems (Ejar, SADAD) - these will be mocked.

## 3. Test Environment

- **Target Environment**: A dedicated, production-like staging environment.
- **Load Generators**: k6 Cloud or self-hosted k6 instances running on separate EC2 machines.
- **Monitoring**: Datadog/CloudWatch to monitor CPU, memory, database connections, and response times during the test.

## 4. NFRs (Performance)

| NFR-ID | Requirement | Target | Pass/Fail Criteria |
|---|---|---|---|
| NFR-PERF-001 | API response time (P95) | < 300ms | P95 response time must be below 300ms. |
| NFR-PERF-002 | API response time (P99) | < 500ms | P99 response time must be below 500ms. |
| NFR-PERF-006 | Concurrent users | ≥ 500 | System must handle 500 concurrent virtual users without error rate exceeding 1%. |
| NFR-PERF-007 | Throughput | ≥ 1000 req/s | System must sustain 1000 requests/second with acceptable response times. |

## 5. Test Scenarios

| Scenario | Type | VUs (Virtual Users) | Duration | Description |
|---|---|---|---|---|
| **Smoke Test** | Load | 1 VU | 1 min | A single user runs through the critical path to ensure the script works. |
| **Average Load Test** | Load | 100 VUs | 15 mins | Simulates a typical day's load. Ramp up to 100 VUs over 2 mins, hold for 10 mins, ramp down. |
| **Stress Test** | Stress | 0 -> 1000 VUs | 20 mins | Gradually increase VUs until the system breaks (error rate > 5% or P99 > 2s) to find the breaking point. |
| **Spike Test** | Spike | 0 -> 500 VUs -> 0 | 10 mins | Rapidly ramp up to 500 VUs, hold for 2 mins, then ramp down to zero to test system recovery. |
| **Soak Test** | Soak | 150 VUs | 2 hours | Run a sustained average load for an extended period to check for memory leaks or performance degradation over time. |

## 6. Test Execution & Reporting

- Tests will be executed using the k6 CLI, with results streamed to k6 Cloud for analysis.
- A test report will be generated after each run, including:
  - P95, P99, and average response times.
  - Request throughput (req/s).
  - Error rate.
  - Screenshots of CPU/memory utilization from Datadog.
- The results will be compared against the NFRs to determine a Pass/Fail outcome.
