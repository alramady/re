# Project Governance — Munsiq Platform

## 1. Governance Structure

| Body | Members | Frequency | Purpose |
|---|---|---|---|
| **Steering Committee** | Project Sponsor (CEO), PM, Tech Lead, Product Owner | Monthly | Provide strategic direction, approve major changes (scope, budget), and resolve high-level risks. |
| **Project Team Meeting** | PM, Tech Lead, QA Lead, DevOps, FE/BE Leads | Weekly | Review project progress, discuss tactical issues, and plan for the upcoming week. |
| **Daily Stand-up** | Full Development Team | Daily | Quick synchronization on progress, plans for the day, and blockers. |
| **Architectural Review Board** | Tech Lead, Senior Engineers | As Needed | Review and approve significant technical decisions (ADRs). |
| **Bug Triage Committee** | QA Lead, Tech Lead, Product Owner | Daily | Review, prioritize, and assign new defects. |

## 2. Communication Plan

| Communication | Audience | Frequency | Method | Owner |
|---|---|---|---|---|
| **Project Status Report** | Steering Committee, Stakeholders | Weekly | Email / Confluence | PM |
| **Sprint Review** | Stakeholders, Project Team | Bi-weekly | Live Demo | Product Owner |
| **Sprint Retrospective** | Project Team | Bi-weekly | Meeting | Scrum Master |
| **Incident Reports** | Stakeholders, Project Team | Per Incident | Email / Slack | Incident Commander |
| **Ad-hoc Updates** | Project Team | As Needed | Slack | All |

## 3. Change Management Process

No changes to the baseline scope, schedule, or budget are permitted without following this process.

1.  **Change Request Form**: The requester fills out a Change Request (CR) form, detailing the change, justification, and expected impact.
2.  **Initial Assessment**: The Product Owner and Tech Lead perform an initial assessment of the CR's impact on effort, schedule, and risk.
3.  **Review**: 
    -   **Minor Changes** (e.g., < 5 story points, no schedule impact): Reviewed and approved/rejected by the Product Owner.
    -   **Major Changes** (e.g., > 5 story points, impacts schedule/budget): Escalated to the Steering Committee for approval.
4.  **Implementation**: If approved, the change is added to the backlog and prioritized for a future sprint.
5.  **Communication**: The decision is communicated to the requester and all stakeholders.

## 4. Quality Management

- **Definition of Ready (DoR)**: A user story must meet these criteria before being accepted into a sprint:
  - Clear, concise, and testable.
  - Acceptance criteria are defined (in Gherkin).
  - Dependencies are identified.
  - Story points are estimated.
- **Definition of Done (DoD)**: A user story is considered "Done" only when:
  - See [definition-of-done.md](./definition-of-done.md)
- **Code Reviews**: All code must be reviewed by at least one other engineer before being merged. Pull Requests must be linked to a Jira ticket.
- **Automated Gates**: The CI pipeline enforces quality gates, including linting, unit tests, integration tests, and code coverage checks. A build will fail if any gate does not meet the minimum threshold.
