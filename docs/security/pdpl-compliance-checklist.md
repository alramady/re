# PDPL Compliance Checklist — Munsiq Platform

This checklist outlines key requirements from the Saudi Personal Data Protection Law (PDPL) and maps them to controls within the Munsiq platform.

## Core Principles

| Principle | PDPL Article(s) | Munsiq Implementation | Status |
|---|---|---|---|
| **Lawfulness of Processing** | 5, 6 | Processing is based on user consent (for tenants) and contractual necessity (for property managers). | Implemented |
| **Purpose Limitation** | 12 | The purpose of data collection (property management) is clearly defined. Data is not used for other purposes. | Implemented |
| **Data Minimization** | 12 | We only collect data that is necessary for the defined purpose. | Implemented |
| **Accuracy** | 16 | Users (tenants, managers) can review and request corrections to their data. | Implemented |
| **Storage Limitation** | 18 | Data is retained only as long as necessary, as defined by our data retention policy. | To be Implemented |
| **Integrity & Confidentiality** | 19, 20 | Data is protected through encryption, access controls, and other security measures. | Implemented |

## Data Subject Rights

| Right | PDPL Article(s) | Munsiq Implementation | Status |
|---|---|---|---|
| **Right to be Informed** | 4, 12 | Privacy Policy is provided before data collection. | To be Written |
| **Right of Access** | 4, 9 | Tenants can access their profile, contracts, and payment history via their dashboard. | Implemented |
| **Right to Rectification** | 4, 10 | Users can request to update their profile information through support channels. | Implemented (Manual Process) |
| **Right to Erasure (Right to be Forgotten)** | 4, 11 | A process will be established to handle deletion requests, subject to legal and contractual retention requirements. | To be Implemented |
| **Right to Withdraw Consent** | 8 | Users can withdraw consent, which may result in termination of services. | To be Implemented |

## Controller Obligations

| Obligation | PDPL Article(s) | Munsiq Implementation | Status |
|---|---|---|---|
| **Obtain Consent** | 6, 7 | Explicit consent is obtained from tenants during the registration process. | Implemented (UI Flow) |
| **Privacy Policy** | 13 | A comprehensive, Arabic-language Privacy Policy will be created and made accessible. | To be Written |
| **Data Protection Officer (DPO)** | 30 | A DPO will be designated. (ASSUMPTION: Not required for MVP unless processing large volumes of sensitive data). | Deferred |
| **Data Breach Notification** | 20 | An incident response plan will be created, including a process for notifying the regulator (SDAIA) and data subjects within 72 hours. | To be Implemented (See `runbook-incident.md`) |
| **Privacy Impact Assessment (PIA)** | 21 | A PIA will be conducted before launching new features that involve high-risk processing of PII. | To be Conducted |
| **Records of Processing Activities (ROPA)** | 22 | This documentation package (Data Dictionary, Data Flow diagrams) serves as the basis for our ROPA. | Implemented |
| **Cross-Border Data Transfer** | 29 | All data is stored and processed within the AWS me-south-1 (Bahrain) region. No transfers outside KSA/GCC without adequate protection. | Implemented (Terraform) |

## Security Controls Mapping

| PDPL Requirement | Munsiq Control ID | Description |
|---|---|---|
| **Confidentiality** | DP-03, DP-04 | Encryption at rest and field-level encryption for PII. |
| **Integrity** | AC-01, AC-02, AC-03 | Authentication, authorization, and tenant-scoping of all data access. |
| **Availability** | NFR-AVAIL-001, NFR-AVAIL-003, NFR-AVAIL-004 | High uptime, backup, and recovery procedures. |
| **Audit** | LM-01 | Immutable audit logging of all sensitive operations. |
