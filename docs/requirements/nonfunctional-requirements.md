# Non-Functional Requirements — Munsiq

## Performance

| NFR-ID | Requirement | Target | Measurement | Priority |
|--------|------------|--------|-------------|----------|
| NFR-PERF-001 | API response time (P50) | < 200ms | APM (Datadog/New Relic) | P1 |
| NFR-PERF-002 | API response time (P99) | < 500ms | APM | P1 |
| NFR-PERF-003 | Page load time (FCP) | < 1.5s | Lighthouse | P1 |
| NFR-PERF-004 | Page load time (LCP) | < 2.5s | Lighthouse | P1 |
| NFR-PERF-005 | Database query time (P95) | < 100ms | pg_stat_statements | P1 |
| NFR-PERF-006 | Concurrent users | ≥ 500 | Load test (k6) | P2 |
| NFR-PERF-007 | Throughput | ≥ 1000 req/s | Load test (k6) | P2 |
| NFR-PERF-008 | PDF generation time | < 5s per document | Application metrics | P2 |

## Availability & Reliability

| NFR-ID | Requirement | Target | Measurement | Priority |
|--------|------------|--------|-------------|----------|
| NFR-AVAIL-001 | System uptime | 99.9% | Uptime monitoring | P1 |
| NFR-AVAIL-002 | Planned maintenance window | ≤ 2h/month, off-peak (2-4 AM AST) | Change log | P1 |
| NFR-AVAIL-003 | Recovery Point Objective (RPO) | 1 hour | Backup verification | P1 |
| NFR-AVAIL-004 | Recovery Time Objective (RTO) | 4 hours | DR drill | P1 |
| NFR-AVAIL-005 | Zero-downtime deployment | Blue/Green or Rolling | Deployment logs | P1 |
| NFR-AVAIL-006 | Auto-scaling | 2-10 pods based on CPU/Memory | K8s HPA | P2 |

## Security

| NFR-ID | Requirement | Target | Measurement | Priority |
|--------|------------|--------|-------------|----------|
| NFR-SEC-001 | Transport encryption | TLS 1.3 only | SSL Labs A+ | P1 |
| NFR-SEC-002 | Data at rest encryption | AES-256 | AWS KMS audit | P1 |
| NFR-SEC-003 | PII field-level encryption | AES-256-GCM | Unit tests | P1 |
| NFR-SEC-004 | OWASP Top 10 compliance | Zero critical/high findings | DAST scan (ZAP) | P1 |
| NFR-SEC-005 | Dependency vulnerability scan | Zero critical CVEs | Snyk/Dependabot | P1 |
| NFR-SEC-006 | JWT token expiry | Access: 15min, Refresh: 7d | Config verification | P1 |
| NFR-SEC-007 | Rate limiting | 100 req/min per user, 1000 req/min per IP | API Gateway config | P1 |
| NFR-SEC-008 | Audit logging | All CUD operations + auth events | Log review | P1 |
| NFR-SEC-009 | Secrets management | AWS Secrets Manager, no hardcoded secrets | Code scan | P1 |
| NFR-SEC-010 | Penetration testing | Annual + pre-release | Third-party report | P2 |

## Privacy (PDPL)

| NFR-ID | Requirement | Target | Measurement | Priority |
|--------|------------|--------|-------------|----------|
| NFR-PRIV-001 | Consent collection | Explicit consent before PII processing | UI flow verification | P1 |
| NFR-PRIV-002 | Data subject access request (DSAR) | Response within 30 days | Process SLA | P1 |
| NFR-PRIV-003 | Right to deletion | Soft delete + hard delete after retention | Automated test | P1 |
| NFR-PRIV-004 | Data retention policy | Contracts: 10 years, Logs: 2 years, PII: contract+1 year | Cron job verification | P1 |
| NFR-PRIV-005 | Cross-border transfer | Data stays in GCC (me-south-1) | AWS config audit | P1 |
| NFR-PRIV-006 | Privacy impact assessment | Completed before launch | Document review | P2 |

## Accessibility

| NFR-ID | Requirement | Target | Measurement | Priority |
|--------|------------|--------|-------------|----------|
| NFR-A11Y-001 | WCAG compliance level | 2.1 AA | axe-core automated scan | P2 |
| NFR-A11Y-002 | Keyboard navigation | All interactive elements accessible | Manual QA | P2 |
| NFR-A11Y-003 | Screen reader support | ARIA labels on all components | Automated + manual | P2 |
| NFR-A11Y-004 | Color contrast ratio | ≥ 4.5:1 (normal text), ≥ 3:1 (large) | Lighthouse | P2 |
| NFR-A11Y-005 | RTL layout support | Full RTL for Arabic, LTR for English | Visual QA | P1 |

## Maintainability

| NFR-ID | Requirement | Target | Measurement | Priority |
|--------|------------|--------|-------------|----------|
| NFR-MAINT-001 | Code coverage | ≥ 80% (unit), ≥ 60% (integration) | Jest/Vitest coverage report | P1 |
| NFR-MAINT-002 | Code quality | Zero critical SonarQube issues | SonarQube dashboard | P1 |
| NFR-MAINT-003 | API documentation | 100% endpoints documented (OpenAPI) | Swagger UI verification | P1 |
| NFR-MAINT-004 | Deployment frequency | ≥ 1 per week (Staging), ≥ 1 per 2 weeks (Prod) | CI/CD metrics | P2 |
| NFR-MAINT-005 | Mean time to recovery (MTTR) | < 1 hour | Incident log | P2 |
