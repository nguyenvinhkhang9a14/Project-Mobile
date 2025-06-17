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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `bookingId` int NOT NULL AUTO_INCREMENT,
  `status` int DEFAULT '0',
  `doctorId` int DEFAULT NULL,
  `patientId` int DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `timeType` varchar(255) DEFAULT NULL,
  `symptomDescription` text,
  `consultationNote` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`bookingId`),
  KEY `doctorId` (`doctorId`),
  KEY `patientId` (`patientId`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`doctorId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`patientId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (12,0,1,1,'2025-06-06','morning','asd',NULL,'2025-06-05 06:12:46','2025-06-05 06:12:46'),(13,0,1,1,'2025-06-06','morning','hg',NULL,'2025-06-05 07:21:46','2025-06-05 07:21:46'),(14,0,NULL,1,'2025-06-08','afternoon','asdas',NULL,'2025-06-05 08:03:29','2025-06-05 08:03:29'),(15,0,1,3,'2025-06-07','afternoon','asd',NULL,'2025-06-06 06:22:14','2025-06-06 06:22:14'),(16,0,2,3,'2025-06-07','morning','hgh',NULL,'2025-06-06 07:00:38','2025-06-06 07:00:38'),(17,0,3,3,'2025-06-06','morning','huhu',NULL,'2025-06-06 07:10:19','2025-06-06 07:10:19'),(18,0,3,3,'2025-06-06','morning','aaa',NULL,'2025-06-06 07:11:16','2025-06-06 07:11:16'),(19,0,1,3,'2025-06-08','morning','asd',NULL,'2025-06-07 14:06:55','2025-06-07 14:06:55'),(20,0,NULL,3,'2025-06-09','afternoon','asd',NULL,'2025-06-08 06:15:56','2025-06-08 06:15:56'),(21,0,NULL,3,'2025-06-09','morning','ds',NULL,'2025-06-08 06:25:37','2025-06-08 06:25:37'),(22,0,1,3,'2025-06-09','morning','asd',NULL,'2025-06-08 14:15:02','2025-06-08 14:15:02'),(23,0,2,3,'2025-06-10','morning','asd',NULL,'2025-06-08 14:20:27','2025-06-08 14:20:27'),(24,0,6,3,'2025-06-10','morning','asd',NULL,'2025-06-08 14:22:22','2025-06-08 14:22:22'),(25,0,5,3,'2025-06-09','morning','huan',NULL,'2025-06-08 14:25:42','2025-06-08 14:25:42'),(26,0,2,3,'2025-06-11','afternoon','dau dau',NULL,'2025-06-08 15:15:26','2025-06-08 15:15:26'),(27,0,2,3,'2025-06-11','afternoon','dau dau',NULL,'2025-06-08 15:15:29','2025-06-08 15:15:29'),(28,0,2,3,'2025-06-11','afternoon','dau dau',NULL,'2025-06-08 15:17:29','2025-06-08 15:17:29'),(29,0,2,3,'2025-06-11','afternoon','dau dau',NULL,'2025-06-08 15:17:44','2025-06-08 15:17:44'),(30,0,2,3,'2025-06-11','afternoon','dau dau',NULL,'2025-06-08 15:18:16','2025-06-08 15:18:16'),(31,0,2,3,'2025-06-08','morning','asd',NULL,'2025-06-08 15:19:44','2025-06-08 15:19:44'),(32,0,2,3,'2025-06-08','morning','asd',NULL,'2025-06-08 15:22:12','2025-06-08 15:22:12'),(33,0,6,3,'2025-06-12','afternoon','huanaaaa',NULL,'2025-06-08 15:26:25','2025-06-08 15:26:25'),(34,0,4,3,'2025-06-08','afternoon','asd',NULL,'2025-06-08 15:36:00','2025-06-08 15:36:00'),(35,0,3,3,'2025-06-10','afternoon','asd',NULL,'2025-06-08 15:38:22','2025-06-08 15:38:22'),(36,0,5,3,'2025-06-09','afternoon','asdasd',NULL,'2025-06-08 15:39:23','2025-06-08 15:39:23'),(37,0,5,3,'2025-06-09','afternoon','asdasd',NULL,'2025-06-08 15:39:36','2025-06-08 15:39:36'),(38,0,5,3,'2025-06-09','afternoon','asdasd',NULL,'2025-06-08 15:40:49','2025-06-08 15:40:49'),(39,0,5,3,'2025-06-09','afternoon','asdasd',NULL,'2025-06-08 15:41:03','2025-06-08 15:41:03'),(40,0,5,3,'2025-06-09','afternoon','asdasd',NULL,'2025-06-08 15:41:58','2025-06-08 15:41:58'),(41,0,3,3,'2025-06-09','morning','asd',NULL,'2025-06-09 01:24:11','2025-06-09 01:24:11'),(42,3,1,4,'2025-06-11','morning','dau bung',NULL,'2025-06-09 01:36:20','2025-06-09 08:38:23'),(43,0,1,4,'Thứ Ba, 10 tháng 6, 2025','08:00','asd',NULL,'2025-06-09 01:39:44','2025-06-09 05:04:11'),(44,3,1,4,'2025-06-09','afternoon','a',NULL,'2025-06-09 01:40:17','2025-06-09 02:52:55'),(45,3,2,4,'2025-06-09','afternoon','asd',NULL,'2025-06-09 01:44:08','2025-06-09 04:12:00'),(46,0,4,4,'Thứ Tư, 11 tháng 6, 2025','13:00','hg',NULL,'2025-06-09 01:47:57','2025-06-09 05:04:19'),(47,0,2,4,'2025-06-13','afternoon','asd',NULL,'2025-06-09 01:51:48','2025-06-09 04:13:27'),(48,3,2,4,'2025-06-15','afternoon','Sore Throat',NULL,'2025-06-09 01:53:59','2025-06-12 01:57:46'),(49,3,2,4,'2025-06-13','afternoon','asd',NULL,'2025-06-09 01:54:54','2025-06-09 05:34:04'),(50,0,2,4,'2025-06-12','afternoon','asd',NULL,'2025-06-09 01:55:07','2025-06-09 04:49:38'),(51,0,2,4,'2025-06-13','afternoon','huhuhuhu',NULL,'2025-06-09 01:55:20','2025-06-09 05:02:04'),(52,0,2,4,'Thứ Hai, 9 tháng 6, 2025','08:00','asd',NULL,'2025-06-09 01:56:05','2025-06-09 05:03:09'),(53,0,1,4,'2025-06-12','afternoon','hihihihihihi',NULL,'2025-06-09 02:03:06','2025-06-09 05:07:13'),(54,0,1,4,'Thứ Tư, 11 tháng 6, 2025','13:00','jlkjlk',NULL,'2025-06-09 02:36:18','2025-06-09 05:04:27'),(55,0,1,4,'Thứ Hai, 9 tháng 6, 2025','08:00','8',NULL,'2025-06-09 02:55:04','2025-06-09 05:03:42'),(56,0,2,4,'Thứ Hai, 9 tháng 6, 2025','08:00','f',NULL,'2025-06-09 03:03:06','2025-06-09 05:03:21'),(57,0,1,4,'2025-06-11','morning','Dau bung',NULL,'2025-06-09 07:10:55','2025-06-09 07:10:55'),(58,0,1,4,'2025-06-11','morning','dau bung',NULL,'2025-06-09 08:37:13','2025-06-09 08:37:13'),(59,0,6,4,'2025-06-14','afternoon','Headache',NULL,'2025-06-12 01:52:10','2025-06-12 01:52:10');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
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
