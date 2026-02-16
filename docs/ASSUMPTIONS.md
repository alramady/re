# ASSUMPTIONS & QUESTIONS LOG

## Questions Table (المدخلات غير المتوفرة)

| # | Field | Needed | Provided | Assumed Value |
|---|-------|--------|----------|---------------|
| Q1 | اسم المنصة | اسم رسمي + اختصار | ❌ | **Munsiq** — منصة SaaS لإدارة العقارات في السوق السعودي |
| Q2 | النطاق (Modules) | قائمة الوحدات | ❌ | Property Mgmt, Tenant Mgmt, Contracts (Ejar-compliant), Payments, Maintenance, Reports, Notifications |
| Q3 | Tech Stack FE | Framework + UI | ❌ | Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Q4 | Tech Stack BE | Runtime + Framework | ❌ | Node.js 20 LTS + NestJS 10 + TypeScript |
| Q5 | Tech Stack DB/Queue/Cache | Engines | ❌ | PostgreSQL 16 + Redis 7 (cache+queue) + BullMQ |
| Q6 | Deployment | Method + Environments | ❌ | Docker + Kubernetes (EKS) — Dev / Staging / Prod |
| Q7 | AuthN/AuthZ | Protocol + Roles | ❌ | JWT + RBAC — Roles: SuperAdmin, Admin, PropertyManager, Tenant, Accountant, MaintenanceTech |
| Q8 | External Integrations | APIs + Webhooks | ❌ | Ejar API, SADAD Payments, Nafath (AuthN), Twilio SMS, AWS S3, Google Maps |
| Q9 | Performance/SLA | Targets | ❌ | P99 < 500ms, Uptime 99.9%, RPO 1h, RTO 4h |
| Q10 | Compliance/Security | Standards | ❌ | PDPL (Saudi), OWASP Top 10, SOC 2 Type II readiness, TLS 1.3, encryption at rest |
| Q11 | CI/CD + Repo | Tools + Structure | ❌ | GitHub Actions, Monorepo (Turborepo): apps/web, apps/api, packages/shared |
| Q12 | Ticketing/Versioning | Tools + Convention | ❌ | Jira, SemVer (MAJOR.MINOR.PATCH), Conventional Commits |

## Assumptions Register

| ID | Assumption | Impact if Wrong | Owner | Status |
|----|-----------|-----------------|-------|--------|
| A-001 | المنصة SaaS multi-tenant بنموذج schema-per-tenant | إعادة تصميم طبقة البيانات | Architect | OPEN |
| A-002 | العملة SAR فقط، لا تحويل عملات | إضافة Currency module | Product | OPEN |
| A-003 | اللغة: AR (primary) + EN (secondary) — RTL-first | تعديل FE بالكامل | FE Lead | OPEN |
| A-004 | الاستضافة على AWS Region me-south-1 (Bahrain) | تغيير IaC + latency | DevOps | OPEN |
| A-005 | Ejar API متاحة عبر sandbox للتطوير | تأخر تكامل العقود | BE Lead | OPEN |
| A-006 | الدفع عبر SADAD فقط (لا Visa/MC في MVP) | إضافة Payment Gateway | Product | OPEN |
| A-007 | حجم MVP: ≤ 500 عقار، ≤ 2000 مستأجر | تعديل scaling strategy | Architect | OPEN |
| A-008 | لا يوجد تطبيق موبايل في MVP — PWA فقط | إضافة React Native | Product | OPEN |
| A-009 | التقارير: PDF + Excel export، لا BI dashboard في MVP | إضافة BI tool | Product | OPEN |
| A-010 | Nafath للتحقق من هوية المستأجر فقط، ليس للدخول اليومي | تعديل AuthN flow | Architect | OPEN |
