# Stakeholders & RACI Matrix — Munsiq

## Stakeholder Register

| ID | Role | Name/Title | Interest | Influence | Communication |
|----|------|-----------|----------|-----------|---------------|
| SH-01 | Product Owner | مدير المنتج | HIGH | HIGH | Daily standup, Sprint review |
| SH-02 | Project Sponsor | CEO / المدير التنفيذي | HIGH | HIGH | Monthly steering, Escalation |
| SH-03 | Tech Lead / Architect | قائد تقني | HIGH | HIGH | Daily, PR reviews |
| SH-04 | Frontend Lead | قائد الواجهات | HIGH | MEDIUM | Daily standup |
| SH-05 | Backend Lead | قائد الخدمات الخلفية | HIGH | MEDIUM | Daily standup |
| SH-06 | DevOps Engineer | مهندس البنية التحتية | MEDIUM | MEDIUM | Weekly sync |
| SH-07 | QA Lead | قائد الجودة | HIGH | MEDIUM | Sprint planning, Bug triage |
| SH-08 | UX Designer | مصمم تجربة المستخدم | MEDIUM | MEDIUM | Sprint planning |
| SH-09 | Legal/Compliance | المستشار القانوني | MEDIUM | HIGH | Monthly review |
| SH-10 | Property Managers (End Users) | مدراء العقارات | HIGH | LOW | UAT, Feedback sessions |
| SH-11 | Tenants (End Users) | المستأجرون | MEDIUM | LOW | Beta testing |
| SH-12 | Ejar Integration Team | فريق إيجار | LOW | HIGH | As needed |

## RACI Matrix

| Deliverable | SH-01 PO | SH-02 Sponsor | SH-03 Arch | SH-04 FE | SH-05 BE | SH-06 DevOps | SH-07 QA | SH-08 UX | SH-09 Legal |
|------------|----------|---------------|------------|----------|----------|--------------|----------|----------|-------------|
| Requirements | A | I | C | C | C | I | C | C | C |
| Architecture Design | C | I | R/A | C | C | C | I | I | I |
| UI/UX Design | A | I | C | C | I | I | I | R | I |
| Frontend Development | A | I | C | R | I | I | C | C | I |
| Backend Development | A | I | C | I | R | I | C | I | I |
| API Design | C | I | A | C | R | I | C | I | I |
| Database Design | C | I | A | I | R | I | I | I | I |
| DevOps/Infrastructure | I | I | C | I | I | R/A | I | I | I |
| Testing Strategy | C | I | C | C | C | I | R/A | I | I |
| Security/Compliance | C | I | C | I | C | C | C | I | R/A |
| Deployment | I | I | C | I | I | R/A | C | I | I |
| Release Sign-off | R/A | A | C | I | I | I | C | I | C |
| PDPL Compliance | C | A | C | I | C | I | I | I | R |
| Ejar Integration | A | I | C | I | R | I | C | I | C |

> **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed
