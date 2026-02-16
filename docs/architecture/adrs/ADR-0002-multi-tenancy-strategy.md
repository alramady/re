# ADR-0002: Multi-Tenancy Data Isolation Strategy

- **Status**: Accepted
- **Date**: 2026-02-16
- **Deciders**: Tech Lead, Backend Lead, DevOps Engineer

## Context and Problem Statement

Munsiq is a SaaS platform serving multiple property management companies (tenants). We need a database architecture that ensures strong data isolation between tenants while balancing cost, performance, and operational complexity. A tenant's data must not be accessible by any other tenant under any circumstances.

## Decision Drivers

- **Security & Privacy**: Strong data isolation is a primary security requirement.
- **Scalability**: The solution must scale to support hundreds or thousands of tenants.
- **Customization**: The model should potentially allow for per-tenant schema customizations in the future.
- **Operational Cost**: The cost of infrastructure and maintenance should be manageable.
- **Backup & Restore**: It must be possible to back up and restore data for a single tenant efficiently.

## Considered Options

1.  **Shared Database, Shared Schema**: A single database for all tenants, with a `tenant_id` column in every table to discriminate data.
2.  **Shared Database, Schema-per-Tenant**: A single database, but each tenant gets their own dedicated PostgreSQL schema.
3.  **Database-per-Tenant**: A completely separate database instance for each tenant.

## Decision Outcome

Chosen option: **"Shared Database, Schema-per-Tenant"**, because it provides the best balance of data isolation, performance, and cost for our use case.

### Positive Consequences

- **Strong Logical Isolation**: Data is separated at the schema level, preventing accidental cross-tenant data access through programming errors (no need to add `WHERE tenant_id = ?` to every query).
- **Simplified Backup/Restore**: `pg_dump` and `pg_restore` can operate on a per-schema basis, making single-tenant backup/restore straightforward.
- **Cost-Effective**: Uses a single, larger database instance, which is more cost-effective than managing hundreds of small database instances.
- **Good Performance**: All tenants share the resources of a powerful database server. Connection pooling is efficient.
- **Extensibility**: Allows for per-tenant schema customizations if needed in the future.

### Negative Consequences

- **"Noisy Neighbor" Problem**: A very active tenant could potentially impact the performance for others sharing the same database instance.
- **Higher Migration Complexity**: Schema migrations must be applied to every tenant's schema, requiring a robust migration script.
- **Not Physically Isolated**: Data is not on physically separate hardware, which might not meet the strictest compliance requirements for some enterprise clients (though sufficient for our target market).

## Pros and Cons of the Options

### Shared Database, Shared Schema

- **Pro**: Easiest to implement and manage initially.
- **Pro**: Lowest infrastructure cost.
- **Con**: **Weakest data isolation**. High risk of cross-tenant data leaks due to programming errors (forgetting a `tenant_id` in a `WHERE` clause).
- **Con**: Difficult to back up or restore a single tenant's data.
- **Con**: Row-level security policies add complexity.

### Shared Database, Schema-per-Tenant

- **Pro**: Strong logical data isolation.
- **Pro**: Easy single-tenant backup and restore.
- **Pro**: Cost-effective.
- **Con**: More complex to manage migrations.
- **Con**: Potential for "noisy neighbor" performance issues.

### Database-per-Tenant

- **Pro**: **Strongest data isolation** (physical separation).
- **Pro**: Eliminates the "noisy neighbor" problem.
- **Con**: **Highest infrastructure cost** and operational overhead. Managing thousands of database instances is complex and expensive.
- **Con**: Inefficient resource utilization, as many databases will be idle.
- **Con**: Connection pooling is much less effective.
