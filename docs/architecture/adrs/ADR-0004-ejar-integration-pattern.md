# ADR-0004: Ejar Integration Pattern

- **Status**: Accepted
- **Date**: 2026-02-16
- **Deciders**: Tech Lead, Backend Lead

## Context and Problem Statement

Integrating with the external Ejar system is a core requirement. This integration involves sending contract data to Ejar and receiving updates. The Ejar API may be slow or temporarily unavailable, and we must ensure that failures in this integration do not impact the core functionality of our platform or lead to data inconsistencies. We need to choose a pattern that is resilient and provides clear status tracking.

## Decision Drivers

- **Resilience**: The integration must tolerate Ejar API downtime or errors.
- **Data Consistency**: The status of a contract in our system must accurately reflect its status in Ejar.
- **Traceability**: We must have a clear log of all interactions with the Ejar API for auditing and debugging.
- **User Feedback**: The Property Manager needs to know the status of the synchronization (e.g., pending, successful, failed).

## Considered Options

1.  **Synchronous Blocking Call**: When a user creates a contract, the API makes a direct, blocking call to the Ejar API. The user waits until the Ejar sync is complete.
2.  **Asynchronous Polling**: The API responds quickly to the user after creating a local contract with a `PENDING_SYNC` status. A background job periodically polls our system for pending contracts and attempts to sync them with Ejar.
3.  **Asynchronous Queue-based Processing with Webhook**: The API creates a local contract and enqueues a background job to perform the Ejar sync. The contract status is `PENDING_SYNC`. The background job calls the Ejar API. We provide Ejar with a webhook URL to receive asynchronous confirmation once they have processed the contract.

## Decision Outcome

Chosen option: **"Asynchronous Queue-based Processing"**. While a webhook is ideal, the Ejar API documentation (as per our assumption) does not specify a webhook callback system. Therefore, the background job will have to poll the Ejar API for the status of the submitted contract after the initial submission.

**Refined Workflow:**
1.  User creates a contract in Munsiq. Status is set to `DRAFT`.
2.  API enqueues a `sync-ejar` job. The user gets an immediate response.
3.  A background worker picks up the job.
4.  The worker calls the Ejar API to submit the contract.
5.  If submission is successful, the worker updates the contract status in Munsiq to `PENDING_EJAR_CONFIRMATION` and enqueues a *second* job (`check-ejar-status`) with a delay (e.g., 5 minutes).
6.  The `check-ejar-status` worker calls the Ejar API's status endpoint for the contract.
7.  If status is confirmed (`ACTIVE`), the worker updates the Munsiq contract status to `ACTIVE`.
8.  If status is still pending, the job is re-enqueued with an increased delay (exponential backoff).
9.  If Ejar reports an error or the process fails after multiple retries, the status is set to `EJAR_SYNC_FAILED` and an alert is raised.

### Positive Consequences

- **High Resilience**: The system is not blocked by Ejar's availability or processing time. Failures are handled gracefully with retries.
- **Good User Experience**: The user does not have to wait for the integration to complete.
- **Durable**: The use of a persistent queue ensures that sync requests are not lost even if our system restarts.

### Negative Consequences

- **Increased Complexity**: This is the most complex pattern, involving multiple job types, status tracking, and a polling mechanism.
- **Delayed Consistency**: The contract status in Munsiq is not instantly consistent with Ejar's. There is a delay until the polling job confirms the status.
- **Dependency on Polling**: Relies on making repeated calls to the Ejar API, which could be inefficient if the processing time is long.

## Pros and Cons of the Options

### Synchronous Blocking Call

- **Pro**: Simple to implement.
- **Con**: **Terrible UX**. Users may face very long wait times.
- **Con**: **Very brittle**. Any failure in the Ejar API call will cause the entire user request to fail.

### Asynchronous Polling (Simple version)

- **Pro**: Decouples the user request from the sync process.
- **Con**: Less efficient. The polling job would query the entire database for pending contracts, which is less scalable than a targeted job queue.

### Asynchronous Queue-based Processing

- **Pro**: Most resilient and scalable option.
- **Pro**: Provides a clear, stateful workflow for each contract sync.
- **Con**: Highest implementation complexity.
- **Con**: Introduces delays and eventual consistency.
