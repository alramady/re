# Threat Model — Munsiq Platform

This document uses the STRIDE methodology to identify and categorize threats.

## 1. External System Dependencies

| System | Threat (STRIDE) | Scenario | Mitigation |
|---|---|---|---|
| **Ejar API** | **D**enial of Service | Ejar API is unavailable, preventing contract synchronization. | Asynchronous queue-based processing with retries and circuit breakers (ADR-0004). Alerting on high failure rates. |
| | **T**ampering | A man-in-the-middle (MITM) attacker modifies contract data in transit. | Enforce TLS 1.3 for all outbound connections. Validate server certificates. |
| | **I**nformation Disclosure | Ejar API response containing sensitive data is intercepted. | Enforce TLS 1.3. |
| **SADAD API** | **D**enial of Service | SADAD payment gateway is down, preventing payment processing. | Asynchronous processing. Cache payment callbacks. Alerting on gateway unavailability. |
| | **S**poofing | An attacker sends a fake payment confirmation webhook to our API. | IP address whitelisting for the webhook source. If supported by SADAD, implement signature validation on webhook payloads. |
| **Nafath** | **D**enial of Service | Nafath service is unavailable, preventing new tenant verification. | Graceful degradation: allow tenant creation but block contract association until verified. |
| **AWS S3** | **T**ampering / **I**nformation Disclosure | An attacker gains unauthorized access to the S3 bucket containing documents. | Bucket policies restricting access to the application IAM role only. Server-side encryption (SSE-KMS). Public access blocked. |

## 2. Application Components

| Component | Threat (STRIDE) | Scenario | Mitigation |
|---|---|---|---|
| **Web Application (PWA)** | **S**poofing (Phishing) | An attacker creates a fake version of the Munsiq website to steal credentials. | Use HTTPS with a valid certificate. Educate users. Implement Content Security Policy (CSP). |
| | **I**nformation Disclosure (XSS) | An attacker injects a malicious script into a form field (e.g., property name), which then executes in another user's browser, stealing their session token. | Input validation on the server-side. Output encoding in the frontend (React automatically helps). Implement a strict CSP. |
| **API Application** | **T**ampering | An unauthenticated user attempts to modify a resource. | All endpoints (except login/webhooks) protected by JWT authentication. |
| | **E**levation of Privilege | A user with a `Tenant` role attempts to access an admin-only endpoint (e.g., `/users`). | Role-Based Access Control (RBAC) middleware/guards on every endpoint, checking user's role against required permissions. |
| | **E**levation of Privilege (IDOR) | An authenticated `Tenant` (`tenant_A`) changes the ID in an API call (`/contracts/{id}`) to view the contract of `tenant_B`. | All database queries must be scoped to the `tenant_id` associated with the authenticated user's JWT. **This is the most critical security control in a multi-tenant app.** |
| | **D**enial of Service | An attacker floods an API endpoint with a high volume of requests. | Implement rate limiting per user and per IP address. Use HPA to scale out pods under load. |
| | **I**nformation Disclosure (SQL Injection) | An attacker crafts a malicious input in a search query to extract data from the database. | Use a modern ORM (like Prisma or TypeORM) that uses parameterized queries. Avoid raw SQL queries with string concatenation. |
| **Database (PostgreSQL)** | **I**nformation Disclosure | A database administrator or an attacker with DB access reads PII of tenants. | Implement field-level encryption for all `Restricted` data elements (e.g., `full_name_encrypted`). Use AWS KMS for key management. |
| | **T**ampering | An attacker with DB access modifies financial records. | Strict access controls to the database. Regular backups (Point-in-Time Recovery). Audit logging of sensitive data access. |

## 3. Authentication Flow

| Flow | Threat (STRIDE) | Scenario | Mitigation |
|---|---|---|---|
| **Login** | **S**poofing (Credential Stuffing) | An attacker uses a list of breached passwords to try and log in to user accounts. | Implement account lockout after a number of failed attempts. Enforce Multi-Factor Authentication (MFA). |
| **JWT Handling** | **I**nformation Disclosure | A JWT is stolen via XSS or MITM. | Use short-lived access tokens (15 mins). Store tokens securely (HttpOnly cookies). Enforce HTTPS. |
| **Password Reset** | **E**levation of Privilege | An attacker requests a password reset for another user's account and intercepts the reset link. | Send reset links to the user's registered email only. Ensure reset tokens are single-use and expire quickly (e.g., 1 hour). |
