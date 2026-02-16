_# Security Controls Checklist — Munsiq Platform

This checklist maps security controls to NFRs and threat model mitigations.

## Access Control

| Control ID | Description | NFR Ref | Threat Model Ref | Implementation Status |
|---|---|---|---|---|
| AC-01 | Enforce JWT-based authentication for all state-changing API endpoints. | NFR-SEC-001 | API Tampering | Implemented (Middleware) |
| AC-02 | Implement Role-Based Access Control (RBAC) on all endpoints. | NFR-SEC-001 | API Elevation of Privilege | Implemented (NestJS Guards) |
| AC-03 | Scope all database queries to the authenticated user's tenant ID. | N/A | IDOR | **CRITICAL** - To be enforced in all services |
| AC-04 | Implement account lockout policy (5 failed attempts / 30 mins). | NFR-SEC-008 | Credential Stuffing | To be Implemented |
| AC-05 | Enforce Multi-Factor Authentication (MFA) via OTP. | NFR-SEC-008 | Credential Stuffing | To be Implemented |
| AC-06 | Use short-lived access tokens (15 min) and longer-lived refresh tokens (7 days). | NFR-SEC-006 | Stolen JWT | Implemented (Config) |

## Data Protection

| Control ID | Description | NFR Ref | Threat Model Ref | Implementation Status |
|---|---|---|---|---|
| DP-01 | Enforce TLS 1.3 for all data in transit (internal and external). | NFR-SEC-001 | MITM | Implemented (Ingress Config) |
| DP-02 | Enable encryption at rest for the PostgreSQL database (AWS TDE). | NFR-SEC-002 | DB Info Disclosure | Implemented (Terraform) |
| DP-03 | Enable server-side encryption (SSE-KMS) for the S3 documents bucket. | NFR-SEC-002 | S3 Info Disclosure | Implemented (Terraform) |
| DP-04 | Implement application-level, field-level encryption for all `Restricted` PII. | NFR-SEC-003, NFR-PRIV-001 | DB Info Disclosure | To be Implemented (Encryption Service) |
| DP-05 | Use a secure secrets management solution (AWS Secrets Manager) for all credentials. | NFR-SEC-009 | Hardcoded Secrets | To be Implemented |

## Input Validation & Output Encoding

| Control ID | Description | NFR Ref | Threat Model Ref | Implementation Status |
|---|---|---|---|---|
| IV-01 | Validate all incoming request bodies and parameters using DTOs and class-validator. | N/A | SQL Injection, XSS | Implemented (NestJS Pipes) |
| IV-02 | Use a modern ORM (Prisma/TypeORM) that prevents SQL injection. | N/A | SQL Injection | Implemented (Architecture) |
| OE-01 | Ensure frontend framework (React) automatically encodes output to prevent XSS. | NFR-A11Y-001 | XSS | Implemented (Architecture) |
| OE-02 | Implement a strict Content Security Policy (CSP). | N/A | XSS | To be Implemented |

## Logging & Monitoring

| Control ID | Description | NFR Ref | Threat Model Ref | Implementation Status |
|---|---|---|---|---|
| LM-01 | Log all CUD operations and authentication events to an immutable audit trail. | NFR-SEC-008 | N/A | Implemented (Audit Service) |
| LM-02 | Monitor application performance and errors using an APM tool (e.g., Datadog). | NFR-PERF-001 | N/A | To be Implemented |
| LM-03 | Set up alerts for high failure rates on critical dependencies (Ejar, SADAD). | NFR-AVAIL-001 | DoS | To be Implemented |

## Secure Configuration & Deployment

| Control ID | Description | NFR Ref | Threat Model Ref | Implementation Status |
|---|---|---|---|---|
| CD-01 | Run automated dependency vulnerability scans (Snyk) in the CI pipeline. | NFR-SEC-005 | Vulnerable Dependencies | Implemented (CI/CD) |
| CD-02 | Run automated container image vulnerability scans (Trivy) in the CI pipeline. | NFR-SEC-005 | Vulnerable Dependencies | Implemented (CI/CD) |
| CD-03 | Implement IP whitelisting for incoming webhooks (SADAD). | N/A | Webhook Spoofing | To be Implemented (Ingress Config) |
| CD-04 | Block all public access to S3 buckets and other data stores. | N/A | S3 Info Disclosure | Implemented (Terraform) |
| CD-05 | Perform regular penetration testing (annual). | NFR-SEC-010 | N/A | To be Scheduled |
