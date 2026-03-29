CREATE DATABASE bichofull_db;
USE bichofull_db;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `isActive` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `wallets`;

CREATE TABLE `wallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_2ecdb33f23e9a6fc392025c0b9` (`userId`),
  CONSTRAINT `FK_2ecdb33f23e9a6fc392025c0b97` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `bets`;

CREATE TABLE `bets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` decimal(10,2) NOT NULL,
  `animalName` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','WON','LOST') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int DEFAULT NULL,
  `type` enum('grupo','dezena','milhar') NOT NULL,
  `chosenNumber` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ca8cf669d26fbfcc365a4811b22` (`userId`),
  CONSTRAINT `FK_ca8cf669d26fbfcc365a4811b22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `draws`;

CREATE TABLE `draws` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('grupo','dezena','milhar') NOT NULL DEFAULT 'milhar',
  `winningNumber` varchar(255) NOT NULL,
  `allNumbers` text,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
