_# API Governance — Munsiq Platform

## 1. General Principles

| Principle | Description |
|---|---|
| **API-First Design** | APIs are designed and documented before implementation begins. The OpenAPI spec is the source of truth. |
| **Statelessness** | All API endpoints are stateless. The server holds no client-specific context between requests. State is managed by the client and sent with each request (e.g., JWT). |
| **Resource-Oriented** | APIs are modeled around resources (e.g., Properties, Contracts) and the standard HTTP methods to operate on them (GET, POST, PATCH, DELETE). |
| **Tenant Isolation** | All API logic must be tenant-aware. Data access is strictly scoped to the tenant context derived from the user's authentication token. |

## 2. Versioning

- The API uses URL-based versioning (e.g., `/v1/`).
- The version is incremented only for breaking changes.
- Breaking changes include:
  - Removing an endpoint.
  - Removing or renaming a field in a response.
  - Adding a new required field to a request.
  - Changing the data type of a field.
- Non-breaking changes (e.g., adding a new optional field, adding a new endpoint) do not require a version increment.

## 3. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| **Path Segments** | `kebab-case`, plural nouns | `/property-units` |
| **Query Parameters** | `snake_case` | `?sort_by=created_at` |
| **JSON Fields** | `camelCase` | `{"propertyId": "..."}` |
| **Path Parameters** | `camelCase` | `/properties/{propertyId}` |

## 4. Authentication & Authorization

- All endpoints, except for `POST /auth/login` and webhooks, must be protected.
- Authentication is handled via JWT Bearer tokens provided in the `Authorization` header.
- Authorization is implemented using Role-Based Access Control (RBAC). Each endpoint must have a clearly defined permission requirement.
- Sensitive operations must be logged in the audit trail.

## 5. Request & Response Formats

- All request and response bodies must be `application/json`.
- Successful responses:
  - `200 OK`: For successful `GET` requests.
  - `201 Created`: For successful `POST` requests that create a resource. The response body should contain the newly created resource, and the `Location` header should point to its URL.
  - `204 No Content`: For successful requests that don't return a body (e.g., `DELETE`).
- Error responses:
  - A consistent error response body must be used:
    ```json
    {
      "statusCode": 404,
      "message": "Property not found",
      "error": "Not Found",
      "requestId": "uuid-v4-request-id"
    }
    ```
  - `400 Bad Request`: For client-side errors like validation failures.
  - `401 Unauthorized`: For missing or invalid authentication credentials.
  - `403 Forbidden`: When the authenticated user does not have permission to perform the action.
  - `404 Not Found`: When the requested resource does not exist.
  - `429 Too Many Requests`: For rate limiting.
  - `500 Internal Server Error`: For unexpected server-side errors. The response should not expose stack traces or sensitive information.

## 6. Pagination, Sorting, and Filtering

- **Pagination**: All list endpoints must be paginated using `limit` and `offset` query parameters.
  - `?limit=25&offset=50`
  - `limit` should have a default value (e.g., 25) and a maximum value (e.g., 100).
  - The response should include pagination metadata:
    ```json
    {
      "data": [...],
      "pagination": {
        "total": 1234,
        "limit": 25,
        "offset": 50
      }
    }
    ```
- **Sorting**: Endpoints should support sorting via a `sort_by` parameter.
  - `?sort_by=createdAt:desc`
- **Filtering**: Endpoints should support filtering on key fields.
  - `?status=ACTIVE&type=residential`

## 7. Rate Limiting

- All authenticated endpoints are subject to rate limiting to prevent abuse.
- Default limits (per user): 100 requests/minute.
- Default limits (per IP for unauthenticated endpoints): 1000 requests/minute.
- The `429 Too Many Requests` response should include `Retry-After` headers.
