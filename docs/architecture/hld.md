# High-Level Design (HLD) — Munsiq Platform

## 1. Architectural Style

| Style | Description |
|-------|-------------|
| **Primary** | **Microservices Architecture** | System is decomposed into loosely coupled, independently deployable services. |
| **Secondary** | **Event-Driven Architecture** | Services communicate asynchronously via a message queue for background tasks and inter-service coordination. |
| **Client** | **Single Page Application (SPA) / Progressive Web App (PWA)** | Rich, responsive user interface running in the browser, communicating with the backend via APIs. |

## 2. System Decomposition (C4 Diagrams)

| Diagram | Description | Link |
|---------|-------------|------|
| **Context Diagram** | Shows how Munsiq fits into its environment with users and external systems. | [context.mmd](./context.mmd) |
| **Container Diagram** | Decomposes the system into deployable units (web app, API, database, etc.). | [container.mmd](./container.mmd) |
| **Component Diagram** | Decomposes the API Application into its constituent microservices/modules. | [component.mmd](./component.mmd) |

## 3. Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui | Modern, performant React framework with strong typing and efficient styling. PWA support. |
| **Backend** | Node.js 20 LTS, NestJS 10, TypeScript | Scalable, efficient I/O. NestJS provides a structured, modular architecture. TypeScript for type safety. |
| **Database** | PostgreSQL 16 (AWS Aurora) | Robust, feature-rich relational database with strong JSON support and scalability. |
| **Cache** | Redis 7 (AWS ElastiCache) | High-performance in-memory data store for session management and caching. |
| **Queue** | Redis 7 + BullMQ | Reliable and performant message queue for background job processing. |
| **Deployment** | Docker, Kubernetes (AWS EKS) | Containerization for consistency. Orchestration for scalability, resilience, and automated management. |
| **CI/CD** | GitHub Actions | Integrated with source control, flexible workflows for build, test, and deploy. |
| **Storage** | AWS S3 | Scalable, durable, and cost-effective object storage for documents and media. |
| **Monitoring** | AWS CloudWatch, Datadog (or similar APM) | Comprehensive logging, metrics, and application performance monitoring. |

## 4. Data Flow & Processing

| Flow | Description | Diagram |
|------|-------------|---------|
| **User Interaction** | Users interact with the Next.js Web App, which calls the NestJS API Application. | [container.mmd](./container.mmd) |
| **Synchronous Comms** | All user-facing requests are synchronous RESTful API calls (HTTPS/JSON) from the Web App to the API. | [sequence-critical-flows.mmd](./sequence-critical-flows.mmd) |
| **Asynchronous Comms** | Long-running or non-critical tasks (notifications, Ejar sync, report generation) are handled by background workers via the BullMQ queue. | [component.mmd](./component.mmd) |
| **External Integrations** | The API Application is the single point of contact for all external systems (Ejar, SADAD, etc.). | [context.mmd](./context.mmd) |

## 5. Multi-Tenancy Strategy

| Strategy | Description | Rationale |
|----------|-------------|-----------|
| **Schema-per-Tenant** | Each tenant (property management company) gets their own dedicated schema within a shared PostgreSQL database. | **Data Isolation:** Strongest logical separation of tenant data. **Simplicity:** Easier to manage backups, restores, and schema extensions per tenant. **Scalability:** Can be migrated to separate databases if needed. |

> See [ADR-0002-multi-tenancy-strategy.md](./adrs/ADR-0002-multi-tenancy-strategy.md) for details.

## 6. Security & Compliance

| Control | Implementation |
|---------|----------------|
| **Authentication** | JWT-based. Short-lived access tokens (15 min), long-lived refresh tokens (7 days). MFA via OTP. |
| **Authorization** | Role-Based Access Control (RBAC). Permissions are assigned to roles, users are assigned roles. Enforced via NestJS Guards. |
| **Data Protection** | TLS 1.3 for data in transit. AES-256 encryption for data at rest (via AWS KMS). Field-level encryption for PII. |
| **Secrets Management** | AWS Secrets Manager. No hardcoded credentials in code or config files. |
| **Compliance** | Adherence to PDPL guidelines for data handling. OWASP Top 10 mitigation strategies. |

## 7. Scalability & Availability

| Mechanism | Implementation |
|-----------|----------------|
| **Horizontal Scaling** | API and Web App containers are stateless and can be scaled horizontally using Kubernetes Horizontal Pod Autoscaler (HPA). |
| **Database Scaling** | AWS Aurora provides read replicas for scaling read traffic and automated failover. |
| **High Availability** | Deployed across multiple Availability Zones (AZs) in the AWS me-south-1 region. |
| **Resilience** | Use of retries with exponential backoff for external API calls. Circuit breaker pattern for critical integrations. |
| **Zero-Downtime Deploy** | Rolling updates strategy in Kubernetes to ensure the application remains available during deployments. |
