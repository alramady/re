# Requirements Traceability Matrix — Munsiq

| REQ ID | User Story | Use Case | Design (HLD/LLD) | API Endpoint | DB Table | Test Case | Release |
|--------|-----------|----------|-------------------|-------------|----------|-----------|---------|
| FR-AUTH-001 | US-005 | UC-015 | HLD-AUTH, LLD-Auth | POST /api/v1/auth/login | users, sessions | TC-AUTH-001 | v1.0 S1 |
| FR-AUTH-002 | US-005 | UC-015 | HLD-AUTH, LLD-Auth | POST /api/v1/auth/verify-otp | users, otp_codes | TC-AUTH-002 | v1.0 S1 |
| FR-AUTH-003 | US-004 | UC-015 | HLD-AUTH, LLD-Auth | — (middleware) | users, roles, permissions | TC-AUTH-003 | v1.0 S1 |
| FR-AUTH-004 | US-004 | UC-015 | HLD-AUTH, LLD-Auth | CRUD /api/v1/users | users | TC-AUTH-004 | v1.0 S1 |
| FR-AUTH-005 | US-020 | UC-020 | HLD-AUTH, LLD-Auth | GET /api/v1/audit-logs | audit_logs | TC-AUTH-005 | v1.0 S2 |
| FR-AUTH-006 | US-005 | UC-015 | HLD-AUTH, LLD-Auth | POST /api/v1/auth/login | users | TC-AUTH-006 | v1.0 S1 |
| FR-PROP-001 | US-001 | UC-001 | HLD-PROP, LLD-Property | POST /api/v1/properties | properties | TC-PROP-001 | v1.0 S1 |
| FR-PROP-002 | US-002 | UC-002 | HLD-PROP, LLD-Property | POST /api/v1/properties/{id}/units | units | TC-PROP-002 | v1.0 S1 |
| FR-PROP-003 | US-003 | UC-001 | HLD-PROP, LLD-Property | GET /api/v1/properties?search= | properties | TC-PROP-003 | v1.0 S1 |
| FR-PROP-004 | US-023 | UC-001 | HLD-PROP, LLD-Property | GET /api/v1/properties/{id} | properties | TC-PROP-004 | v1.0 S1 |
| FR-PROP-005 | US-021 | UC-018 | HLD-PROP, LLD-Property | POST /api/v1/properties/{id}/documents | documents | TC-PROP-005 | v1.0 S3 |
| FR-TNT-001 | US-006 | UC-003 | HLD-TNT, LLD-Tenant | POST /api/v1/tenants | tenants | TC-TNT-001 | v1.0 S2 |
| FR-TNT-002 | US-007 | UC-004 | HLD-TNT, LLD-Tenant | POST /api/v1/tenants/{id}/verify-nafath | tenants | TC-TNT-002 | v1.0 S2 |
| FR-TNT-003 | US-006 | UC-003 | HLD-TNT, LLD-Tenant | GET /api/v1/tenants/{id} | tenants, contracts, payments | TC-TNT-003 | v1.0 S2 |
| FR-CNTR-001 | US-008 | UC-005 | HLD-CNTR, LLD-Contract | POST /api/v1/contracts | contracts, installments | TC-CNTR-001 | v1.0 S2 |
| FR-CNTR-002 | US-008 | UC-005 | HLD-CNTR, LLD-Contract | POST /api/v1/contracts (validation) | contracts | TC-CNTR-002 | v1.0 S2 |
| FR-CNTR-003 | US-009 | UC-006 | HLD-CNTR, LLD-Contract | POST /api/v1/contracts/{id}/sync-ejar | contracts | TC-CNTR-003 | v1.0 S3 |
| FR-CNTR-004 | US-009 | UC-006 | HLD-CNTR, LLD-Contract | Webhook /api/v1/webhooks/ejar | contracts | TC-CNTR-004 | v1.0 S3 |
| FR-CNTR-005 | US-008 | UC-007 | HLD-CNTR, LLD-Contract | — (auto-generated) | installments | TC-CNTR-005 | v1.0 S2 |
| FR-CNTR-006 | US-017 | UC-013 | HLD-CNTR, LLD-Contract | POST /api/v1/contracts/{id}/renew | contracts | TC-CNTR-006 | v1.0 S4 |
| FR-CNTR-007 | US-018 | UC-014 | HLD-CNTR, LLD-Contract | POST /api/v1/contracts/{id}/terminate | contracts | TC-CNTR-007 | v1.0 S5 |
| FR-PAY-001 | US-010 | UC-007 | HLD-PAY, LLD-Payment | POST /api/v1/invoices/generate-sadad | invoices | TC-PAY-001 | v1.0 S3 |
| FR-PAY-002 | US-011 | UC-008 | HLD-PAY, LLD-Payment | Webhook /api/v1/webhooks/sadad | payments, invoices | TC-PAY-002 | v1.0 S3 |
| FR-PAY-003 | US-011 | UC-008 | HLD-PAY, LLD-Payment | GET /api/v1/payments/{id}/receipt | payments | TC-PAY-003 | v1.0 S3 |
| FR-PAY-004 | US-029 | UC-007 | HLD-PAY, LLD-Payment | — (scheduled job) | invoices, penalties | TC-PAY-004 | v1.0 S3 |
| FR-PAY-005 | US-012 | UC-019 | HLD-PAY, LLD-Payment | GET /api/v1/tenants/{id}/payments | payments | TC-PAY-005 | v1.0 S4 |
| FR-MAINT-001 | US-013 | UC-009 | HLD-MAINT, LLD-Maint | POST /api/v1/maintenance-requests | maintenance_requests | TC-MAINT-001 | v1.0 S4 |
| FR-MAINT-002 | US-014 | UC-010 | HLD-MAINT, LLD-Maint | PATCH /api/v1/maintenance-requests/{id} | maintenance_requests | TC-MAINT-002 | v1.0 S4 |
| FR-MAINT-003 | US-014 | UC-010 | HLD-MAINT, LLD-Maint | PATCH /api/v1/maintenance-requests/{id} | maintenance_requests | TC-MAINT-003 | v1.0 S4 |
| FR-RPT-001 | US-016 | UC-012 | HLD-RPT, LLD-Report | GET /api/v1/reports/financial | invoices, payments | TC-RPT-001 | v1.0 S5 |
| FR-RPT-003 | US-026 | UC-012 | HLD-RPT, LLD-Report | GET /api/v1/reports/{id}/export | — | TC-RPT-002 | v1.0 S5 |
| FR-NOTIF-001 | US-019 | UC-016 | HLD-NOTIF, LLD-Notif | — (BullMQ job) | notifications | TC-NOTIF-001 | v1.0 S4 |
| FR-NOTIF-002 | US-019 | UC-016 | HLD-NOTIF, LLD-Notif | — (BullMQ job) | notifications | TC-NOTIF-002 | v1.0 S4 |
