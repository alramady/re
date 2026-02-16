# Software Requirements Specification (SRS) — Munsiq

| Field | Value |
|-------|-------|
| Document ID | SRS-001 |
| Version | 1.0.0 |
| Standard | IEEE 830 (Tabular Adaptation) |
| Classification | Confidential |

## 1. General Description

| Attribute | Value |
|-----------|-------|
| Product Name | Munsiq — منصة إدارة العقارات |
| Product Type | SaaS Web Application (PWA) |
| Target Market | شركات إدارة العقارات — السعودية |
| Users | مدراء عقارات، مستأجرون، محاسبون، فنيون، مشرفون |
| Deployment | AWS EKS (me-south-1) |
| Languages | Arabic (Primary, RTL), English (Secondary) |
| Currency | SAR only |

## 2. System Interfaces

| Interface | Protocol | Direction | Description |
|-----------|----------|-----------|-------------|
| Ejar API | REST/HTTPS | Bidirectional | تسجيل/تحديث/إلغاء عقود |
| SADAD | REST/HTTPS | Outbound → Callback | إنشاء فواتير + استلام إشعارات الدفع |
| Nafath | OAuth 2.0 / HTTPS | Outbound → Callback | التحقق من هوية المستأجر |
| Twilio | REST/HTTPS | Outbound | إرسال SMS |
| AWS S3 | SDK | Outbound | تخزين مستندات + صور |
| Google Maps | JS SDK | Outbound | عرض مواقع العقارات |
| PostgreSQL | TCP/5432 | Internal | قاعدة البيانات الرئيسية |
| Redis | TCP/6379 | Internal | Cache + Message Queue |

## 3. User Characteristics

| Role | Technical Level | Access Frequency | Device |
|------|----------------|-----------------|--------|
| SuperAdmin | High | Daily | Desktop |
| Admin | Medium-High | Daily | Desktop |
| PropertyManager | Medium | Daily | Desktop + Mobile (PWA) |
| Tenant | Low | Weekly | Mobile (PWA) |
| Accountant | Medium | Daily | Desktop |
| MaintenanceTech | Low-Medium | Daily | Mobile (PWA) |

## 4. Assumptions & Dependencies

→ See [ASSUMPTIONS.md](../ASSUMPTIONS.md)

## 5. Functional Requirements Summary

→ See [functional-requirements.md](functional-requirements.md) for complete FR table.

| Module | FR Count | Priority Distribution |
|--------|----------|----------------------|
| AUTH | 8 | P1: 6, P2: 2 |
| PROP | 7 | P1: 4, P2: 3 |
| TNT | 6 | P1: 4, P2: 2 |
| CNTR | 10 | P1: 7, P2: 3 |
| PAY | 8 | P1: 6, P2: 2 |
| MAINT | 6 | P1: 2, P2: 3, P3: 1 |
| RPT | 5 | P1: 1, P2: 3, P3: 1 |
| NOTIF | 5 | P1: 2, P2: 3 |
| **Total** | **55** | **P1: 32, P2: 21, P3: 2** |

## 6. Non-Functional Requirements Summary

→ See [nonfunctional-requirements.md](nonfunctional-requirements.md) for complete NFR table.

| Category | Target |
|----------|--------|
| Performance | P99 API response < 500ms |
| Availability | 99.9% uptime (≤ 8.76h downtime/year) |
| Scalability | Horizontal auto-scale 2-10 pods |
| Security | OWASP Top 10, TLS 1.3, AES-256 at rest |
| Privacy | PDPL compliant, PII encrypted |
| Accessibility | WCAG 2.1 AA |
| Localization | AR (RTL) + EN, ICU message format |
| Backup | RPO: 1h, RTO: 4h |

## 7. Data Requirements

→ See [data-dictionary.md](../data-model/data-dictionary.md) and [ddl.sql](../data-model/ddl.sql)

| Entity | Estimated Records (Year 1) | PII |
|--------|---------------------------|-----|
| properties | 500 | No |
| units | 2,000 | No |
| tenants | 2,000 | Yes — name, ID, phone, email |
| contracts | 2,000 | Yes — linked to tenant |
| invoices | 24,000 | No |
| payments | 24,000 | No |
| maintenance_requests | 5,000 | No |
| users | 100 | Yes — name, email, phone |
| audit_logs | 500,000 | No |
