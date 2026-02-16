# Test Cases: Authentication & Authorization

| Test Case ID | Feature | Test Scenario | Test Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-AUTH-001 | Login | Successful login with valid credentials | 1. Navigate to login page.<br>2. Enter valid email and password.<br>3. Click "Login". | User is redirected to the dashboard. A valid JWT is issued. | E2E | P1 |
| TC-AUTH-002 | Login | Login with invalid password | 1. Navigate to login page.<br>2. Enter valid email and invalid password. | An error message "Invalid credentials" is displayed. | E2E | P1 |
| TC-AUTH-003 | Account Lockout | Exceeding max failed login attempts | 1. Attempt to log in with an invalid password 5 times. | The account is locked. An error message indicates the lockout. | Integration | P1 |
| TC-AUTH-004 | JWT Expiry | Accessing a protected route with an expired token | 1. Log in to get a token.<br>2. Wait for the token to expire (e.g., 15 mins).<br>3. Make an API call to a protected endpoint. | API returns a 401 Unauthorized error. | Integration | P1 |
| TC-AUTH-005 | RBAC | Tenant user attempting to access an admin endpoint | 1. Log in as a user with the `Tenant` role.<br>2. Attempt to call the `GET /api/v1/users` endpoint. | API returns a 403 Forbidden error. | Integration | P1 |
| TC-AUTH-006 | IDOR | User A attempting to access User B's data | 1. Log in as User A (tenant ID 1).<br>2. Attempt to call `GET /api/v1/contracts/{contract_id_of_user_B}`. | API returns a 404 Not Found error (as if the resource doesn't exist for this tenant). | Integration | P1 |
| TC-AUTH-007 | Password Reset | Successful password reset | 1. Request a password reset.<br>2. Click the link in the email.<br>3. Enter and confirm a new password. | Password is changed successfully. User can log in with the new password. | E2E | P2 |
