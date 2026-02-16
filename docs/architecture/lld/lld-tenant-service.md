_# Low-Level Design (LLD) — Tenant Service

| Field | Value |
|-------|-------|
| Service Name | `tenant-service` |
| NestJS Module | `TenantModule` |
| Owner | Backend Lead |

## 1. Responsibilities

- Manages the lifecycle of tenants.
- Handles tenant PII data securely.
- Integrates with Nafath for identity verification.
- Provides query capabilities for tenants.

## 2. API Endpoints

| Method | Path | Description | Auth | RBAC Role |
|--------|------|-------------|------|-----------|
| `POST` | `/tenants` | Create a new tenant | JWT | `Admin` |
| `GET` | `/tenants` | List and search tenants | JWT | `Admin`, `PropertyManager` |
| `GET` | `/tenants/{id}` | Get tenant details | JWT | `Admin`, `PropertyManager` |
| `PATCH` | `/tenants/{id}` | Update tenant details | JWT | `Admin` |
| `POST` | `/tenants/{id}/verify-nafath` | Initiate Nafath verification | JWT | `Tenant` (self), `Admin` |
| `GET` | `/tenants/{id}/verification-status` | Check Nafath status | JWT | `Tenant` (self), `Admin` |

## 3. Data Model (Schema: `tenant_{id}`)

| Table | Column | Type | Constraints | Description |
|-------|--------|------|-------------|-------------|
| `tenants` | `id` | `uuid` | PK | Unique tenant ID |
| | `full_name` | `varchar(255)` | NOT NULL, **Encrypted** | Tenant's full name |
| | `national_id` | `varchar(255)` | NOT NULL, **Encrypted** | Saudi National ID / Iqama |
| | `phone_number` | `varchar(255)` | NOT NULL, **Encrypted** | Tenant's mobile number |
| | `email` | `varchar(255)` | **Encrypted** | Tenant's email address |
| | `verification_status` | `enum('PENDING', 'VERIFIED', 'FAILED')` | NOT NULL, default `PENDING` | Nafath verification status |
| | `nafath_ref_id` | `varchar(255)` | | Reference ID from Nafath |

## 4. Core Logic (Pseudocode)

```typescript
// initiateNafathVerification(tenantId): Promise<status>
class TenantService {
  async createTenant(data, tenantId) {
    // 1. Encrypt PII fields (name, national_id, phone, email)
    const encryptedData = this.encryptionService.encryptObject(data);

    // 2. Save to DB
    const tenant = await this.db.tenants.create({
      data: encryptedData,
      schema: `tenant_${tenantId}`
    });

    // 3. Log audit event
    await this.auditService.log({ action: 'TENANT_CREATED', ... });

    return tenant;
  }

  async initiateNafathVerification(tenantId, currentUserId) {
    // 1. Fetch tenant data (decrypted)
    const tenant = await this.db.tenants.findUnique(...);
    const decryptedTenant = this.encryptionService.decryptObject(tenant);

    // 2. Call Nafath API with National ID
    const nafathResponse = await this.nafathApi.startVerification(decryptedTenant.national_id);

    // 3. Update tenant with Nafath reference ID and PENDING status
    await this.db.tenants.update({
      where: { id: tenantId },
      data: { nafath_ref_id: nafathResponse.refId, verification_status: 'PENDING' },
      schema: `tenant_${tenantId}`
    });

    return { status: 'PENDING', refId: nafathResponse.refId };
  }

  async handleNafathCallback(payload) {
    // 1. Find tenant by Nafath reference ID
    const tenant = await this.db.tenants.findUnique({ where: { nafath_ref_id: payload.refId } });

    // 2. Update tenant status based on callback (VERIFIED/FAILED)
    await this.db.tenants.update({
      where: { id: tenant.id },
      data: { verification_status: payload.status },
      schema: `tenant_${tenant.tenant_id}` // Assuming tenant_id is stored
    });

    // 3. Log audit event
    await this.auditService.log({ action: 'TENANT_VERIFIED', ... });
  }
}
```

## 5. Dependencies

- **Database:** `PostgreSQL`
- **Audit Service:** For logging.
- **Encryption Service:** A dedicated service/library for field-level encryption (e.g., using AES-256-GCM with a key from AWS KMS).
- **Nafath API Client:** A wrapper for the Nafath REST API.
