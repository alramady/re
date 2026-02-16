# Project Charter: Munsiq Platform MVP

| Field | Value |
|---|---|
| **Project Name** | Munsiq Platform - Minimum Viable Product (MVP) |
| **Project ID** | MUN-MVP-001 |
| **Date** | 2026-02-16 |
| **Project Sponsor** | CEO, Munsiq Corp. |
| **Project Manager** | PMO Lead |

## 1. Project Vision & Justification

- **Vision**: To become the leading real estate management SaaS platform in Saudi Arabia by simplifying operations for property managers and enhancing the experience for tenants.
- **Justification**: The current market relies on outdated methods (spreadsheets, manual follow-ups). A modern, Ejar-integrated platform will provide significant efficiency gains, reduce payment delays, and offer a competitive advantage.

## 2. Project Scope

- **In-Scope**: See [vision-scope.md](../requirements/vision-scope.md#in-scope-mvp)
- **Out-of-Scope**: See [vision-scope.md](../requirements/vision-scope.md#out-of-scope-mvp)

## 3. High-Level Requirements

- A multi-tenant SaaS web application (PWA).
- Modules for property, tenant, contract, payment, and maintenance management.
- Integration with Ejar, SADAD, and Nafath.
- Role-based access control for different user personas.
- Bilingual support (Arabic & English).
- Compliance with PDPL.

## 4. Key Deliverables

| Deliverable | Description |
|---|---|
| **Deployed Platform** | A live, production-ready SaaS application accessible at `munsiq.sa`. |
| **Source Code** | Complete source code hosted in a private GitHub repository. |
| **Technical Documentation** | The full set of documents generated in this `docs/` folder. |
| **Infrastructure as Code** | Terraform scripts to provision the entire AWS infrastructure. |
| **CI/CD Pipelines** | Automated pipelines for building, testing, and deploying the application. |

## 5. High-Level Milestones & Timeline

| Milestone | Estimated Completion Date | Duration |
|---|---|---|
| **Project Kick-off & Planning** | 2026-02-20 | 1 Week |
| **Sprint 1-2: Core & Auth** | 2026-03-20 | 4 Weeks |
| **Sprint 3-4: Contracts & Payments** | 2026-04-17 | 4 Weeks |
| **Sprint 5: Maintenance & Reporting** | 2026-05-01 | 2 Weeks |
| **Internal Alpha & UAT** | 2026-05-29 | 4 Weeks |
| **Staging Deployment & Perf Testing** | 2026-06-12 | 2 Weeks |
| **Production Go-Live** | 2026-06-26 | 2 Weeks |
| **Project Closure** | 2026-07-03 | 1 Week |
| **Total Estimated Duration** | | **~20 Weeks** |

## 6. Budget

| Category | Estimated Cost (SAR) |
|---|---|
| **Personnel** (12 team members x 5 months) | 600,000 |
| **AWS Infrastructure** (EKS, RDS, etc.) | 120,000 |
| **Third-Party Services** (Twilio, Google Maps) | 30,000 |
| **Contingency** (10%) | 50,000 |
| **Total Estimated Budget** | **800,000** |

## 7. Key Stakeholders

- See [stakeholders-raci.md](../requirements/stakeholders-raci.md)

## 8. Assumptions & Constraints

- See [ASSUMPTIONS.md](../ASSUMPTIONS.md)
- See [vision-scope.md](../requirements/vision-scope.md#constraints)

## 9. Project Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| **Project Sponsor** | (CEO Name) | --- | --- |
| **Project Manager** | (PMO Lead Name) | --- | --- |
