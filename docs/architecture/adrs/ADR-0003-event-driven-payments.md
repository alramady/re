# ADR-0003: Event-Driven vs. Synchronous Processing for Payments

- **Status**: Accepted
- **Date**: 2026-02-16
- **Deciders**: Tech Lead, Backend Lead

## Context and Problem Statement

Payment processing involves multiple steps: generating an invoice, registering it with SADAD, sending notifications, receiving a payment callback, and updating system status. Performing all these actions synchronously within a single API request can lead to long response times and poor resilience. We need to decide on a reliable and scalable pattern for handling these workflows.

## Decision Drivers

- **Resilience**: The system must be resilient to failures in external services (e.g., SADAD, Twilio).
- **User Experience**: The user should receive a fast response after initiating an action, not wait for the entire backend process to complete.
- **Scalability**: The system must handle a high volume of payments and notifications without performance degradation.
- **Traceability**: It should be possible to track the status of each step in the payment workflow.

## Considered Options

1.  **Synchronous API Calls**: The initial API request triggers a chain of direct function calls to all required services (SADAD, Notification, etc.) and only returns a response when all steps are complete.
2.  **Asynchronous Event-Driven Choreography**: The initial API request creates a primary resource (e.g., a contract) and publishes an event (e.g., `contract.created`). Downstream services listen for this event and perform their actions independently, publishing further events as they complete their work.

## Decision Outcome

Chosen option: **"Asynchronous Event-Driven Choreography"**, using a message queue (Redis/BullMQ).

### Positive Consequences

- **Improved Resilience**: If an external service like the SADAD API is down, the job can be retried automatically from the queue without the user's request failing. The system is more fault-tolerant.
- **Enhanced User Experience**: The initial API call is very fast, as it only needs to create a database record and enqueue a job. The user gets immediate feedback.
- **Increased Scalability**: We can scale the number of background workers independently of the API servers to process a high volume of jobs from the queue.
- **Decoupling**: Services are loosely coupled. The Contract Service doesn't need to know the implementation details of the Payment or Notification services; it just emits an event.

### Negative Consequences

- **Increased Complexity**: This pattern introduces a message broker and background workers, which adds to the system's complexity and requires robust monitoring.
- **Eventual Consistency**: The system state is not updated instantly. For example, an invoice won't exist the microsecond after a contract is created. The UI must be designed to handle this (e.g., by showing a "Processing" status).
- **Difficult to Debug**: Tracing a single request across multiple asynchronous services and events can be more challenging than debugging a synchronous call stack. Requires good distributed tracing and logging.

## Pros and Cons of the Options

### Synchronous API Calls

- **Pro**: Simple to implement and debug.
- **Pro**: Data is strongly consistent.
- **Con**: **Brittle and not resilient**. A failure in any single step (e.g., notification service fails) causes the entire request to fail.
- **Con**: **Poor user experience**. The user has to wait for all external API calls to complete, leading to slow response times.
- **Con**: Poor scalability. Ties up API server resources for long-running processes.

### Asynchronous Event-Driven Choreography

- **Pro**: Highly resilient and scalable.
- **Pro**: Excellent user experience with fast initial responses.
- **Pro**: Services are decoupled, improving maintainability.
- **Con**: More complex infrastructure (message queue, workers).
- **Con**: Requires handling eventual consistency in the UI and system logic.
- **Con**: Debugging and tracing are more complex.
