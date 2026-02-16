# Vision & Scope — Munsiq Platform

| Field | Value |
|-------|-------|
| Document ID | VS-001 |
| Version | 1.0.0 |
| Last Updated | 2026-02-16 |
| Owner | Product Manager |

## In Scope (MVP)

| Module | Description |
|--------|-------------|
| PROP | إدارة العقارات: إضافة، تعديل، أرشفة، بحث، تصنيف |
| TNT | إدارة المستأجرين: تسجيل، تحقق Nafath، ملف شخصي، تاريخ |
| CNTR | إدارة العقود: إنشاء متوافق مع إيجار، تجديد، إنهاء، إشعارات |
| PAY | المدفوعات: فواتير SADAD، تتبع، إيصالات، تقارير مالية |
| MAINT | الصيانة: طلبات، تعيين فنيين، تتبع حالة، تقييم |
| RPT | التقارير: مالية، إشغال، صيانة — PDF + Excel export |
| NOTIF | الإشعارات: SMS (Twilio)، Email، In-app، Push (PWA) |
| AUTH | المصادقة والصلاحيات: JWT + RBAC، 6 أدوار |

## Out of Scope (MVP)

| Item | Deferred To |
|------|-------------|
| تطبيق موبايل أصلي (iOS/Android) | v2.0 |
| BI Dashboard / Analytics المتقدم | v2.0 |
| بوابة دفع Visa/Mastercard | v2.0 |
| تحويل عملات (غير SAR) | v2.0 |
| تكامل مع منصات تسويق عقاري | v2.0 |
| نظام مزادات / عروض أسعار | v3.0 |
| IoT / أجهزة استشعار المباني | v3.0 |

## Constraints

| ID | Constraint | Type |
|----|-----------|------|
| C-001 | التوافق الكامل مع نظام إيجار (Ejar) | Regulatory |
| C-002 | الامتثال لنظام حماية البيانات الشخصية PDPL | Regulatory |
| C-003 | الاستضافة في منطقة AWS me-south-1 (البحرين) | Technical |
| C-004 | دعم RTL + ثنائي اللغة (AR/EN) | UX |
| C-005 | ميزانية MVP ≤ 800,000 SAR | Financial |
| C-006 | مدة التسليم ≤ 6 أشهر من الانطلاق | Schedule |
| C-007 | فريق ≤ 12 مطور | Resource |

## Dependencies

| ID | Dependency | Provider | Risk |
|----|-----------|----------|------|
| D-001 | Ejar API sandbox access | وزارة الإسكان | HIGH — لا يوجد SLA واضح |
| D-002 | SADAD merchant account | SAMA | MEDIUM — 4-6 أسابيع للتفعيل |
| D-003 | Nafath integration credentials | IAM/NDMO | MEDIUM |
| D-004 | AWS account + me-south-1 quota | AWS | LOW |
| D-005 | Twilio Saudi number | Twilio | LOW |
