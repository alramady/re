CREATE TABLE `adminPermissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`permissions` json NOT NULL,
	`isRootAdmin` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminPermissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `districts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city` varchar(100) NOT NULL,
	`cityAr` varchar(100) NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`nameAr` varchar(100) NOT NULL,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`isActive` boolean DEFAULT true,
	CONSTRAINT `districts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userActivities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(50) NOT NULL,
	`page` varchar(255),
	`metadata` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`sessionId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userActivities_id` PRIMARY KEY(`id`)
);
