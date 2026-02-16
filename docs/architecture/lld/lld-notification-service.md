_# Low-Level Design (LLD) — Notification Service

| Field | Value |
|-------|-------|
| Service Name | `notification-service` |
| NestJS Module | `NotificationModule` |
| Owner | Backend Lead |

## 1. Responsibilities

- Decouples notification sending from core business logic.
- Manages multiple notification channels (SMS, Email, In-App, Push).
- Handles notification templates and localization.
- Manages user notification preferences.
- Provides a unified interface for all services to send notifications.

## 2. API Endpoints

This service is primarily internal and driven by the message queue. It may expose minimal endpoints for managing templates or preferences.

| Method | Path | Description | Auth | RBAC Role |
|--------|------|-------------|------|-----------|
| `POST` | `/notifications/send` | (Internal) Send an ad-hoc notification | JWT | `Admin` |
| `GET` | `/users/{id}/preferences` | Get user notification preferences | JWT | `User` (self) |
| `PUT` | `/users/{id}/preferences` | Update user notification preferences | JWT | `User` (self) |

## 3. Data Model (Schema: `tenant_{id}`)

| Table | Column | Type | Constraints | Description |
|-------|--------|------|-------------|-------------|
| `notification_templates` | `id` | `uuid` | PK | Unique template ID |
| | `name` | `varchar(255)` | UNIQUE, NOT NULL | e.g., `invoice-due-reminder` |
| | `channel` | `enum('SMS', 'EMAIL', 'PUSH')` | NOT NULL | Target channel |
| | `locale` | `enum('ar', 'en')` | NOT NULL | Language of the template |
| | `template_body` | `text` | NOT NULL | Template content with placeholders |
| `notification_logs` | `id` | `uuid` | PK | Unique log ID |
| | `user_id` | `uuid` | FK -> `users.id` | Recipient user |
| | `channel` | `enum('SMS', 'EMAIL', 'PUSH', 'IN_APP')` | NOT NULL | Channel used |
| | `status` | `enum('SENT', 'FAILED', 'DELIVERED')` | NOT NULL | Delivery status |
| | `provider_ref_id` | `varchar(255)` | | ID from Twilio/SES |
| `user_notification_preferences` | `user_id` | `uuid` | PK, FK -> `users.id` | User ID |
| | `notification_type` | `varchar(100)` | PK | e.g., `payment-confirmation` |
| | `sms_enabled` | `boolean` | NOT NULL, default `true` | SMS channel enabled |
| | `email_enabled` | `boolean` | NOT NULL, default `true` | Email channel enabled |

## 4. Core Logic (Pseudocode)

```typescript
// This service is a consumer of the 'notifications' queue
class NotificationWorker {
  constructor(private twilioService, private sesService, private db) {}

  async processNotificationJob(job: Job<NotificationPayload>) {
    const { userId, type, data } = job.data;

    // 1. Get user and their notification preferences
    const user = await this.db.users.findUnique({ where: { id: userId } });
    const preferences = await this.db.user_notification_preferences.findMany({ where: { userId } });

    // 2. Determine which channels are enabled for this notification type
    const enabledChannels = this.getEnabledChannels(preferences, type);

    for (const channel of enabledChannels) {
      // 3. Get the correct template (type, channel, locale)
      const template = await this.db.notification_templates.findUnique({
        where: { name: type, channel, locale: user.locale }
      });

      // 4. Render the template with data
      const content = this.renderTemplate(template.template_body, data);

      // 5. Send via the appropriate provider
      let status = 'SENT';
      try {
        switch (channel) {
          case 'SMS':
            await this.twilioService.send(user.phone_number, content);
            break;
          case 'EMAIL':
            await this.sesService.send(user.email, content);
            break;
          // ... other channels
        }
      } catch (error) {
        status = 'FAILED';
      }

      // 6. Log the notification attempt
      await this.db.notification_logs.create({ data: { userId, channel, status, ... } });
    }
  }
}
```

## 5. Dependencies

- **Database:** `PostgreSQL`
- **Queue Service:** `BullMQ` (as a consumer).
- **Twilio Client:** Wrapper for the Twilio SMS API.
- **AWS SES Client:** Wrapper for the AWS SES Email API.
- **Template Engine:** A library like Handlebars or EJS for rendering templates.
