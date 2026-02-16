# Data Classification — Munsiq Platform

## 1. Classification Levels

| Level | Description | Impact if Compromised | Required Controls |
|---|---|---|---|
| **Restricted** | Highly sensitive data, including PII and financial details, protected by law (PDPL). Unauthorized disclosure could cause severe financial or reputational damage. | Severe | Field-level encryption, strict access control, audit logging, limited retention. |
| **Confidential** | Sensitive internal business data. Unauthorized disclosure could negatively impact the business, partners, or customers. | High | Encryption at rest & in transit, access control based on need-to-know. |
| **Internal** | Business data not intended for public disclosure. Disclosure would likely not cause material harm but is not desired. | Medium | Access control for authenticated users. |
| **Public** | Data that is openly available to the public. | Low | None. |

## 2. Data Classification Table

| Data Entity | Data Elements | Classification | Rationale | Encryption Requirement |
|---|---|---|---|---|
| **Tenant Profile** | `full_name`, `national_id`, `phone_number`, `email` | **Restricted** | Contains PII, subject to PDPL. | AES-256 Field-Level Encryption |
| **User Account** | `name`, `email`, `password_hash` | **Restricted** | Contains PII and authentication credentials. | AES-256 Field-Level Encryption (for PII), Bcrypt for hash. |
| **Lease Contract** | Tenant details, rent amount, payment terms | **Confidential** | Contains sensitive financial and personal agreement details. | Encryption at Rest (TDE) |
| **SADAD Invoice** | `sadad_bill_number`, amount, due date | **Confidential** | Financial transaction data linked to an individual. | Encryption at Rest (TDE) |
| **Payment Record** | Amount paid, date, reference number | **Confidential** | Financial transaction history. | Encryption at Rest (TDE) |
| **Property Details** | Address, owner (if stored), coordinates | **Internal** | Business operational data. Not public, but not highly sensitive. | Encryption at Rest (TDE) |
| **Unit Details** | Unit number, rent amount, status | **Internal** | Business operational data. | Encryption at Rest (TDE) |
| **Maintenance Request** | Description, tenant name, status | **Internal** | Operational data, may indirectly link to a person. | Encryption at Rest (TDE) |
| **Audit Log** | User ID, action, IP address, timestamp | **Confidential** | Security-sensitive information used for forensics. | Encryption at Rest (TDE) |
| **System Configuration** | API keys, secret keys, database credentials | **Restricted** | Critical infrastructure secrets. Unauthorized access leads to system compromise. | AWS Secrets Manager / Vault |
| **Uploaded Documents** | Lease PDFs, ID copies, property deeds | **Restricted** | Can contain highly sensitive PII and legal information. | S3 Server-Side Encryption (SSE-KMS) |
| **Public Website Content** | Marketing pages, general info | **Public** | Intended for public consumption. | N/A |

## 3. Handling Guidelines

- **Restricted Data**: Must NEVER be logged in plain text. Must not be transferred to non-production environments without masking or tokenization. Access must be logged and audited on a per-record basis.
- **Confidential Data**: Can be used in staging environments with proper access controls. Logging should be minimal and avoid exposing sensitive values.
- **Internal Data**: Can be used freely in non-production environments.
- **All Data**: Must be transmitted over encrypted channels (TLS 1.3).
