# Work Breakdown Structure (WBS) — Munsiq Platform MVP

| WBS Code | Level | Task Name | Description |
|---|---|---|---|
| **1.0** | 1 | **Project Management** | Overall planning, coordination, and control of the project. |
| 1.1 | 2 | Project Planning | Develop project charter, WBS, schedule, and budget. |
| 1.2 | 2 | Stakeholder Communication | Regular status reporting and meetings. |
| 1.3 | 2 | Risk Management | Identify, analyze, and mitigate project risks. |
| 1.4 | 2 | Project Closure | Final reporting and lessons learned. |
| **2.0** | 1 | **Requirements & Design** | Define and design the system. |
| 2.1 | 2 | Requirements Gathering | Elicit and document all functional and non-functional requirements. |
| 2.2 | 2 | Architecture & Design | Create HLD, LLD, C4 diagrams, and ADRs. |
| 2.3 | 2 | UI/UX Design | Create wireframes, mockups, and prototypes. |
| **3.0** | 1 | **Development (Sprints 1-5)** | Implementation of the application features. |
| 3.1 | 2 | Backend Development | Build the NestJS API, services, and database schema. |
| 3.1.1 | 3 | Auth & User Management | Implement login, RBAC, and user administration. |
| 3.1.2 | 3 | Property & Unit Management | Implement property and unit CRUD operations. |
| 3.1.3 | 3 | Tenant & Verification | Implement tenant management and Nafath integration. |
| 3.1.4 | 3 | Contract Management | Implement contract lifecycle and Ejar integration. |
| 3.1.5 | 3 | Payment Processing | Implement invoicing, SADAD integration, and payment tracking. |
| 3.1.6 | 3 | Maintenance Module | Implement maintenance request workflow. |
| 3.1.7 | 3 | Reporting & Notifications | Implement report generation and notification dispatch. |
| 3.2 | 2 | Frontend Development | Build the Next.js PWA. |
| 3.2.1 | 3 | UI Components & Layout | Implement the design system and page layouts. |
| 3.2.2 | 3 | Feature Implementation | Connect UI to backend APIs for all modules. |
| 3.2.3 | 3 | State Management | Implement client-side state management. |
| **4.0** | 1 | **Infrastructure & DevOps** | Set up and manage the deployment infrastructure. |
| 4.1 | 2 | Infrastructure as Code (IaC) | Create Terraform scripts for AWS resources (VPC, EKS, RDS). |
| 4.2 | 2 | CI/CD Pipeline | Create GitHub Actions workflows for build, test, and deploy. |
| 4.3 | 2 | Containerization | Create Dockerfiles for all application services. |
| 4.4 | 2 | Monitoring & Logging | Set up Datadog/CloudWatch dashboards and alerts. |
| **5.0** | 1 | **Testing & Quality Assurance** | Ensure the quality and correctness of the application. |
| 5.1 | 2 | Test Planning | Create the overall test strategy and plan. |
| 5.2 | 2 | Unit & Integration Testing | Write and maintain automated tests (Jest/Vitest). |
| 5.3 | 2 | End-to-End (E2E) Testing | Write and maintain automated E2E tests (Cypress). |
| 5.4 | 2 | Performance Testing | Plan and execute load tests (k6). |
| 5.5 | 2 | Security Testing | Conduct vulnerability scans and penetration testing. |
| 5.6 | 2 | User Acceptance Testing (UAT) | Coordinate UAT with stakeholders. |
| **6.0** | 1 | **Deployment & Go-Live** | Release the application to production. |
| 6.1 | 2 | Staging Deployment | Deploy and validate the application in the staging environment. |
| 6.2 | 2 | Production Deployment | Deploy the application to the production environment. |
| 6.3 | 2 | Data Migration | (If applicable) Migrate any initial data to production. |
| 6.4 | 2 | Post-Go-Live Support | Provide hypercare support for a period after launch. |
