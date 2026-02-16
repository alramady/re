# Munsiq Platform — Documentation Package File Tree

**Total Files: 62** | **Generated: 2026-02-16**

```
docs/
├── ASSUMPTIONS.md                              # Assumptions & open questions log
├── FILE-TREE.md                                # This file
│
├── requirements/                               # 1. Requirements & Specifications
│   ├── vision-scope.md                         #    Vision, scope (In/Out), constraints
│   ├── stakeholders-raci.md                    #    Stakeholder register & RACI matrix
│   ├── personas-usecases.md                    #    Personas & use case tables
│   ├── srs.md                                  #    Software Requirements Specification (IEEE-style)
│   ├── functional-requirements.md              #    Functional requirements (FR table with IDs)
│   ├── nonfunctional-requirements.md           #    Non-functional requirements (NFR table)
│   ├── user-stories.md                         #    Product backlog (user stories)
│   ├── acceptance-criteria.feature             #    Gherkin acceptance criteria
│   └── traceability-matrix.md                  #    REQ ↔ Design ↔ API ↔ Tests ↔ Release
│
├── architecture/                               # 2. Architecture & Design
│   ├── context.mmd / context.png               #    C4 Context diagram
│   ├── container.mmd / container.png           #    C4 Container diagram
│   ├── component.mmd / component.png           #    C4 Component diagram
│   ├── sequence-critical-flows.mmd / .png      #    Sequence diagrams (critical flows)
│   ├── hld.md                                  #    High-Level Design (tables + diagrams)
│   ├── data-classification.md                  #    Data classification policy
│   ├── lld/                                    #    Low-Level Design (per service)
│   │   ├── lld-property-service.md
│   │   ├── lld-tenant-service.md
│   │   ├── lld-contract-service.md
│   │   ├── lld-payment-service.md
│   │   └── lld-notification-service.md
│   └── adrs/                                   #    Architecture Decision Records
│       ├── ADR-0001-template.md
│       ├── ADR-0002-multi-tenancy-strategy.md
│       ├── ADR-0003-event-driven-payments.md
│       └── ADR-0004-ejar-integration-pattern.md
│
├── api/                                        # 3. API Specifications
│   ├── openapi.yaml                            #    OpenAPI 3.0 spec
│   └── api-governance.md                       #    API governance & standards
│
├── data-model/                                 # 4. Data Model
│   ├── erd.mmd / erd.png                       #    Entity-Relationship Diagram
│   ├── ddl.sql                                 #    PostgreSQL DDL (schema creation)
│   ├── seed.sql                                #    Seed data for development/staging
│   └── data-dictionary.md                      #    Data dictionary (all tables & columns)
│
├── devops/                                     # 5. DevOps & Infrastructure
│   ├── docker/
│   │   ├── Dockerfile.api                      #    Docker image for NestJS API
│   │   └── Dockerfile.web                      #    Docker image for Next.js Web App
│   ├── k8s/
│   │   ├── namespace.yaml
│   │   ├── deployment-api.yaml
│   │   ├── deployment-web.yaml
│   │   ├── service.yaml
│   │   ├── ingress.yaml
│   │   ├── hpa.yaml
│   │   └── configmap.yaml
│   ├── ci-cd/
│   │   ├── ci.yml                              #    GitHub Actions CI pipeline
│   │   └── cd.yml                              #    GitHub Actions CD pipeline
│   └── iac/
│       └── main.tf                             #    Terraform IaC (AWS: VPC, EKS, RDS, S3)
│
├── security/                                   # 6. Security
│   ├── threat-model.md                         #    STRIDE threat model
│   ├── security-controls.md                    #    Security controls checklist
│   └── pdpl-compliance-checklist.md            #    Saudi PDPL compliance checklist
│
├── testing/                                    # 7. Testing & QA
│   ├── test-strategy.md                        #    Overall test strategy
│   ├── test-cases/
│   │   ├── tc-auth.md                          #    Test cases: Authentication
│   │   ├── tc-contracts.md                     #    Test cases: Contracts
│   │   └── tc-payments.md                      #    Test cases: Payments
│   └── performance/
│       ├── load-test-plan.md                   #    Performance test plan
│       └── k6-script.js                        #    k6 load test script
│
├── operations/                                 # 8. Operations & Runbooks
│   ├── runbook-deployment.md                   #    Deployment runbook
│   ├── runbook-incident.md                     #    Incident response runbook
│   ├── monitoring-alerts.md                    #    Monitoring dashboards & alert policies
│   └── backup-recovery.md                      #    Backup & recovery procedures
│
└── pmo/                                        # 9. Project Management Office
    ├── project-charter.md                      #    Project charter
    ├── wbs.md                                  #    Work Breakdown Structure
    ├── raid-log.md                             #    Risks, Assumptions, Issues, Dependencies
    ├── release-plan.md                         #    Release plan & go-live checklist
    ├── governance.md                           #    Governance structure & change management
    └── definition-of-done.md                   #    Definition of Done (DoD)
```
