# Test Cases: Payment Processing

| Test Case ID | Feature | Test Scenario | Test Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-PAY-001 | Invoice Generation | Automatic generation of a SADAD invoice | 1. A contract installment is due in 10 days.<br>2. The scheduled invoice generation job runs. | An invoice is created with status `PENDING`. A unique SADAD bill number is generated and stored. An SMS is sent to the tenant. | Integration | P1 |
| TC-PAY-002 | Payment Callback | Successful payment notification from SADAD | 1. An invoice exists with status `PENDING`.<br>2. The system receives a valid webhook from SADAD for the full amount. | The invoice status changes to `PAID`. The installment status changes to `PAID`. A payment record is created. A confirmation SMS is sent. | Integration | P1 |
| TC-PAY-003 | Payment Callback | Payment callback with an invalid signature or from a wrong IP | 1. The system receives a webhook from an untrusted source. | The webhook is rejected with a 401/403 error. No changes are made to the invoice status. | Integration | P1 |
| TC-PAY-004 | Late Penalty | Automatic calculation of late payment penalty | 1. An invoice is overdue by 5 days.<br>2. The scheduled penalty calculation job runs. | A penalty record is created and linked to the invoice. The total amount due for the invoice is updated. | Integration | P2 |
| TC-PAY-005 | Receipt Generation | Downloading a payment receipt | 1. A tenant logs in.<br>2. Navigates to their payment history.<br>3. Clicks "Download Receipt" for a paid invoice. | A PDF receipt is generated and downloaded, containing all relevant payment details. | E2E | P2 |
| TC-PAY-006 | Partial Payment | Handling a partial payment from SADAD | 1. System receives a SADAD webhook for an amount less than the invoice total. | The invoice status remains `PENDING` or changes to `PARTIALLY_PAID`. A payment record is created. The remaining balance is correctly reflected. | Integration | P3 |
