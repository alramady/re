# Low-Level Design (LLD) — Payment Service

| Field | Value |
|-------|-------|
| Service Name | `payment-service` |
| NestJS Module | `PaymentModule` |
| Owner | Backend Lead |

## 1. Responsibilities

- Manages invoices and payments.
- Integrates with the SADAD payment gateway.
- Processes incoming payment webhooks.
- Generates payment receipts.
- Calculates and applies late payment penalties.

## 2. API Endpoints

| Method | Path | Description | Auth | RBAC Role |
|--------|------|-------------|------|-----------|
| `GET` | `/invoices` | List and search invoices | JWT | `Accountant`, `Admin` |
| `GET` | `/invoices/{id}` | Get invoice details | JWT | `Accountant`, `Tenant` |
| `POST` | `/invoices/{id}/pay` | (Future) Initiate payment via other gateways | JWT | `Tenant` |
| `POST` | `/webhooks/sadad` | SADAD payment callback | IP Whitelist | `N/A` |
| `GET` | `/payments/{id}/receipt` | Download payment receipt | JWT | `Accountant`, `Tenant` |

## 3. Data Model (Schema: `tenant_{id}`)

| Table | Column | Type | Constraints | Description |
|-------|--------|------|-------------|-------------|
| `invoices` | `id` | `uuid` | PK | Unique invoice ID |
| | `installment_id` | `uuid` | FK -> `installments.id` | Linked contract installment |
| | `status` | `enum("PENDING", "PAID", "OVERDUE", "CANCELLED")` | NOT NULL | Invoice status |
| | `amount` | `decimal(10,2)` | NOT NULL | Original amount due |
| | `due_date` | `date` | NOT NULL | Due date |
| | `sadad_bill_number` | `varchar(255)` | UNIQUE, NOT NULL | Bill number from SADAD |
| `payments` | `id` | `uuid` | PK | Unique payment transaction ID |
| | `invoice_id` | `uuid` | FK -> `invoices.id` | Linked invoice |
| | `amount_paid` | `decimal(10,2)` | NOT NULL | Amount that was paid |
| | `payment_date` | `timestamp` | NOT NULL | Date of payment |
| | `method` | `enum("SADAD", "MANUAL", "VISA")` | NOT NULL | Payment method |
| | `reference_number` | `varchar(255)` | | Transaction ID from gateway |
| `penalties` | `id` | `uuid` | PK | Unique penalty ID |
| | `invoice_id` | `uuid` | FK -> `invoices.id` | Linked invoice |
| | `amount` | `decimal(10,2)` | NOT NULL | Penalty amount |
| | `reason` | `text` | | Reason for penalty |

## 4. Core Logic (Pseudocode)

```typescript
// generateInvoiceForInstallment(installmentId)
class PaymentService {
  async generateInvoiceForInstallment(installmentId, tenantId) {
    // 1. Get installment details
    const installment = await this.db.installments.findUnique(...);

    // 2. Call SADAD API to generate a bill number
    const sadadResponse = await this.sadadApi.createBill({
      amount: installment.amount,
      dueDate: installment.due_date,
      description: `Rent for ...`
    });

    // 3. Create invoice in DB with status PENDING and SADAD number
    const invoice = await this.db.invoices.create({
      data: {
        installment_id: installmentId,
        amount: installment.amount,
        due_date: installment.due_date,
        sadad_bill_number: sadadResponse.billNumber,
        status: 'PENDING'
      },
      schema: `tenant_${tenantId}`
    });

    // 4. Enqueue notification job
    await this.queue.add('send-invoice-notification', { invoiceId: invoice.id, tenantId });

    return invoice;
  }

  async handleSadadCallback(payload) {
    // 1. Validate callback source (IP whitelist, signature if available)
    // 2. Find invoice by sadad_bill_number
    const invoice = await this.db.invoices.findUnique({ where: { sadad_bill_number: payload.billNumber } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    // 3. Begin transaction
    // 4. Update invoice status to PAID
    await this.db.invoices.update({ where: { id: invoice.id }, data: { status: 'PAID' } });

    // 5. Create a payment record
    await this.db.payments.create({
      data: {
        invoice_id: invoice.id,
        amount_paid: payload.amount,
        payment_date: new Date(),
        method: 'SADAD',
        reference_number: payload.transactionId
      }
    });

    // 6. Update installment status to PAID
    await this.db.installments.update({ where: { id: invoice.installment_id }, data: { status: 'PAID' } });

    // 7. Enqueue payment confirmation notification
    await this.queue.add('send-payment-confirmation', { invoiceId: invoice.id });

    // 8. Commit transaction
  }
}
```

## 5. Dependencies

- **Database:** `PostgreSQL`
- **Queue Service:** `BullMQ`
- **SADAD API Client:** Wrapper for the SADAD REST API.
- **Notification Service:** To send invoice and confirmation messages.
- **Contract Service:** To query installment details.
