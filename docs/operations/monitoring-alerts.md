# Monitoring & Alerts — Munsiq Platform

## 1. Monitoring Dashboards

A central monitoring dashboard will be created in Datadog (or a similar tool) with the following key sections:

| Dashboard Section | Key Metrics | Description |
|---|---|---|
| **API Performance** | - API Latency (P50, P95, P99)<br>- Request Throughput (req/s)<br>- Error Rate (%) | Overall health of the API application. |
| **Kubernetes Cluster** | - Pod Status (Running, Pending, Crashing)<br>- CPU Utilization (%)<br>- Memory Utilization (%) | Health of the EKS cluster and application pods. |
| **Database Performance** | - DB CPU Utilization (%)<br>- Active Connections<br>- Read/Write IOPS<br>- Slow Query Count | Health of the Aurora PostgreSQL database. |
| **Queue System** | - Queue Length (Jobs waiting)<br>- Number of Active Workers<br>- Job Failure Rate | Health of the BullMQ background job system. |
| **Business Metrics** | - New Contracts per Hour<br>- Payments Processed per Hour<br>- User Sign-ups | Key business-level activity on the platform. |

## 2. Alerting Policy

Alerts are categorized by severity and will notify the on-call engineer via PagerDuty.

### SEV-1 (Critical - Pages On-Call Immediately)

| Alert Name | Condition | Threshold | Evaluation Period | Description |
|---|---|---|---|---|
| API High Error Rate | `(sum(http.server.requests{status:5xx}) / sum(http.server.requests)) > 5%` | > 5% | 5 minutes | More than 5% of API requests are failing. |
| API High Latency | `p99(http.server.requests.duration) > 2000ms` | > 2s | 5 minutes | API is unacceptably slow. |
| Database CPU High | `avg(aws.rds.cpuutilization) > 90%` | > 90% | 10 minutes | Database is overloaded and at risk of failure. |
| Site Unreachable | Uptime check fails from multiple locations. | Fails 3 consecutive times | 3 minutes | The main website or API is down. |

### SEV-2 (High - Pages On-Call Immediately)

| Alert Name | Condition | Threshold | Evaluation Period | Description |
|---|---|---|---|---|
| Ejar Sync Failure Rate | `(sum(jobs.failed{job:ejar-sync}) / sum(jobs.completed{job:ejar-sync})) > 25%` | > 25% | 1 hour | High rate of failures when syncing with Ejar. |
| SADAD Callback Failure | `sum(http.server.requests{path:/webhooks/sadad, status:5xx}) > 10` | > 10 failures | 15 minutes | The SADAD webhook is failing to process. |
| Pod Crash Loop | `sum(kube_pod_container_status_restarts_total) > 5` | > 5 restarts | 10 minutes | A pod is continuously crashing and restarting. |
| Queue Length High | `avg(bullmq.queue.waiting) > 1000` | > 1000 jobs | 15 minutes | The background job queue is backed up. |

### SEV-3 (Medium - Notifies via Slack/Email)

| Alert Name | Condition | Threshold | Evaluation Period | Description |
|---|---|---|---|---|
| API Moderate Error Rate | `(sum(http.server.requests{status:5xx}) / sum(http.server.requests)) > 1%` | > 1% | 5 minutes | A noticeable increase in API errors. |
| Database CPU Moderate | `avg(aws.rds.cpuutilization) > 75%` | > 75% | 10 minutes | Database load is high. |
| Disk Space Low | `avg(host.disk.free) < 20%` | < 20% | 1 hour | Disk space is running low on a node. |
