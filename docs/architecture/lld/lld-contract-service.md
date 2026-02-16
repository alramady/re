_# Low-Level Design (LLD) — Contract Service

| Field | Value |
|-------|-------|
| Service Name | `contract-service` |
| NestJS Module | `ContractModule` |
| Owner | Backend Lead |

## 1. Responsibilities

- Manages the lifecycle of lease contracts.
- Integrates with the Ejar system for official registration.
- Generates payment schedules (installments) based on contract terms.
- Handles contract renewals and terminations.

## 2. API Endpoints

| Method | Path | Description | Auth | RBAC Role |
|--------|------|-------------|------|-----------|
| `POST` | `/contracts` | Create a new contract | JWT | `PropertyManager` |
| `GET` | `/contracts` | List and search contracts | JWT | `PropertyManager`, `Admin` |
| `GET` | `/contracts/{id}` | Get contract details | JWT | `PropertyManager`, `Tenant` |
| `POST` | `/contracts/{id}/sync-ejar` | Manually trigger Ejar sync | JWT | `PropertyManager` |
| `POST` | `/contracts/{id}/renew` | Renew a contract | JWT | `PropertyManager` |
| `POST` | `/contracts/{id}/terminate` | Terminate a contract | JWT | `PropertyManager` |
| `GET` | `/contracts/{id}/installments` | Get payment schedule | JWT | `PropertyManager`, `Tenant` |

## 3. Data Model (Schema: `tenant_{id}`)

| Table | Column | Type | Constraints | Description |
|-------|--------|------|-------------|-------------|
| `contracts` | `id` | `uuid` | PK | Unique contract ID |
| | `property_id` | `uuid` | FK -> `properties.id` | Linked property |
| | `unit_id` | `uuid` | FK -> `units.id` | Linked unit |
| | `tenant_id` | `uuid` | FK -> `tenants.id` | Linked tenant |
| | `status` | `enum('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'EJAR_SYNC_FAILED')` | NOT NULL | Contract status |
| | `start_date` | `date` | NOT NULL | Lease start date |
| | `end_date` | `date` | NOT NULL | Lease end date |
| | `annual_rent` | `decimal(10,2)` | NOT NULL | Total rent per year |
| | `ejar_contract_id` | `varchar(255)` | | ID from Ejar system |
| `installments` | `id` | `uuid` | PK | Unique installment ID |
| | `contract_id` | `uuid` | FK -> `contracts.id` | Owning contract |
| | `due_date` | `date` | NOT NULL | Payment due date |
| | `amount` | `decimal(10,2)` | NOT NULL | Amount due |
| | `status` | `enum('PENDING', 'PAID', 'OVERDUE')` | NOT NULL, default `PENDING` | Installment status |

## 4. Core Logic (Pseudocode)

```typescript
// createContract(data): Promise<Contract>
class ContractService {
  async createContract(data, tenantId) {
    // 1. Begin transaction
    // 2. Validate unit is VACANT
    const unit = await this.db.units.findUnique({ where: { id: data.unitId } });
    if (unit.status !== 'VACANT') throw new ConflictException('Unit is not vacant');

    // 3. Create contract with status DRAFT
    const contract = await this.db.contracts.create({ data, schema: `tenant_${tenantId}` });

    // 4. Generate installments based on rent and frequency
    const installments = this.generateInstallments(contract);
    await this.db.installments.createMany({ data: installments, schema: `tenant_${tenantId}` });

    // 5. Update unit status to RESERVED
    await this.db.units.update({ where: { id: data.unitId }, data: { status: 'RESERVED' } });

    // 6. Enqueue Ejar sync job
    await this.queue.add('ejar-sync', { contractId: contract.id, tenantId });

    // 7. Commit transaction and return contract
    return contract;
  }

  async syncWithEjar(contractId, tenantId) {
    // (This runs in a background worker)
    // 1. Get contract data
    const contract = await this.db.contracts.findUnique(...);

    try {
      // 2. Call Ejar API
      const ejarResponse = await this.ejarApi.registerContract(contract);

      // 3. Update contract with Ejar ID and status ACTIVE
      await this.db.contracts.update({
        data: { ejar_contract_id: ejarResponse.id, status: 'ACTIVE' },
        schema: `tenant_${tenantId}`
      });

      // 4. Update unit status to OCCUPIED
      await this.db.units.update({ data: { status: 'OCCUPIED' } });

      // 5. Trigger invoice generation for the first installment
      await this.paymentService.createInvoiceForFirstInstallment(contract.id);

    } catch (error) {
      // 6. On failure, update status to EJAR_SYNC_FAILED and alert
      await this.db.contracts.update({ data: { status: 'EJAR_SYNC_FAILED' } });
      await this.notificationService.alertAdmin('Ejar Sync Failed', { contractId });
    }
  }
}
```

## 5. Dependencies

- **Database:** `PostgreSQL`
- **Queue Service:** `BullMQ` for queueing background jobs.
- **Ejar API Client:** Wrapper for the Ejar REST API.
- **Payment Service:** To trigger invoice generation.
- **Notification Service:** To send alerts on failures.
- **Property Service:** To query unit status.
