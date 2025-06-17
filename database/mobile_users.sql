-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: mobile
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','doctor','patient') DEFAULT 'patient',
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'huan@123','$2b$10$t7IaLv0Zpcr6Jm.Xt8CtR.vxUN4cCqDzWZqto57uNrHPNw9pZotre','patient','rose','huan',NULL,NULL,NULL,NULL,'2025-06-05 05:20:46','2025-06-05 05:20:46'),(2,'Khang@123','$2b$10$bjIObboPXrhfGGAP0DbWduAI9BPm0wCxI6AJAIhgo5sE3bfkmFnuS','patient','Nguyen','Khang',NULL,NULL,NULL,NULL,'2025-06-06 01:09:27','2025-06-06 01:09:27'),(3,'khang','$2b$10$T7wdpES/sdGJikqrn8yZAO6fBSCLMzo1iyWAHhEGcBEk8ki1xFife','patient','Vinh','Khang',NULL,NULL,NULL,NULL,'2025-06-06 01:11:55','2025-06-06 01:11:55'),(4,'xuanhuan921@gmail.com','$2b$10$.e7lKEcc719xddZTyRZRjOWIRddoZdGzkqoPtI2y9o2KF3JruaDBa','patient','Huan','Nguyen','012345678','jjok',NULL,NULL,'2025-06-09 01:26:16','2025-06-12 01:42:45'),(5,'tan','$2b$10$q8AdoDMP/h/P0s8NPgAlWuBq8cBmApG7DRO5UmoPNhp1/4cdPZNG.','doctor','tan','phu',NULL,NULL,NULL,NULL,'2025-06-09 05:15:05','2025-06-09 05:15:05'),(6,'a','$2b$10$hmZwFHz4JBD0LJcDO38ILem4cwFhf9vUaiVslTHpJ3wT2kTzO65pa','patient','a','a',NULL,NULL,NULL,NULL,'2025-06-09 05:19:46','2025-06-09 05:19:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-17 21:07:25
