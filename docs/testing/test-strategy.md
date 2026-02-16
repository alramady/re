# Test Strategy — Munsiq Platform

## 1. Testing Pyramid

Our testing strategy is based on the testing pyramid to ensure a fast, reliable, and cost-effective feedback loop.

| Layer | Percentage | Tools | Scope | CI/CD Integration |
|---|---|---|---|---|
| **Unit Tests** | ~70% | Jest, Vitest | Individual functions, components, and classes in isolation. Mocks are used for external dependencies. | Run on every commit and PR. Must pass before merge. |
| **Integration Tests** | ~20% | Jest, Supertest, pg-mem | Test the interaction between multiple components (e.g., service to database, service to service). Uses an in-memory database. | Run on every commit and PR. |
| **End-to-End (E2E) Tests** | ~10% | Cypress, Playwright | Test complete user flows through the UI in a real browser against a fully deployed environment (Staging). | Run nightly on the Staging environment. |

## 2. Testing Quadrants

| Quadrant | Type | Purpose | Examples |
|---|---|---|---|
| **Q1 (Technology-Facing, Supports the Team)** | Unit & Component Tests | Ensure code quality and correctness at a low level. | `AuthService.login()`, `Property.create()` |
| **Q2 (Business-Facing, Supports the Team)** | Functional & Story Tests | Verify that the system meets business requirements and user stories. | Gherkin scenarios, E2E tests for user flows. |
| **Q3 (Business-Facing, Critiques the Product)** | UAT, Exploratory Testing | Discover usability issues and edge cases from a user's perspective. | Manual testing by QA and Product Owners on Staging. |
| **Q4 (Technology-Facing, Critiques the Product)** | Performance, Security, -ility Testing | Verify non-functional requirements. | Load testing with k6, penetration testing, chaos engineering. |

## 3. Environments

| Environment | URL | Purpose | Data | Deployment |
|---|---|---|---|---|
| **Development** | `localhost` | Local development by engineers. | Seeded, mock data. | Manual. |
| **CI/CD** | N/A | Ephemeral environment for running automated tests in the pipeline. | In-memory DB, mocks. | Automated (GitHub Actions). |
| **Staging** | `staging.munsiq.sa` | Fully integrated environment for E2E testing, UAT, and demos. | Anonymized production data, seeded data. | Automated on merge to `develop` branch. |
| **Production** | `munsiq.sa` | Live environment for end-users. | Real user data. | Manual approval after Staging validation. |

## 4. Test Data Management

- **Unit/Integration Tests**: Use libraries like Faker.js to generate mock data. In-memory databases are seeded before each test run.
- **Staging Environment**: The database is periodically refreshed with a sanitized (anonymized PII) snapshot of the production database.

## 5. Defect Management

- **Tool**: Jira.
- **Workflow**: `NEW` -> `IN ANALYSIS` -> `TO DO` -> `IN PROGRESS` -> `IN REVIEW` -> `READY FOR QA` -> `DONE`.
- **Priority Levels**: `P1 (Blocker)`, `P2 (Critical)`, `P3 (Major)`, `P4 (Minor)`.
- **Triage**: A daily bug triage meeting is held with the QA Lead, Tech Lead, and Product Owner to prioritize new defects.

## 6. Automation & Tooling

| Area | Tool | Purpose |
|---|---|---|
| **Unit/Integration Testing** | Jest / Vitest | Test runner for backend and frontend unit tests. |
| **E2E Testing** | Cypress / Playwright | Browser automation for end-to-end tests. |
| **Performance Testing** | k6 | Load and stress testing of the API. |
| **Security Testing** | Snyk, Trivy, OWASP ZAP | Dependency scanning, container scanning, and dynamic analysis. |
| **CI/CD** | GitHub Actions | Orchestration of all automated testing and deployment. |
| **Code Coverage** | Codecov / Coveralls | Tracking code coverage metrics over time. Target: 80%. |
