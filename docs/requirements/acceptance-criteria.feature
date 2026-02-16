# language: en

Feature: Property Management
  # AC-001
  Scenario: Add new property
    Given I am logged in as "PropertyManager"
    And I am on the "Add Property" page
    When I fill in "name" with "برج الياسمين"
    And I fill in "address" with "الرياض، حي النرجس، شارع الأمير محمد"
    And I select "type" as "residential"
    And I fill in "latitude" with "24.7136"
    And I fill in "longitude" with "46.6753"
    And I click "Save"
    Then the property should be created with status "ACTIVE"
    And I should see "برج الياسمين" in the property list
    And an audit log entry should be created with action "PROPERTY_CREATED"

  # AC-002
  Scenario: Add unit to property
    Given a property "برج الياسمين" exists with id "prop-001"
    And I am logged in as "PropertyManager"
    When I navigate to property "prop-001" units page
    And I click "Add Unit"
    And I fill in "unit_number" with "A-101"
    And I select "unit_type" as "apartment"
    And I fill in "area_sqm" with "120"
    And I fill in "bedrooms" with "3"
    And I fill in "annual_rent" with "45000"
    And I click "Save"
    Then the unit "A-101" should be linked to property "prop-001"
    And the unit status should be "VACANT"

  # AC-003
  Scenario: Search properties with filter
    Given I am logged in as "PropertyManager"
    And 10 properties exist in the system
    When I enter "الياسمين" in the search field
    And I select filter "type" as "residential"
    And I click "Search"
    Then results should appear within 1 second
    And only properties matching "الياسمين" with type "residential" should be shown

Feature: Authentication & Authorization
  # AC-004
  Scenario: Create user with role
    Given I am logged in as "SuperAdmin"
    When I navigate to "User Management"
    And I click "Add User"
    And I fill in "name" with "أحمد محمد"
    And I fill in "email" with "ahmed@munsiq.sa"
    And I select "role" as "PropertyManager"
    And I click "Save"
    Then a new user should be created with role "PropertyManager"
    And a welcome email should be sent to "ahmed@munsiq.sa"

  # AC-005
  Scenario: Login with MFA
    Given a user exists with email "ahmed@munsiq.sa" and MFA enabled
    When I enter email "ahmed@munsiq.sa" and correct password
    Then I should see the OTP input screen
    When I enter the correct OTP within 5 minutes
    Then I should be redirected to the dashboard
    And a JWT access token should be issued with 15-minute expiry
    And a refresh token should be issued with 7-day expiry
    And an audit log entry "LOGIN_SUCCESS" should be created

  Scenario: Account lockout after failed attempts
    Given a user exists with email "ahmed@munsiq.sa"
    When I attempt login with wrong password 5 times
    Then the account should be locked for 30 minutes
    And an email notification should be sent about the lockout
    And an audit log entry "ACCOUNT_LOCKED" should be created

Feature: Tenant Management
  # AC-006
  Scenario: Register new tenant
    Given I am logged in as "Admin"
    When I navigate to "Tenant Management"
    And I click "Add Tenant"
    And I fill in "full_name" with "سارة العتيبي"
    And I fill in "national_id" with "1234567890"
    And I fill in "phone" with "+966501234567"
    And I fill in "email" with "sara@email.com"
    And I click "Save"
    Then a tenant record should be created with status "PENDING_VERIFICATION"
    And PII fields should be encrypted at rest

  # AC-007
  Scenario: Nafath identity verification
    Given a tenant "سارة العتيبي" exists with status "PENDING_VERIFICATION"
    When the tenant initiates Nafath verification
    Then a verification request should be sent to Nafath API
    When Nafath returns verification status "VERIFIED"
    Then the tenant status should update to "VERIFIED"
    And an audit log entry "TENANT_VERIFIED" should be created

Feature: Contract Management
  # AC-008
  Scenario: Create lease contract
    Given I am logged in as "PropertyManager"
    And property "prop-001" unit "A-101" is "VACANT"
    And tenant "سارة العتيبي" is "VERIFIED"
    When I navigate to "Create Contract"
    And I select property "prop-001" unit "A-101"
    And I select tenant "سارة العتيبي"
    And I fill in "start_date" with "2026-03-01"
    And I fill in "end_date" with "2027-02-28"
    And I fill in "annual_rent" with "45000"
    And I select "payment_frequency" as "monthly"
    And I click "Create Contract"
    Then the contract should be created with status "DRAFT"
    And Ejar validation should pass
    And 12 payment installments of 3750 SAR should be generated
    And the unit status should change to "RESERVED"

  # AC-009
  Scenario: Sync contract with Ejar
    Given a contract exists with status "DRAFT" and Ejar validation passed
    When the system sends the contract to Ejar API
    Then the Ejar API should return a confirmation number
    And the contract status should update to "ACTIVE"
    And the unit status should change to "OCCUPIED"
    When the Ejar API returns an error
    Then the system should retry up to 3 times with exponential backoff
    And if all retries fail, status should be "EJAR_SYNC_FAILED"
    And an alert should be sent to the PropertyManager

Feature: Payment Processing
  # AC-010
  Scenario: Generate SADAD invoice
    Given a contract "cntr-001" is "ACTIVE" with monthly payment 3750 SAR
    And the next payment due date is "2026-04-01"
    When the scheduled job runs on "2026-03-25"
    Then a SADAD invoice should be generated with amount 3750 SAR
    And the invoice should have a unique SADAD billing number
    And the invoice status should be "PENDING"
    And an SMS reminder should be sent to the tenant

  # AC-011
  Scenario: Process SADAD payment callback
    Given an invoice "inv-001" exists with status "PENDING" and amount 3750 SAR
    When SADAD sends a payment callback with status "PAID" and amount 3750 SAR
    Then the invoice status should update to "PAID" within 5 seconds
    And a payment record should be created with SADAD reference number
    And a PDF receipt should be generated
    And an SMS confirmation should be sent to the tenant

  # AC-029
  Scenario: Calculate late payment penalty
    Given a contract "cntr-001" has late_penalty_type "percentage" and late_penalty_value "5"
    And invoice "inv-002" with amount 3750 SAR is overdue by 15 days
    When the daily penalty calculation job runs
    Then a penalty of 187.50 SAR should be calculated
    And the total due should be 3937.50 SAR
    And the tenant should be notified of the penalty

Feature: Maintenance
  # AC-013
  Scenario: Create maintenance request
    Given I am logged in as "Tenant" with an active lease
    When I navigate to "Maintenance Requests"
    And I click "New Request"
    And I fill in "description" with "تسريب مياه في الحمام"
    And I select "priority" as "HIGH"
    And I upload a photo "leak.jpg"
    And I click "Submit"
    Then a maintenance request should be created with status "NEW"
    And the PropertyManager should receive a notification

  # AC-014
  Scenario: Update maintenance request status
    Given I am logged in as "MaintenanceTech"
    And a maintenance request "maint-001" is assigned to me
    When I update the status to "IN_PROGRESS"
    And I add a note "تم الكشف، يحتاج قطعة غيار"
    Then the status should update to "IN_PROGRESS"
    And the tenant should receive an SMS and in-app notification

Feature: Audit & Compliance
  # AC-020
  Scenario: View audit log
    Given I am logged in as "SuperAdmin"
    When I navigate to "Audit Log"
    Then I should see a paginated list of audit events
    And each entry should contain: timestamp, userId, action, resource, IP address
    And I should be able to filter by date range, user, and action type
    And the log should be immutable (no edit/delete)
