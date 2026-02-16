# Runbook: Incident Response

| Field | Value |
|---|---|
| **Runbook ID** | RB-INCIDENT-001 |
| **Owner** | Tech Lead |
| **Last Updated** | 2026-02-16 |

## 1. Objective

To provide a structured process for responding to, managing, and resolving incidents in the production environment, minimizing impact and restoring service as quickly as possible.

## 2. Incident Severity Levels

| Severity | Name | Description | Response Time | Resolution Target |
|---|---|---|---|---|
| **SEV-1** | Critical | System-wide outage, major data loss, critical security breach. Affects all users. | **Immediate** (On-call paged) | < 1 hour |
| **SEV-2** | High | A major feature is unavailable or severely degraded. Affects a large subset of users. | < 15 minutes | < 4 hours |
| **SEV-3** | Medium | A non-critical feature is unavailable or degraded. Minor impact on users. | < 1 hour (Business hours) | < 24 hours |
| **SEV-4** | Low | Minor bug, cosmetic issue. No significant impact on functionality. | < 24 hours (Business hours) | Next sprint |

## 3. Roles & Responsibilities

- **Incident Commander (IC)**: The person in charge of the incident. Responsible for coordinating the response, communication, and resolution. (Typically the on-call engineer).
- **Communications Lead**: Responsible for all internal and external communications about the incident.
- **Technical Lead(s)**: Subject matter experts responsible for investigating and implementing the fix.

## 4. Incident Response Workflow

### Step 1: Detection & Alerting

- **Detection**: Incidents are detected via automated monitoring (Datadog, CloudWatch alerts), user reports, or internal discovery.
- **Alerting**: A SEV-1 or SEV-2 alert automatically pages the on-call engineer via PagerDuty.

### Step 2: Triage & Declaration

1.  **Acknowledge Alert**: The on-call engineer acknowledges the page.
2.  **Assess Impact**: Quickly assess the impact and determine the severity level.
3.  **Declare Incident**: If SEV-1 or SEV-2, the on-call engineer becomes the Incident Commander and declares an incident.
    - Create a dedicated Slack channel (e.g., `#incident-20260216-api-outage`).
    - Start a video conference bridge (e.g., Zoom, Google Meet).
    - Create a Jira ticket for the incident.

### Step 3: Investigation & Diagnosis

1.  **Assemble Team**: The IC assembles the necessary technical leads (backend, frontend, DevOps).
2.  **Investigate**: The team works together to find the root cause.
    - Check monitoring dashboards (latency, error rates, CPU/memory).
    - Check logs (ELK, CloudWatch Log Insights).
    - Check recent deployments or configuration changes.
3.  **Formulate Hypothesis**: Develop a theory about the cause of the incident.

### Step 4: Mitigation & Resolution

1.  **Identify Fix**: Determine the action needed to resolve the incident. The priority is to restore service, not necessarily to find the perfect fix.
    - **Examples**: Roll back a recent deployment, restart a service, scale up resources, apply a hotfix.
2.  **Apply Fix**: The technical lead applies the fix.
3.  **Verify Resolution**: The IC verifies that the system has returned to a normal state and the impact has ended.
4.  **Declare Resolution**: The IC declares the incident resolved.

### Step 5: Post-Incident

1.  **Communication**: The Communications Lead sends a final update to stakeholders.
2.  **Post-Mortem**: A blameless post-mortem meeting is scheduled within 48 hours for all SEV-1 and SEV-2 incidents.
3.  **Action Items**: The post-mortem results in actionable follow-up tasks to prevent the incident from recurring.
