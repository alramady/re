# Low-Level Design (LLD) — Property Service

| Field | Value |
|-------|-------|
| Service Name | `property-service` |
| NestJS Module | `PropertyModule` |
| Owner | Backend Lead |

## 1. Responsibilities

- Manages the lifecycle of properties and units.
- Handles property-related data (address, type, images, documents).
- Provides query capabilities for properties and units.
- Manages property metadata like status and occupancy.

## 2. API Endpoints

| Method | Path | Description | Auth | RBAC Role |
|--------|------|-------------|------|-----------|
| `POST` | `/properties` | Create a new property | JWT | `PropertyManager` |
| `GET` | `/properties` | List and search properties | JWT | `PropertyManager`, `Admin` |
| `GET` | `/properties/{id}` | Get property details | JWT | `PropertyManager`, `Admin` |
| `PATCH` | `/properties/{id}` | Update property details | JWT | `PropertyManager` |
| `DELETE` | `/properties/{id}` | Archive a property | JWT | `PropertyManager` |
| `POST` | `/properties/{id}/units` | Create a new unit | JWT | `PropertyManager` |
| `GET` | `/properties/{id}/units` | List units for a property | JWT | `PropertyManager` |
| `PATCH` | `/units/{unitId}` | Update unit details | JWT | `PropertyManager` |
| `POST` | `/properties/{id}/documents` | Upload a document | JWT | `PropertyManager` |

## 3. Data Model (Schema: `tenant_{id}`)

| Table | Column | Type | Constraints | Description |
|-------|--------|------|-------------|-------------|
| `properties` | `id` | `uuid` | PK, default `gen_random_uuid()` | Unique property ID |
| | `name` | `varchar(255)` | NOT NULL | Property name |
| | `address` | `text` | | Full address |
| | `latitude` | `decimal(9,6)` | | GPS Latitude |
| | `longitude` | `decimal(9,6)` | | GPS Longitude |
| | `type` | `enum('residential', 'commercial')` | NOT NULL | Property type |
| | `status` | `enum('ACTIVE', 'ARCHIVED')` | NOT NULL, default `ACTIVE` | Property status |
| `units` | `id` | `uuid` | PK | Unique unit ID |
| | `property_id` | `uuid` | FK -> `properties.id` | Owning property |
| | `unit_number` | `varchar(50)` | NOT NULL | Unit identifier (e.g., A-101) |
| | `status` | `enum('VACANT', 'OCCUPIED', 'RESERVED')` | NOT NULL, default `VACANT` | Unit occupancy status |
| | `annual_rent` | `decimal(10,2)` | | Default rent amount |
| `documents` | `id` | `uuid` | PK | Unique document ID |
| | `property_id` | `uuid` | FK -> `properties.id` | Owning property |
| | `file_name` | `varchar(255)` | NOT NULL | Original file name |
| | `s3_key` | `varchar(1024)` | NOT NULL | S3 object key |
| | `mime_type` | `varchar(100)` | | File MIME type |

## 4. Core Logic (Pseudocode)

```typescript
// createProperty(data: CreatePropertyDto): Promise<Property>
class PropertyService {
  async createProperty(data, tenantId) {
    // 1. Begin transaction
    const property = await this.db.properties.create({
      data: { ...data },
      schema: `tenant_${tenantId}`
    });

    // 2. Log audit event
    await this.auditService.log({
      action: 'PROPERTY_CREATED',
      resourceId: property.id,
      tenantId: tenantId
    });

    // 3. Commit transaction
    return property;
  }

  async addUnit(propertyId, data, tenantId) {
    // 1. Check if property exists
    const property = await this.db.properties.findUnique(...);
    if (!property) throw new NotFoundException();

    // 2. Create unit
    const unit = await this.db.units.create({
      data: { ...data, property_id: propertyId },
      schema: `tenant_${tenantId}`
    });

    // 3. Log audit event
    await this.auditService.log(...);

    return unit;
  }
}
```

## 5. Dependencies

- **Database:** `PostgreSQL` (via Prisma or TypeORM)
- **Audit Service:** For logging CUD operations.
- **AWS S3 SDK:** For file uploads.
