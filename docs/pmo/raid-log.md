# RAID Log — Munsiq Platform MVP

## Risks

| ID | Risk Description | Probability (1-5) | Impact (1-5) | Score | Owner | Mitigation Strategy |
|---|---|---|---|---|---|---|
| **R-01** | Delay in getting Ejar API sandbox access. | 4 | 5 | 20 | BE Lead | Start development with a mocked Ejar API. Escalate with the Ministry of Housing contact weekly. |
| **R-02** | SADAD merchant account activation takes longer than 6 weeks. | 3 | 4 | 12 | PM | Start the application process in Week 1. Prepare to launch with manual payment reconciliation as a backup. |
| **R-03** | Performance of the multi-tenant database degrades under load. | 2 | 4 | 8 | Architect | Conduct early performance testing. Optimize critical queries. Plan for a potential move to a larger DB instance. |
| **R-04** | Key team members leave the project. | 2 | 5 | 10 | PM | Ensure knowledge sharing and comprehensive documentation. Maintain a list of potential backup candidates. |
| **R-05** | Scope creep from stakeholders requesting new features for MVP. | 4 | 3 | 12 | PM | Strictly enforce the defined scope. All new requests must go through a formal change control process and be deferred to v2.0. |

## Assumptions

| ID | Assumption | Impact if False | Owner | Validation Plan |
|---|---|---|---|---|
| **A-01** | The Ejar API provides all necessary functionality for contract lifecycle management. | Major rework of the contract module. | BE Lead | Review the final Ejar API documentation by end of Sprint 1. |
| **A-02** | The chosen tech stack (NestJS, Next.js) is suitable for the project requirements. | Potential performance or scalability issues. | Architect | Build a proof-of-concept for a critical flow in Sprint 0. |
| **A-03** | Team has the required skills to deliver the project. | Delays and quality issues. | PM | Conduct a skills gap analysis. Arrange for training if needed. |

## Issues

| ID | Issue Description | Date Raised | Owner | Status | Resolution |
|---|---|---|---|---|---|
| **I-01** | The UX design for the reporting dashboard is unclear. | 2026-02-25 | UX Designer | **Open** | Schedule a workshop with the Accountant persona stakeholder to clarify requirements. |
| **I-02** | The CI pipeline is failing on the integration test step. | 2026-03-10 | DevOps | **Closed** | The in-memory database was not being seeded correctly. Fixed the test setup script. |

## Dependencies

| ID | Dependency Description | Provider | Due Date | Status |
|---|---|---|---|---|
| **D-01** | Finalized branding guidelines and logo assets. | Marketing Dept. | 2026-03-01 | **Completed** |
| **D-02** | Ejar API credentials and documentation. | Ministry of Housing | 2026-03-15 | **Pending** |
| **D-03** | SADAD merchant account credentials. | SAMA / Bank | 2026-04-01 | **In Progress** |
