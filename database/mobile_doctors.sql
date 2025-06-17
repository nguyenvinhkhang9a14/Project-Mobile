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
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `doctorId` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `image` text,
  `description` text,
  `bioHTML` longtext,
  `specialtyId` int DEFAULT NULL,
  `clinicId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  `price` int DEFAULT '0',
  PRIMARY KEY (`doctorId`),
  KEY `specialtyId` (`specialtyId`),
  KEY `clinicId` (`clinicId`),
  KEY `userId` (`userId`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`specialtyId`) REFERENCES `specialties` (`specialtyId`) ON UPDATE CASCADE,
  CONSTRAINT `doctors_ibfk_2` FOREIGN KEY (`clinicId`) REFERENCES `clinics` (`clinicId`) ON UPDATE CASCADE,
  CONSTRAINT `doctors_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'doctor.a@example.com','Nguyễn','Văn A','/uploads/cuong.jpg','Bác sĩ chuyên khoa nội với hơn 20 năm kinh nghiệm trong chẩn đoán và điều trị các bệnh lý phức tạp. Tích cực nghiên cứu các phương pháp điều trị mới để mang đến dịch vụ chăm sóc tốt nhất cho bệnh nhân.','<ul><li>Bằng cấp: Tiến sĩ Y khoa</li><li>Chứng chỉ: Chuyên khoa Nội</li><li>Chứng chỉ: Nghiên cứu Y học nâng cao</li><li>Chứng chỉ: Điều trị bệnh mãn tính</li></ul>',1,1,'2025-06-04 16:04:15','2025-06-04 16:04:15',NULL,200000),(2,'doctor.b@example.com','Trần','Thị B','/uploads/doctor-2.jpg','Bác sĩ nhi khoa tận tâm, có hơn 15 năm kinh nghiệm trong điều trị các bệnh lý trẻ em và tư vấn dinh dưỡng giúp trẻ phát triển toàn diện. Được đánh giá cao về khả năng giao tiếp và tương tác với trẻ.','<ul><li>Bằng cấp: Thạc sĩ Nhi khoa</li><li>Chứng chỉ: Chuyên khoa Nhi</li><li>Chứng chỉ: Dinh dưỡng trẻ em</li><li>Chứng chỉ: Tâm lý trẻ em</li></ul>',2,2,'2025-06-04 16:04:15','2025-06-04 16:04:15',NULL,250000),(3,'doctor.c@example.com','Lê','Văn C','/uploads/doctor-4.jpg','Chuyên gia da liễu hàng đầu, có hơn 18 năm kinh nghiệm trong điều trị các bệnh lý về da như viêm da, dị ứng và chăm sóc da thẩm mỹ. Đã tham gia nhiều hội nghị quốc tế về da liễu.','<ul><li>Bằng cấp: Tiến sĩ Da liễu</li><li>Chứng chỉ: Chăm sóc da chuyên sâu</li><li>Chứng chỉ: Điều trị bệnh về da</li><li>Chứng chỉ: Laser thẩm mỹ</li></ul>',3,1,'2025-06-04 16:04:15','2025-06-04 16:04:15',NULL,600000),(4,'doctor.a@example.com','Nguyễn','Văn D','/uploads/doctor-5.jpg','Bác sĩ chuyên khoa ngoại với hơn 25 năm kinh nghiệm trong lĩnh vực phẫu thuật tổng quát. Có tay nghề cao trong phẫu thuật nội soi và các phương pháp điều trị hiện đại, giúp bệnh nhân phục hồi nhanh chóng.','<ul><li>Bằng cấp: Tiến sĩ Y khoa</li><li>Chứng chỉ: Phẫu thuật tổng quát</li><li>Chứng chỉ: Phẫu thuật nội soi</li><li>Chứng chỉ: Hồi phục sau phẫu thuật</li></ul>',1,1,'2025-06-04 16:04:15','2025-06-04 16:04:15',NULL,300000),(5,'doctor.b@example.com','Trần','Thị E','/uploads/doctor-6.jpg','Bác sĩ tim mạch với hơn 22 năm kinh nghiệm, chuyên điều trị các bệnh lý tim mạch và tư vấn sức khỏe tim mạch. Có nhiều đóng góp trong các công trình nghiên cứu về bệnh tim mạch.','<ul><li>Bằng cấp: Thạc sĩ Tim mạch</li><li>Chứng chỉ: Chẩn đoán bệnh tim</li><li>Chứng chỉ: Điều trị suy tim</li><li>Chứng chỉ: Tư vấn sức khỏe tim mạch</li></ul>',2,2,'2025-06-04 16:04:15','2025-06-04 16:04:15',NULL,450000),(6,'doctor.c@example.com','Lê','Văn F','/uploads/khang.jpg','Bác sĩ tai mũi họng với hơn 17 năm kinh nghiệm trong điều trị các bệnh về đường hô hấp và phẫu thuật tai mũi họng. Luôn tìm kiếm những phương pháp điều trị tiên tiến để mang lại kết quả tốt nhất cho bệnh nhân.','<ul><li>Bằng cấp: Thạc sĩ Tai Mũi Họng</li><li>Chứng chỉ: Phẫu thuật tai mũi họng</li><li>Chứng chỉ: Điều trị viêm xoang</li><li>Chứng chỉ: Liệu pháp hô hấp</li></ul>',3,1,'2025-06-04 16:04:15','2025-06-04 16:04:15',NULL,500000);
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
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
