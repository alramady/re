# Release Plan — Munsiq Platform MVP v1.0

## 1. Release Goal

The goal of the v1.0 release is to launch the Munsiq MVP to the public, providing core functionality for property, tenant, contract, and payment management to our initial set of pilot customers.

## 2. Release Timeline & Milestones

| Milestone | Target Date | Owner | Key Activities |
|---|---|---|---|
| **Feature Freeze** | 2026-05-15 | Tech Lead | No new features are added to the release. Only bug fixes are permitted. |
| **UAT Start** | 2026-05-18 | QA Lead | User Acceptance Testing begins with pilot customers. |
| **UAT Sign-off** | 2026-06-05 | Product Owner | All critical and major UAT defects are resolved. PO signs off on the release. |
| **Performance Testing** | 2026-06-12 | DevOps Lead | Final load and stress tests are completed on the staging environment. |
| **Go/No-Go Decision** | 2026-06-19 | Project Sponsor | Final decision meeting with all stakeholders to approve the production launch. |
| **Production Deployment** | 2026-06-22 (2:00 AM AST) | DevOps Lead | The application is deployed to the production environment during a low-traffic window. |
| **Post-Launch Hypercare** | 2026-06-22 to 2026-07-06 | PM | A dedicated team is on standby to address any immediate production issues. |

## 3. Scope of Release

This release includes all user stories planned for Sprints 1 through 5.

- **Total Story Points**: 139
- **Key Features**:
  - User Authentication with RBAC
  - Property & Unit Management
  - Tenant Onboarding with Nafath Verification
  - Ejar-compliant Contract Creation and Synchronization
  - SADAD Invoice Generation and Payment Processing
  - Basic Maintenance Request Workflow
  - Financial and Occupancy Reports (PDF/Excel)

## 4. Go-Live Checklist

| Item | Status | Owner | Notes |
|---|---|---|---|
| All P1/P2 bugs fixed | ☐ | QA Lead | |
| UAT completed and signed off | ☐ | Product Owner | |
| Performance tests passed | ☐ | DevOps Lead | |
| Production infrastructure provisioned (Terraform) | ☑ | DevOps Lead | |
| Production database backups configured and tested | ☑ | DevOps Lead | |
| Monitoring and alerts configured for production | ☐ | DevOps Lead | |
| Deployment runbook finalized | ☑ | DevOps Lead | |
| Incident response runbook finalized | ☑ | Tech Lead | |
| Rollback plan tested | ☐ | DevOps Lead | |
| Stakeholder communication plan ready | ☐ | PM | |
| **Final Go/No-Go Approval** | ☐ | Project Sponsor | |

## 5. Release Team

| Role | Name |
|---|---|
| **Project Manager** | PMO Lead |
| **Product Owner** | Product Manager |
| **Tech Lead / Architect** | Tech Lead |
| **Deployment Lead** | DevOps Engineer |
| **QA Lead** | QA Lead |
