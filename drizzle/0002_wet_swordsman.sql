ALTER TABLE `users` ADD `userId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `displayName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_userId_unique` UNIQUE(`userId`);