-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: storemanagement
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `attribute`
--

DROP TABLE IF EXISTS `attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attribute_index_14` (`id`),
  KEY `attribute_index_15` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute`
--

LOCK TABLES `attribute` WRITE;
/*!40000 ALTER TABLE `attribute` DISABLE KEYS */;
INSERT INTO `attribute` VALUES (9,'Chất liệu'),(5,'Công suất/Khối lượng'),(2,'Dung lượng'),(7,'Độ phân giải'),(4,'Kích thước'),(6,'Kiểu dáng'),(8,'Loại màn hình'),(1,'Màu sắc'),(3,'RAM');
/*!40000 ALTER TABLE `attribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_index_4` (`id`),
  KEY `category_index_5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (7,'Âm thanh'),(1,'Điện thoại'),(6,'Gia dụng'),(3,'Laptop'),(5,'Máy giặt'),(2,'Tivi'),(4,'Tủ lạnh');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `customer_index_20` (`id`),
  KEY `customer_index_21` (`phone`),
  KEY `customer_index_22` (`email`),
  KEY `customer_index_23` (`isDeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Khách Hàng Vip','0999999999','vip@example.com',150,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(2,'Huy','0123654789','',5450,'2026-05-11 15:40:01','2026-05-11 16:44:08',0);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exportdetail`
--

DROP TABLE IF EXISTS `exportdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exportdetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exportReceiptId` int NOT NULL,
  `variantId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `errorNote` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exportDetail_index_53` (`id`),
  KEY `exportDetail_index_54` (`exportReceiptId`),
  KEY `exportDetail_index_55` (`variantId`),
  CONSTRAINT `exportdetail_ibfk_1` FOREIGN KEY (`exportReceiptId`) REFERENCES `exportreceipt` (`id`),
  CONSTRAINT `exportdetail_ibfk_2` FOREIGN KEY (`variantId`) REFERENCES `variant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exportdetail`
--

LOCK TABLES `exportdetail` WRITE;
/*!40000 ALTER TABLE `exportdetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `exportdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exportreceipt`
--

DROP TABLE IF EXISTS `exportreceipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exportreceipt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplierId` int NOT NULL,
  `exportDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalAmount` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `exportReceipt_index_49` (`id`),
  KEY `exportReceipt_index_50` (`supplierId`),
  KEY `exportReceipt_index_51` (`exportDate`),
  KEY `exportReceipt_index_52` (`isDeleted`),
  CONSTRAINT `exportreceipt_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exportreceipt`
--

LOCK TABLES `exportreceipt` WRITE;
/*!40000 ALTER TABLE `exportreceipt` DISABLE KEYS */;
/*!40000 ALTER TABLE `exportreceipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `importdetail`
--

DROP TABLE IF EXISTS `importdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `importdetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `importReceiptId` int NOT NULL,
  `variantId` int NOT NULL,
  `supplierId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `importPrice` decimal(19,3) DEFAULT NULL,
  `lineTotal` decimal(19,3) DEFAULT NULL,
  `batchNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `importDetail_index_45` (`id`),
  KEY `importDetail_index_46` (`importReceiptId`),
  KEY `importDetail_index_47` (`variantId`),
  KEY `importDetail_index_48` (`supplierId`),
  CONSTRAINT `importdetail_ibfk_1` FOREIGN KEY (`importReceiptId`) REFERENCES `importreceipt` (`id`),
  CONSTRAINT `importdetail_ibfk_2` FOREIGN KEY (`variantId`) REFERENCES `variant` (`id`),
  CONSTRAINT `importdetail_ibfk_3` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `importdetail`
--

LOCK TABLES `importdetail` WRITE;
/*!40000 ALTER TABLE `importdetail` DISABLE KEYS */;
INSERT INTO `importdetail` VALUES (1,1,1,3,50,20993000.000,1049650000.000,'BATCH-IP-001','2025-12-31');
/*!40000 ALTER TABLE `importdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `importreceipt`
--

DROP TABLE IF EXISTS `importreceipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `importreceipt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplierId` int NOT NULL,
  `importDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `totalAmount` decimal(19,3) NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `importReceipt_index_41` (`id`),
  KEY `importReceipt_index_42` (`supplierId`),
  KEY `importReceipt_index_43` (`importDate`),
  KEY `importReceipt_index_44` (`isDeleted`),
  CONSTRAINT `importreceipt_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `importreceipt`
--

LOCK TABLES `importreceipt` WRITE;
/*!40000 ALTER TABLE `importreceipt` DISABLE KEYS */;
INSERT INTO `importreceipt` VALUES (1,3,'2026-05-11 15:30:49',1049650000.000,'Nhập lô iPhone 15 Pro Max','2026-05-11 15:30:49','2026-05-11 15:30:49',0);
/*!40000 ALTER TABLE `importreceipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int DEFAULT NULL,
  `staffId` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `subTotal` decimal(19,3) DEFAULT NULL,
  `discountAmount` decimal(19,3) DEFAULT NULL,
  `taxAmount` decimal(19,3) DEFAULT NULL,
  `finalTotal` decimal(19,3) DEFAULT NULL,
  `paymentMethod` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refundAmount` decimal(19,3) DEFAULT '0.000',
  `status` enum('Draft','Completed','Cancelled','Warranty') COLLATE utf8mb4_unicode_ci DEFAULT 'Completed',
  `paymentReference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_index_32` (`id`),
  KEY `order_index_33` (`customerId`),
  KEY `order_index_34` (`staffId`),
  KEY `order_index_35` (`createdAt`),
  KEY `order_index_36` (`isDeleted`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`),
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`),
  CONSTRAINT `order_chk_1` CHECK ((`refundAmount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,1,1,'2026-05-11 15:30:49',29990000.000,0.000,2999000.000,32989000.000,'Tiền mặt',0.000,'Completed',NULL,'2026-05-11 15:30:49',0),(2,NULL,1,'2026-05-11 15:30:49',26990000.000,0.000,2699000.000,29689000.000,'Tiền mặt',0.000,'Completed',NULL,'2026-05-11 15:30:49',0),(3,NULL,1,'2026-05-11 15:30:49',32900000.000,0.000,3290000.000,36190000.000,'Tiền mặt',0.000,'Completed',NULL,'2026-05-11 15:30:49',0),(4,NULL,1,'2026-05-11 15:30:49',23500000.000,0.000,2350000.000,25850000.000,'Tiền mặt',0.000,'Completed',NULL,'2026-05-11 15:30:49',0),(5,NULL,1,'2026-05-11 15:30:49',28900000.000,0.000,2890000.000,31790000.000,'Tiền mặt',31790000.000,'Warranty',NULL,'2026-05-11 16:32:30',0),(6,NULL,4,'2026-05-11 15:39:38',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(7,2,4,'2026-05-11 15:39:38',196590000.000,0.000,0.000,196590000.000,'Chuyển khoản',0.000,'Completed',NULL,'2026-05-11 15:40:06',0),(8,2,4,'2026-05-11 15:40:12',189660000.000,0.000,0.000,189660000.000,'Tiền mặt',0.000,'Completed',NULL,'2026-05-11 15:40:37',0),(9,2,4,'2026-05-11 15:40:39',151690000.000,0.000,0.000,151690000.000,'Chuyển khoản',0.000,'Completed',NULL,'2026-05-11 15:41:02',0),(10,NULL,4,'2026-05-11 15:41:12',196180000.000,0.000,0.000,196180000.000,'Chuyển khoản',0.000,'Completed',NULL,'2026-05-11 15:41:46',0),(11,NULL,4,'2026-05-11 15:41:52',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(12,NULL,4,'2026-05-11 15:42:30',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(13,NULL,4,'2026-05-11 15:42:30',114670000.000,0.000,0.000,114670000.000,'Tiền mặt',0.000,'Completed',NULL,'2026-05-11 15:42:34',0),(14,NULL,4,'2026-05-11 15:42:45',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(15,NULL,4,'2026-05-11 15:49:55',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(16,NULL,4,'2026-05-11 15:49:55',229680000.000,0.000,0.000,229680000.000,'Chuyển khoản',51700000.000,'Warranty',NULL,'2026-05-11 16:32:30',0),(17,NULL,4,'2026-05-11 15:50:11',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(18,NULL,4,'2026-05-11 15:53:25',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(19,NULL,4,'2026-05-11 15:53:25',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(20,NULL,4,'2026-05-11 15:59:47',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(21,NULL,4,'2026-05-11 15:59:47',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(22,NULL,4,'2026-05-11 16:05:23',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(23,NULL,4,'2026-05-11 16:05:23',204180000.000,0.000,0.000,204180000.000,'Chuyển khoản',0.000,'Completed',NULL,'2026-05-11 16:05:35',0),(24,NULL,4,'2026-05-11 16:05:46',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(25,NULL,4,'2026-05-11 16:05:54',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(26,NULL,4,'2026-05-11 16:05:54',217180000.000,0.000,0.000,217180000.000,'Chuyển khoản',0.000,'Completed',NULL,'2026-05-11 16:06:01',0),(27,NULL,4,'2026-05-11 16:06:07',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(28,NULL,4,'2026-05-11 16:13:29',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(29,NULL,4,'2026-05-11 16:13:29',208580000.000,0.000,0.000,208580000.000,'Tiền mặt',10439000.000,'Warranty',NULL,'2026-05-11 16:20:30',0),(30,NULL,4,'2026-05-11 16:13:38',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(31,NULL,4,'2026-05-11 16:21:23',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(32,NULL,4,'2026-05-11 16:21:23',204180000.000,0.000,0.000,204180000.000,'Chuyển khoản',38390000.000,'Warranty',NULL,'2026-05-11 16:32:30',0),(33,NULL,4,'2026-05-11 16:21:36',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(34,NULL,4,'2026-05-11 16:23:18',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(35,2,4,'2026-05-11 16:23:18',183180000.000,0.000,0.000,183180000.000,'Chuyển khoản',29689000.000,'Warranty',NULL,'2026-05-11 16:40:22',0),(36,NULL,4,'2026-05-11 16:23:37',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:26:20',0),(37,NULL,4,'2026-05-11 16:33:20',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:33:20',0),(38,NULL,4,'2026-05-11 16:33:20',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:33:20',0),(39,NULL,4,'2026-05-11 16:33:52',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:33:52',0),(40,NULL,4,'2026-05-11 16:33:52',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:33:52',0),(41,NULL,4,'2026-05-11 16:39:25',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:25',0),(42,NULL,4,'2026-05-11 16:39:25',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:25',0),(43,NULL,4,'2026-05-11 16:39:28',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:28',0),(44,NULL,4,'2026-05-11 16:39:28',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:28',0),(45,NULL,4,'2026-05-11 16:39:28',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:28',0),(46,NULL,4,'2026-05-11 16:39:28',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:28',0),(47,NULL,4,'2026-05-11 16:39:28',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:28',0),(48,NULL,4,'2026-05-11 16:39:28',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:28',0),(49,NULL,4,'2026-05-11 16:39:28',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:28',0),(50,NULL,4,'2026-05-11 16:39:28',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:39:28',0),(51,NULL,4,'2026-05-11 16:40:29',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:40:29',0),(52,NULL,4,'2026-05-11 16:40:29',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:40:29',0),(53,NULL,4,'2026-05-11 16:43:18',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:43:18',0),(54,NULL,4,'2026-05-11 16:43:18',166080000.000,9733500.000,15634650.000,171981150.000,'Chuyển khoản',0.000,'Completed',NULL,'2026-05-11 16:43:29',0),(55,NULL,4,'2026-05-11 16:43:30',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:43:30',0),(56,NULL,4,'2026-05-11 16:43:35',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:43:35',0),(57,NULL,4,'2026-05-11 16:43:35',229080000.000,9733500.000,21934650.000,241281150.000,'Tiền mặt',36190000.000,'Completed',NULL,'2026-05-12 07:25:44',0),(58,NULL,4,'2026-05-11 16:43:42',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:43:42',0),(59,NULL,4,'2026-05-11 16:43:47',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:43:47',0),(60,2,4,'2026-05-11 16:43:47',232480000.000,10308500.000,22274650.000,244446150.000,'Chuyển khoản',94468000.000,'Warranty',NULL,'2026-05-12 04:10:04',0),(61,NULL,4,'2026-05-11 16:44:09',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:44:09',0),(62,NULL,4,'2026-05-11 16:44:35',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:44:35',0),(63,NULL,4,'2026-05-11 16:44:35',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:44:35',0),(64,NULL,4,'2026-05-11 16:52:19',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:52:19',0),(65,NULL,4,'2026-05-11 16:52:19',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-11 16:52:19',0),(66,NULL,5,'2026-05-12 04:08:39',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 04:08:39',0),(67,NULL,5,'2026-05-12 04:08:39',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 04:08:39',0),(68,NULL,4,'2026-05-12 04:11:09',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 04:11:09',0),(69,NULL,4,'2026-05-12 04:11:09',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 04:11:09',0),(70,NULL,4,'2026-05-12 07:25:04',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Completed',NULL,'2026-05-12 07:25:04',0),(71,NULL,4,'2026-05-12 07:25:04',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Completed',NULL,'2026-05-12 07:25:04',0),(72,NULL,4,'2026-05-12 07:33:54',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 07:33:54',0),(73,NULL,4,'2026-05-12 07:33:54',204080000.000,9733500.000,19434650.000,213781150.000,'Tiền mặt',40150000.000,'Warranty',NULL,'2026-05-12 07:35:49',0),(74,NULL,4,'2026-05-12 07:34:31',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 07:34:31',0),(75,NULL,4,'2026-05-12 07:39:27',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 07:39:27',0),(76,NULL,4,'2026-05-12 07:39:27',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 07:39:27',0),(77,NULL,4,'2026-05-12 08:26:50',153590000.000,5235000.000,14835500.000,163190500.000,'Chuyển khoản',0.000,'Completed',NULL,'2026-05-12 08:27:05',0),(78,NULL,4,'2026-05-12 08:26:50',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 08:26:50',0),(79,NULL,4,'2026-05-12 08:27:09',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 08:27:09',0),(80,NULL,4,'2026-05-12 08:30:22',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 08:30:22',0),(81,NULL,4,'2026-05-12 08:30:22',84280000.000,4498500.000,7978150.000,87759650.000,'Chuyển khoản',0.000,'Completed',NULL,'2026-05-12 08:30:32',0),(82,NULL,4,'2026-05-12 08:30:34',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 08:30:34',0),(83,NULL,4,'2026-05-12 08:34:33',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 08:34:33',0),(84,NULL,4,'2026-05-12 08:34:33',0.000,0.000,0.000,0.000,'Tiền mặt',0.000,'Draft',NULL,'2026-05-12 08:34:33',0);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetail`
--

DROP TABLE IF EXISTS `orderdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `variantId` int NOT NULL,
  `serialCode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unitPrice` decimal(19,3) NOT NULL,
  `totalDiscount` decimal(19,3) DEFAULT NULL,
  `lineTotal` decimal(19,3) NOT NULL,
  `returnedQuantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `orderDetail_index_37` (`id`),
  KEY `orderDetail_index_38` (`orderId`),
  KEY `orderDetail_index_39` (`variantId`),
  KEY `orderDetail_index_40` (`serialCode`),
  CONSTRAINT `orderdetail_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`),
  CONSTRAINT `orderdetail_ibfk_2` FOREIGN KEY (`variantId`) REFERENCES `variant` (`id`),
  CONSTRAINT `orderdetail_chk_1` CHECK ((`returnedQuantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetail`
--

LOCK TABLES `orderdetail` WRITE;
/*!40000 ALTER TABLE `orderdetail` DISABLE KEYS */;
INSERT INTO `orderdetail` VALUES (1,1,1,'SERIAL-IP15PM-0001',1,29990000.000,0.000,29990000.000,0),(2,2,2,'SERIAL-S24U-0001',1,26990000.000,0.000,26990000.000,0),(3,3,3,'SERIAL-ZFOLD5-0001',1,32900000.000,0.000,32900000.000,0),(4,4,4,'SERIAL-IP14P-0001',1,23500000.000,0.000,23500000.000,0),(5,5,5,'SERIAL-XI14U-0001',1,28900000.000,0.000,28900000.000,1),(6,7,3,'N/A',1,32900000.000,NULL,32900000.000,0),(7,7,1,'N/A',1,29990000.000,NULL,29990000.000,0),(8,7,5,'N/A',1,28900000.000,NULL,28900000.000,0),(9,7,6,'N/A',1,22900000.000,NULL,22900000.000,0),(10,7,14,'N/A',1,23900000.000,NULL,23900000.000,0),(11,7,13,'N/A',1,36500000.000,NULL,36500000.000,0),(12,7,26,'N/A',1,21500000.000,NULL,21500000.000,0),(13,8,1,'N/A',1,29990000.000,NULL,29990000.000,0),(14,8,2,'N/A',1,26990000.000,NULL,26990000.000,0),(15,8,10,'N/A',1,11900000.000,NULL,11900000.000,0),(16,8,9,'N/A',1,9490000.000,NULL,9490000.000,0),(17,8,8,'N/A',1,9990000.000,NULL,9990000.000,0),(18,8,11,'N/A',1,34900000.000,NULL,34900000.000,0),(19,8,13,'N/A',1,36500000.000,NULL,36500000.000,0),(20,8,19,'N/A',1,29900000.000,NULL,29900000.000,0),(21,9,8,'N/A',1,9990000.000,NULL,9990000.000,0),(22,9,10,'N/A',1,11900000.000,NULL,11900000.000,0),(23,9,16,'N/A',1,16900000.000,NULL,16900000.000,0),(24,9,17,'N/A',1,14500000.000,NULL,14500000.000,0),(25,9,18,'N/A',1,14900000.000,NULL,14900000.000,0),(26,9,28,'N/A',1,26500000.000,NULL,26500000.000,0),(27,9,33,'N/A',1,32500000.000,NULL,32500000.000,0),(28,9,32,'N/A',1,24500000.000,NULL,24500000.000,0),(29,10,1,'N/A',1,29990000.000,NULL,29990000.000,0),(30,10,2,'N/A',1,26990000.000,NULL,26990000.000,0),(31,10,10,'N/A',1,11900000.000,NULL,11900000.000,0),(32,10,11,'N/A',1,34900000.000,NULL,34900000.000,0),(33,10,12,'N/A',1,55900000.000,NULL,55900000.000,0),(34,10,13,'N/A',1,36500000.000,NULL,36500000.000,0),(35,13,2,'N/A',1,26990000.000,NULL,26990000.000,0),(36,13,9,'N/A',1,9490000.000,NULL,9490000.000,0),(37,13,10,'N/A',1,11900000.000,NULL,11900000.000,0),(38,13,11,'N/A',1,34900000.000,NULL,34900000.000,0),(39,13,20,'N/A',1,7490000.000,NULL,7490000.000,1),(40,13,14,'N/A',1,23900000.000,NULL,23900000.000,0),(41,16,1,'N/A',1,29990000.000,NULL,29990000.000,0),(42,16,2,'N/A',1,26990000.000,NULL,26990000.000,0),(43,16,3,'N/A',1,32900000.000,NULL,32900000.000,0),(44,16,4,'N/A',1,23500000.000,NULL,23500000.000,2),(45,16,12,'N/A',1,55900000.000,NULL,55900000.000,0),(46,16,13,'N/A',1,36500000.000,NULL,36500000.000,0),(47,16,14,'N/A',1,23900000.000,NULL,23900000.000,0),(48,23,1,'N/A',1,29990000.000,NULL,29990000.000,0),(49,23,2,'N/A',1,26990000.000,NULL,26990000.000,0),(50,23,3,'N/A',1,32900000.000,NULL,32900000.000,0),(51,23,4,'N/A',1,23500000.000,NULL,23500000.000,0),(52,23,12,'N/A',1,55900000.000,NULL,55900000.000,0),(53,23,11,'N/A',1,34900000.000,NULL,34900000.000,0),(54,26,1,'N/A',1,29990000.000,NULL,29990000.000,0),(55,26,2,'N/A',1,26990000.000,NULL,26990000.000,0),(56,26,3,'N/A',1,32900000.000,NULL,32900000.000,0),(57,26,11,'N/A',1,34900000.000,NULL,34900000.000,0),(58,26,12,'N/A',1,55900000.000,NULL,55900000.000,0),(59,26,13,'N/A',1,36500000.000,NULL,36500000.000,0),(60,29,2,'N/A',1,26990000.000,NULL,26990000.000,0),(61,29,3,'N/A',1,32900000.000,NULL,32900000.000,0),(62,29,9,'N/A',1,9490000.000,NULL,9490000.000,1),(63,29,10,'N/A',1,11900000.000,NULL,11900000.000,0),(64,29,11,'N/A',1,34900000.000,NULL,34900000.000,0),(65,29,12,'N/A',1,55900000.000,NULL,55900000.000,0),(66,29,13,'N/A',1,36500000.000,NULL,36500000.000,0),(67,32,1,'N/A',1,29990000.000,NULL,29990000.000,0),(68,32,2,'N/A',1,26990000.000,NULL,26990000.000,0),(69,32,3,'N/A',1,32900000.000,NULL,32900000.000,0),(70,32,4,'N/A',1,23500000.000,NULL,23500000.000,0),(71,32,12,'N/A',1,55900000.000,NULL,55900000.000,0),(72,32,11,'N/A',1,34900000.000,NULL,34900000.000,1),(73,35,1,'N/A',1,29990000.000,NULL,29990000.000,0),(74,35,2,'N/A',1,26990000.000,NULL,26990000.000,1),(75,35,4,'N/A',1,23500000.000,NULL,23500000.000,1),(76,35,11,'N/A',1,34900000.000,NULL,34900000.000,0),(77,35,10,'N/A',1,11900000.000,NULL,11900000.000,0),(78,35,12,'N/A',1,55900000.000,NULL,55900000.000,0),(79,54,1,'N/A',1,29990000.000,NULL,29990000.000,0),(80,54,9,'N/A',1,9490000.000,NULL,9490000.000,0),(81,54,10,'N/A',1,11900000.000,NULL,11900000.000,0),(82,54,11,'N/A',1,34900000.000,NULL,34900000.000,0),(83,54,12,'N/A',1,55900000.000,NULL,55900000.000,0),(84,54,14,'N/A',1,23900000.000,NULL,23900000.000,0),(85,57,1,'N/A',1,29990000.000,NULL,29990000.000,0),(86,57,2,'N/A',1,26990000.000,NULL,26990000.000,0),(87,57,3,'N/A',1,32900000.000,NULL,32900000.000,1),(88,57,10,'N/A',1,11900000.000,NULL,11900000.000,0),(89,57,11,'N/A',1,34900000.000,NULL,34900000.000,0),(90,57,12,'N/A',1,55900000.000,NULL,55900000.000,0),(91,57,13,'N/A',1,36500000.000,NULL,36500000.000,0),(92,60,1,'N/A',1,29990000.000,NULL,29990000.000,1),(93,60,2,'N/A',1,26990000.000,NULL,26990000.000,1),(94,60,3,'N/A',1,32900000.000,NULL,32900000.000,0),(95,60,5,'N/A',1,28900000.000,NULL,28900000.000,1),(96,60,6,'N/A',1,22900000.000,NULL,22900000.000,0),(97,60,12,'N/A',1,55900000.000,NULL,55900000.000,0),(98,60,11,'N/A',1,34900000.000,NULL,34900000.000,0),(99,73,2,'N/A',1,26990000.000,NULL,26990000.000,0),(100,73,1,'N/A',1,29990000.000,NULL,29990000.000,0),(101,73,11,'N/A',1,34900000.000,NULL,34900000.000,0),(102,73,5,'N/A',1,28900000.000,NULL,28900000.000,0),(103,73,6,'N/A',1,22900000.000,NULL,22900000.000,0),(104,73,14,'N/A',1,23900000.000,NULL,23900000.000,0),(105,73,13,'N/A',1,36500000.000,NULL,36500000.000,1),(106,77,2,'N/A',1,26990000.000,NULL,26990000.000,0),(107,77,10,'N/A',1,11900000.000,NULL,11900000.000,0),(108,77,11,'N/A',1,34900000.000,NULL,34900000.000,0),(109,77,12,'N/A',1,55900000.000,NULL,55900000.000,0),(110,77,14,'N/A',1,23900000.000,NULL,23900000.000,0),(111,81,1,'N/A',1,29990000.000,NULL,29990000.000,0),(112,81,3,'N/A',1,32900000.000,NULL,32900000.000,0),(113,81,9,'N/A',1,9490000.000,NULL,9490000.000,0),(114,81,10,'N/A',1,11900000.000,NULL,11900000.000,0);
/*!40000 ALTER TABLE `orderdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `productName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `warrantyPeriod` int DEFAULT '12',
  `taxRate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_index_6` (`id`),
  KEY `product_index_7` (`categoryId`),
  KEY `product_index_8` (`productName`),
  KEY `product_index_9` (`isDeleted`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`),
  CONSTRAINT `product_chk_1` CHECK ((`taxRate` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'iPhone 15 Pro Max','Apple','Smartphone cao cấp','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(2,1,'Galaxy S24 Ultra','Samsung','AI phone','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(3,1,'Galaxy Z Fold5','Samsung','Điện thoại gập','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(4,1,'iPhone 14 Pro','Apple','Smartphone','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(5,1,'Xiaomi 14 Ultra','Xiaomi','Flagship','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(6,1,'Oppo Find N3 Flip','Oppo','Điện thoại gập lật','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(7,1,'Google Pixel 8 Pro','Google','Pure Android','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(8,1,'Samsung Galaxy A55','Samsung','Tầm trung','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(9,1,'Redmi Note 13 Pro+','Xiaomi','Tầm trung','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(10,1,'Realme 12 Pro+','Realme','Tầm trung','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(11,2,'Sony Bravia XR OLED A80L','Sony','TV OLED 4K','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(12,2,'Samsung Neo QLED QN90C','Samsung','TV Neo QLED','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(13,2,'LG C3 OLED Evo','LG','TV OLED','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(14,2,'TCL Mini LED C845','TCL','TV Mini LED','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(15,2,'Xiaomi TV A Pro','Xiaomi','TV 4K','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(16,2,'Samsung Crystal UHD','Samsung','TV UHD','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(17,2,'Sony LED X80L','Sony','TV LED','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(18,2,'LG Nanocell 55','LG','TV Nanocell','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(19,2,'Xiaomi TV Max 86','Xiaomi','TV khổng lồ','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(20,2,'Casper 4K Google TV','Casper','TV phổ thông','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(21,3,'MacBook Pro M3 Pro','Apple','Laptop cao cấp','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(22,3,'ASUS TUF Gaming F15','ASUS','Gaming laptop','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(23,3,'Dell XPS 13 Plus','Dell','Ultrabook','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(24,3,'HP Pavilion 15','HP','Laptop văn phòng','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(25,3,'Lenovo Legion Slim 5','Lenovo','Gaming laptop mỏng','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(26,3,'Acer Nitro 5 Tiger','Acer','Gaming laptop','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(27,3,'MSI Katana 15','MSI','Gaming laptop','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(28,3,'MacBook Air M2','Apple','Laptop siêu mỏng','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(29,3,'ASUS Zenbook 14','ASUS','Ultrabook OLED','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(30,3,'LG Gram 16','LG','Laptop siêu nhẹ','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(31,4,'Samsung Bespoke 648L','Samsung','Tủ lạnh side by side','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(32,4,'LG Inverter 635L','LG','Tủ lạnh side by side','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(33,4,'Panasonic Prime+ 540L','Panasonic','Tủ lạnh multi door','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(34,4,'Hitachi Inverter 450L','Hitachi','Tủ lạnh 2 cánh','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(35,4,'Toshiba Inverter 320L','Toshiba','Tủ lạnh 2 cánh','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(36,4,'Sharp 4 Cánh 556L','Sharp','Tủ lạnh 4 cánh','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(37,4,'Aqua Inverter 541L','Aqua','Tủ lạnh side by side','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(38,4,'Beko Inverter 323L','Beko','Tủ lạnh 2 cánh','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(39,4,'Whirlpool 594L','Whirlpool','Tủ lạnh French door','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(40,5,'LG AI DD 10kg','LG','Máy giặt cửa trước','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(41,5,'Samsung Ecobubble 9kg','Samsung','Máy giặt cửa trước','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(42,5,'Electrolux Inverter 11kg','Electrolux','Máy giặt','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(43,5,'Panasonic 9.5kg','Panasonic','Máy giặt cửa trên','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(44,5,'Toshiba Inverter 8.5kg','Toshiba','Máy giặt','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(45,5,'Aqua Inverter 10.5kg','Aqua','Máy giặt cửa trước','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(46,5,'Beko Inverter 9kg','Beko','Máy giặt','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(47,5,'Whirlpool 10.5kg','Whirlpool','Máy giặt','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(48,5,'Samsung Washer & Dryer 12kg','Samsung','Máy giặt sấy','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(49,6,'Nồi chiên Philips 6L','Philips','Nồi chiên không dầu','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(50,6,'Robot hút bụi Roborock S8','Roborock','Robot hút bụi lau nhà','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(51,6,'Máy lọc nước Karofi','Karofi','Máy lọc nước RO','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(52,6,'Máy xay sinh tố Philips','Philips','Máy xay đa năng','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(53,6,'Lò vi sóng Sharp 23L','Sharp','Lò vi sóng','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(54,6,'Quạt đứng Mitsubishi','Mitsubishi','Quạt điện','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(55,6,'Nồi cơm điện Cuckoo','Cuckoo','Nồi cơm điện tử','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(56,6,'Bếp từ Sunhouse','Sunhouse','Bếp từ đôi','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(57,6,'Máy lọc không khí Xiaomi 4 Pro','Xiaomi','Máy lọc không khí','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(58,6,'Ấm siêu tốc Bluestone','Bluestone','Ấm đun nước','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(59,6,'Máy ép chậm Hurom','Hurom','Máy ép trái cây','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(60,6,'Máy xay đa năng Moulinex','Moulinex','Máy xay','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(61,7,'Marshall Stanmore III','Marshall','Loa bluetooth','Active',12,10.00,'2026-05-11 15:30:49','2026-05-11 15:30:49',0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productsupplier`
--

DROP TABLE IF EXISTS `productsupplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productsupplier` (
  `productId` int NOT NULL,
  `supplierId` int NOT NULL,
  PRIMARY KEY (`productId`,`supplierId`),
  KEY `productSupplier_index_18` (`productId`,`supplierId`),
  KEY `productSupplier_index_19` (`supplierId`),
  CONSTRAINT `productsupplier_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
  CONSTRAINT `productsupplier_ibfk_2` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productsupplier`
--

LOCK TABLES `productsupplier` WRITE;
/*!40000 ALTER TABLE `productsupplier` DISABLE KEYS */;
INSERT INTO `productsupplier` VALUES (5,1),(6,1),(7,1),(9,1),(10,1),(13,1),(14,1),(15,1),(18,1),(19,1),(20,1),(22,1),(23,1),(24,1),(25,1),(26,1),(27,1),(29,1),(30,1),(32,1),(33,1),(34,1),(35,1),(36,1),(37,1),(38,1),(39,1),(40,1),(42,1),(43,1),(44,1),(45,1),(46,1),(47,1),(49,1),(50,1),(51,1),(52,1),(53,1),(54,1),(55,1),(56,1),(57,1),(58,1),(59,1),(60,1),(61,1),(2,2),(3,2),(8,2),(12,2),(16,2),(31,2),(41,2),(48,2),(1,3),(4,3),(21,3),(28,3),(11,4),(17,4);
/*!40000 ALTER TABLE `productsupplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `promotionId` int NOT NULL AUTO_INCREMENT,
  `promotionName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discountPercent` decimal(5,2) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `usageCount` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`promotionId`),
  KEY `promotion_index_56` (`promotionId`),
  KEY `promotion_index_57` (`startDate`,`endDate`),
  KEY `promotion_index_58` (`isDeleted`),
  CONSTRAINT `chk_promo_dates` CHECK ((`endDate` >= `startDate`)),
  CONSTRAINT `promotion_chk_1` CHECK ((`discountPercent` between 0 and 100)),
  CONSTRAINT `promotion_chk_2` CHECK ((`usageCount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (1,'SIÊU SALE MÙA HÈ - GIẢM 15%',15.00,'2026-05-11 22:30:49','2026-06-11 22:30:49',0,'2026-05-11 15:30:49','2026-05-11 15:30:49',0);
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_variant`
--

DROP TABLE IF EXISTS `promotion_variant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_variant` (
  `promotionId` int NOT NULL,
  `variantId` int NOT NULL,
  `appliedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`promotionId`,`variantId`),
  KEY `promotion_variant_index_59` (`promotionId`),
  KEY `promotion_variant_index_60` (`variantId`),
  CONSTRAINT `promotion_variant_ibfk_1` FOREIGN KEY (`promotionId`) REFERENCES `promotion` (`promotionId`) ON DELETE CASCADE,
  CONSTRAINT `promotion_variant_ibfk_2` FOREIGN KEY (`variantId`) REFERENCES `variant` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_variant`
--

LOCK TABLES `promotion_variant` WRITE;
/*!40000 ALTER TABLE `promotion_variant` DISABLE KEYS */;
INSERT INTO `promotion_variant` VALUES (1,1,'2026-05-11 22:30:49'),(1,11,'2026-05-11 22:30:49'),(1,21,'2026-05-11 22:30:49');
/*!40000 ALTER TABLE `promotion_variant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `storeId` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hashedPassword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `staff_index_28` (`id`),
  KEY `staff_index_29` (`storeId`),
  KEY `staff_index_30` (`username`),
  KEY `staff_index_31` (`isDeleted`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,1,'admin','$2y$10$xhQ6JqkqfKkX9k2yQeX/0e.','Nguyễn Văn Admin','0901234567','admin@store.com','Owner','2026-05-11 15:30:49','2026-05-11 15:30:49',0),(2,1,'minhanh','$2y$10$xhQ6JqkqfKkX9k2yQeX/0e.','Trần Thị Minh Anh','0902234567','minhanh@store.com','Staff','2026-05-11 15:30:49','2026-05-11 15:30:49',0),(3,1,'ktt85','$2b$10$ucuQ77HoHuMC.0U7aEJE8usdK0q6EJSLzOzXWKvjeM4bKlfFfmWq2','KienTT','0987456213','','Staff','2026-05-11 15:31:37','2026-05-11 15:31:37',0),(4,1,'kien85','$2b$10$WqnmUxKluNgG0iEvmmGPWOG6qBj5zT5dCMC3YTJRuxh7KWG28Bqu2','KienTT','0987654321','','Staff','2026-05-11 15:39:25','2026-05-11 15:39:25',0),(5,1,'cnh1','$2b$10$X0OHuwhhZSPs.Jsdm6KdWuOCPEmpCqij3EltyDTc8FPykR/.sdtLe','hcn','0132465789','','Staff','2026-05-12 04:06:45','2026-05-12 04:06:45',0);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `taxCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `taxCode` (`taxCode`),
  KEY `store_index_24` (`id`),
  KEY `store_index_25` (`taxCode`),
  KEY `store_index_26` (`name`),
  KEY `store_index_27` (`isDeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES (1,'Cửa hàng bán lẻ chính','0281234567','contact@store.com','123 Đường ABC, Quận 1, TP.HCM','STORE0001','2026-05-11 15:30:49','2026-05-11 15:30:49',0);
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contactName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taxCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `taxCode` (`taxCode`),
  KEY `supplier_index_0` (`id`),
  KEY `supplier_index_1` (`taxCode`),
  KEY `supplier_index_2` (`companyName`),
  KEY `supplier_index_3` (`isDeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'Công ty TNHH Điện tử Việt','Nguyễn Văn A','0281234567','contact@dientuviet.com','123 Lê Lợi, Q1, TP.HCM','1234567890','2026-05-11 15:30:49','2026-05-11 15:30:49',0),(2,'Tập đoàn Samsung VN','Lee Min Ho','0289876543','samsung@vn.com','456 Nguyễn Huệ, Q1, TP.HCM','0987654321','2026-05-11 15:30:49','2026-05-11 15:30:49',0),(3,'Apple Việt Nam','Tim Cook','0281112222','apple@vn.com','789 Hai Bà Trưng, Q3, TP.HCM','1122334455','2026-05-11 15:30:49','2026-05-11 15:30:49',0),(4,'Sony Electronics','Kenjiro Yoshida','0282223333','sony@vn.com','321 Lý Tự Trọng, Q1, TP.HCM','5566778899','2026-05-11 15:30:49','2026-05-11 15:30:49',0);
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant`
--

DROP TABLE IF EXISTS `variant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `skuCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sellPrice` decimal(19,3) NOT NULL,
  `importPrice` decimal(19,3) DEFAULT NULL,
  `stockQuantity` int NOT NULL DEFAULT '0',
  `discount` decimal(19,2) NOT NULL DEFAULT '0.00',
  `imageUrl` varchar(2083) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minStock` int NOT NULL DEFAULT '5',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `skuCode` (`skuCode`),
  KEY `variant_index_10` (`id`),
  KEY `variant_index_11` (`productId`),
  KEY `variant_index_12` (`skuCode`),
  KEY `variant_index_13` (`isDeleted`),
  CONSTRAINT `variant_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
  CONSTRAINT `variant_chk_1` CHECK ((`minStock` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant`
--

LOCK TABLES `variant` WRITE;
/*!40000 ALTER TABLE `variant` DISABLE KEYS */;
INSERT INTO `variant` VALUES (1,1,'IP15PM-256',29990000.000,20993000.000,38,0.00,'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600',5,'2026-05-11 15:30:49','2026-05-12 08:30:32',0),(2,2,'S24U-256',26990000.000,18893000.000,39,0.00,'https://images.unsplash.com/photo-1707241221132-7a8689ba488d?w=600',5,'2026-05-11 15:30:49','2026-05-12 08:27:05',0),(3,3,'Z-FOLD5',32900000.000,23030000.000,42,0.00,'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',5,'2026-05-11 15:30:49','2026-05-12 08:30:32',0),(4,4,'IP14P-128',23500000.000,16450000.000,47,0.00,'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600',5,'2026-05-11 15:30:49','2026-05-11 16:39:50',0),(5,5,'XI-14U',28900000.000,20230000.000,49,0.00,'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600',5,'2026-05-11 15:30:49','2026-05-12 07:34:26',0),(6,6,'OP-N3',22900000.000,16030000.000,47,0.00,'https://images.unsplash.com/photo-1556656793-062ff9878258?w=600',5,'2026-05-11 15:30:49','2026-05-12 07:34:26',0),(7,7,'GG-P8P',19500000.000,13650000.000,50,0.00,'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(8,8,'SS-A55',9990000.000,6993000.000,48,0.00,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:41:02',0),(9,9,'XI-RN13P',9490000.000,6643000.000,46,0.00,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',5,'2026-05-11 15:30:49','2026-05-12 08:30:32',0),(10,10,'RM-12P',11900000.000,8330000.000,40,0.00,'https://images.unsplash.com/photo-1533228890422-038753a0678d?w=600',5,'2026-05-11 15:30:49','2026-05-12 08:30:32',0),(11,11,'SN-A80L-55',34900000.000,24430000.000,38,0.00,'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600',5,'2026-05-11 15:30:49','2026-05-12 08:27:05',0),(12,12,'SS-QN90-75',55900000.000,39130000.000,39,0.00,'https://images.unsplash.com/photo-1552284043-199468a221f7?w=600',5,'2026-05-11 15:30:49','2026-05-12 08:27:05',0),(13,13,'LG-C3-55',36500000.000,25550000.000,43,0.00,'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600',5,'2026-05-11 15:30:49','2026-05-12 07:35:49',0),(14,14,'TCL-C845-65',23900000.000,16730000.000,44,0.00,'https://images.unsplash.com/photo-1461151304267-38535e770d79?w=600',5,'2026-05-11 15:30:49','2026-05-12 08:27:05',0),(15,15,'XI-TV-55',9500000.000,6650000.000,50,0.00,'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(16,16,'SS-UHD-65',16900000.000,11830000.000,49,0.00,'https://images.unsplash.com/photo-1533236897111-3e94666b2dda?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:41:02',0),(17,17,'SN-X80L-50',14500000.000,10150000.000,49,0.00,'https://images.unsplash.com/photo-1495563973552-4c4ad8394535?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:41:02',0),(18,18,'LG-NANO-55',14900000.000,10430000.000,49,0.00,'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:41:02',0),(19,19,'XI-MAX-86',29900000.000,20930000.000,49,0.00,'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:40:37',0),(20,20,'CAS-TV-50',7490000.000,5243000.000,48,0.00,'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:44:00',0),(21,21,'MBP-M3',49900000.000,34930000.000,50,0.00,'https://images.unsplash.com/photo-1517336714460-4c50d9178358?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(22,22,'AS-TUF',21900000.000,15330000.000,50,0.00,'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(23,23,'DELL-XPS',42500000.000,29750000.000,50,0.00,'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(24,24,'HP-PAV',14500000.000,10150000.000,50,0.00,'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(25,25,'LEN-LEG',32900000.000,23030000.000,50,0.00,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(26,26,'ACER-N5',21500000.000,15050000.000,49,0.00,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:40:06',0),(27,27,'MSI-K15',25900000.000,18130000.000,50,0.00,'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(28,28,'MBA-M2',26500000.000,18550000.000,49,0.00,'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:41:02',0),(29,29,'AS-ZEN',23900000.000,16730000.000,50,0.00,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(30,30,'LG-GRAM',35900000.000,25130000.000,50,0.00,'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(31,31,'SS-BS-648',38900000.000,27230000.000,50,0.00,'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(32,32,'LG-635-SL',24500000.000,17150000.000,49,0.00,'https://images.unsplash.com/photo-1571175432244-93444434229b?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:41:02',0),(33,33,'PAN-540',32500000.000,22750000.000,49,0.00,'https://plus.unsplash.com/premium_photo-1661765584555-081033480076?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:41:02',0),(34,34,'HIT-450',17900000.000,12530000.000,50,0.00,'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(35,35,'TOS-320',9500000.000,6650000.000,50,0.00,'https://images.unsplash.com/photo-1563200141-8664a7815f9b?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(36,36,'SH-556',19900000.000,13930000.000,50,0.00,'https://images.unsplash.com/photo-1620063231122-17ca3561a096?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(37,37,'AQ-541',16500000.000,11550000.000,50,0.00,'https://images.unsplash.com/photo-1512411964260-2396e987c65d?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(38,38,'BE-323',8900000.000,6230000.000,50,0.00,'https://images.unsplash.com/photo-1520641051515-780c10803657?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(39,39,'WHI-594',27900000.000,19530000.000,50,0.00,'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(40,40,'LG-W10',10900000.000,7630000.000,50,0.00,'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e05?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(41,41,'SS-W9',8500000.000,5950000.000,50,0.00,'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(42,42,'EL-W11',15500000.000,10850000.000,50,0.00,'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(43,43,'PAN-W95',6900000.000,4830000.000,50,0.00,'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(44,44,'TOS-W85',5400000.000,3780000.000,50,0.00,'https://images.unsplash.com/photo-1567202555103-4775a3fb13bb?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(45,45,'AQ-W105',8900000.000,6230000.000,50,0.00,'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(46,46,'BEKO-W9',7200000.000,5040000.000,50,0.00,'https://images.unsplash.com/photo-1521903062400-b80a2bb0cd35?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(47,47,'WHI-W10',13500000.000,9450000.000,50,0.00,'https://images.unsplash.com/photo-1521903062400-b80a2bb0cd35?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(48,48,'SS-WD12',18900000.000,13230000.000,50,0.00,'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(49,49,'PH-AF-6',3850000.000,2695000.000,50,0.00,'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(50,50,'RR-S8',15900000.000,11130000.000,50,0.00,'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(51,51,'KA-W10',6200000.000,4340000.000,50,0.00,'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(52,52,'PH-BL-S',1650000.000,1155000.000,50,0.00,'https://images.unsplash.com/photo-1570197788417-0e82375c9391?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(53,53,'SH-MW-23',2850000.000,1995000.000,50,0.00,'https://images.unsplash.com/photo-1585659823861-43209f476b25?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(54,54,'MIT-LV',1950000.000,1365000.000,50,0.00,'https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(55,55,'CK-RC-18',6500000.000,4550000.000,50,0.00,'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(56,56,'SH-IND-2',4200000.000,2940000.000,50,0.00,'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(57,57,'XI-AP-4P',4500000.000,3150000.000,50,0.00,'https://images.unsplash.com/photo-1585771724684-252a995af834?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(58,58,'BL-KET-1',650000.000,455000.000,50,0.00,'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(59,59,'HU-H200',9900000.000,6930000.000,50,0.00,'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(60,60,'MO-BL',2450000.000,1715000.000,50,0.00,'https://images.unsplash.com/photo-1570197788417-0e82375c9391?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0),(61,61,'MS-ST3',9200000.000,6440000.000,50,0.00,'https://images.unsplash.com/photo-1545454675-3531bdf9915e?w=600',5,'2026-05-11 15:30:49','2026-05-11 15:30:49',0);
/*!40000 ALTER TABLE `variant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variantattribute`
--

DROP TABLE IF EXISTS `variantattribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variantattribute` (
  `variantId` int NOT NULL,
  `attributeId` int NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`variantId`,`attributeId`),
  KEY `variantAttribute_index_16` (`variantId`,`attributeId`),
  KEY `variantAttribute_index_17` (`attributeId`),
  CONSTRAINT `variantattribute_ibfk_1` FOREIGN KEY (`variantId`) REFERENCES `variant` (`id`),
  CONSTRAINT `variantattribute_ibfk_2` FOREIGN KEY (`attributeId`) REFERENCES `attribute` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variantattribute`
--

LOCK TABLES `variantattribute` WRITE;
/*!40000 ALTER TABLE `variantattribute` DISABLE KEYS */;
INSERT INTO `variantattribute` VALUES (1,1,'Titan Tự Nhiên'),(1,2,'256GB'),(1,3,'8GB'),(2,1,'Xám Titan'),(2,2,'256GB'),(2,3,'12GB'),(3,1,'Kem'),(3,2,'512GB'),(3,3,'12GB'),(4,1,'Tím Deep Purple'),(4,2,'128GB'),(4,3,'6GB'),(5,1,'Trắng'),(5,2,'512GB'),(5,3,'16GB'),(6,1,'Vàng'),(6,2,'256GB'),(6,3,'12GB'),(7,1,'Xanh Bay'),(7,2,'128GB'),(7,3,'12GB'),(8,1,'Xanh Lơ'),(8,2,'128GB'),(8,3,'8GB'),(9,1,'Đen'),(9,2,'256GB'),(9,3,'12GB'),(10,1,'Xanh Blue'),(10,2,'256GB'),(10,3,'8GB'),(11,4,'55 INCH'),(11,7,'4K'),(11,8,'OLED'),(12,4,'75 INCH'),(12,7,'4K'),(12,8,'Neo QLED'),(13,4,'55 INCH'),(13,7,'4K'),(13,8,'OLED'),(14,4,'65 INCH'),(14,7,'4K'),(14,8,'Mini LED'),(15,4,'55 INCH'),(15,7,'4K'),(15,8,'LED'),(16,4,'65 INCH'),(16,7,'4K'),(16,8,'UHD'),(17,4,'50 INCH'),(17,7,'4K'),(17,8,'LED'),(18,4,'55 INCH'),(18,7,'4K'),(18,8,'Nanocell'),(19,4,'86 INCH'),(19,7,'4K'),(19,8,'LED'),(20,4,'50 INCH'),(20,7,'4K'),(20,8,'LED'),(21,1,'Space Black'),(21,2,'512GB'),(21,3,'18GB'),(21,4,'14.2 INCH'),(22,1,'Đen nhám'),(22,2,'512GB'),(22,3,'16GB'),(22,4,'15.6 INCH'),(23,1,'Bạc'),(23,2,'512GB'),(23,3,'16GB'),(23,4,'13.4 INCH'),(24,1,'Vàng Gold'),(24,2,'512GB'),(24,3,'8GB'),(24,4,'15.6 INCH'),(25,1,'Xám'),(25,2,'512GB'),(25,3,'16GB'),(25,4,'16 INCH'),(26,1,'Đen'),(26,2,'512GB'),(26,3,'16GB'),(26,4,'15.6 INCH'),(27,1,'Đen'),(27,2,'512GB'),(27,3,'16GB'),(27,4,'15.6 INCH'),(28,1,'Midnight'),(28,2,'256GB'),(28,3,'8GB'),(28,4,'13.6 INCH'),(29,1,'Xanh Blue'),(29,2,'512GB'),(29,3,'16GB'),(29,4,'14 INCH'),(30,1,'Trắng'),(30,2,'512GB'),(30,3,'16GB'),(30,4,'16 INCH'),(31,1,'Trắng/Xanh'),(31,5,'648 LÍT'),(31,6,'Side by Side'),(32,1,'Bạc'),(32,5,'635 LÍT'),(32,6,'Side by Side'),(33,1,'Đen Gương'),(33,5,'540 LÍT'),(33,6,'Multi Door'),(34,1,'Trắng'),(34,5,'450 LÍT'),(34,6,'2 Cánh'),(35,1,'Bạc'),(35,5,'320 LÍT'),(35,6,'2 Cánh'),(36,1,'Đen'),(36,5,'556 LÍT'),(36,6,'Multi Door'),(37,1,'Đen Gương'),(37,5,'541 LÍT'),(37,6,'Side by Side'),(38,1,'Xám'),(38,5,'323 LÍT'),(38,6,'2 Cánh'),(39,1,'Inox'),(39,5,'594 LÍT'),(39,6,'French Door'),(40,1,'Xám'),(40,5,'10 KG'),(40,6,'Cửa trước'),(41,1,'Trắng'),(41,5,'9 KG'),(41,6,'Cửa trước'),(42,1,'Đen'),(42,5,'11 KG'),(42,6,'Cửa trước'),(43,1,'Bạc'),(43,5,'9.5 KG'),(43,6,'Cửa trên'),(44,1,'Trắng'),(44,5,'8.5 KG'),(44,6,'Cửa trên'),(45,1,'Bạc'),(45,5,'10.5 KG'),(45,6,'Cửa trước'),(46,1,'Xám'),(46,5,'9 KG'),(46,6,'Cửa trước'),(47,1,'Trắng'),(47,5,'10.5 KG'),(47,6,'Cửa trước'),(48,1,'Đen'),(48,5,'12 KG'),(48,6,'Giặt sấy'),(49,1,'Đen'),(49,5,'6 LÍT'),(49,6,'Điện tử'),(50,1,'Đen'),(50,6,'Robot tự động'),(51,5,'10 LÕI'),(51,6,'Tủ đứng'),(52,1,'Trắng'),(52,5,'1.5 LÍT'),(53,1,'Bạc'),(53,5,'23 LÍT'),(54,1,'Xám'),(54,6,'Có điều khiển'),(55,1,'Đỏ'),(55,5,'1.8 LÍT'),(55,6,'Cao tần'),(56,1,'Đen'),(56,6,'Bếp đôi'),(57,1,'Trắng'),(57,5,'60m2'),(58,1,'Inox'),(58,5,'1.7 LÍT'),(59,1,'Đỏ'),(59,6,'Máy ép chậm'),(60,1,'Trắng'),(60,5,'2 LÍT'),(61,1,'Nâu');
/*!40000 ALTER TABLE `variantattribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warranty`
--

DROP TABLE IF EXISTS `warranty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warranty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderDetailId` int NOT NULL,
  `staffId` int DEFAULT NULL,
  `claimDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `issueDescription` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resolutionType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refundAmount` decimal(18,2) DEFAULT NULL,
  `paymentMethod` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warrantyType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `warranty_index_61` (`id`),
  KEY `warranty_index_62` (`orderDetailId`),
  KEY `warranty_index_63` (`staffId`),
  KEY `warranty_index_64` (`status`),
  KEY `warranty_index_65` (`isDeleted`),
  CONSTRAINT `warranty_ibfk_1` FOREIGN KEY (`orderDetailId`) REFERENCES `orderdetail` (`id`),
  CONSTRAINT `warranty_ibfk_2` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warranty`
--

LOCK TABLES `warranty` WRITE;
/*!40000 ALTER TABLE `warranty` DISABLE KEYS */;
INSERT INTO `warranty` VALUES (1,1,1,'2026-05-11 15:30:49','Lỗi màn hình không hiển thị','Repair','Resolved',NULL,NULL,'Trong bảo hành','2026-05-11 15:30:49','2026-05-11 15:30:49',0),(2,5,1,'2026-05-11 15:32:39','Máy bị lỗi','Refund','Completed',28900000.00,'Tiền mặt','Refund','2026-05-11 15:32:39','2026-05-11 15:32:39',0),(3,39,4,'2026-05-11 15:44:00','Điều hoà k làm lạnh','Replacement','Completed',0.00,NULL,'Replacement','2026-05-11 15:44:00','2026-05-11 15:44:00',0),(4,44,4,'2026-05-11 15:52:05','Sọc màn','Refund','Completed',23500000.00,'Tiền mặt','Refund','2026-05-11 15:52:05','2026-05-11 15:52:05',0),(5,44,4,'2026-05-11 15:58:24','Màn hình bị sọc','Refund','Completed',23500000.00,'Chuyển khoản','Refund','2026-05-11 15:58:24','2026-05-11 15:58:24',0),(6,62,4,'2026-05-11 16:15:11','màn hình sọc','Refund','Completed',9490000.00,'Chuyển khoản','Refund','2026-05-11 16:15:11','2026-05-11 16:15:11',0),(7,72,4,'2026-05-11 16:22:05','Lỗi màn hình','Refund','Completed',34900000.00,'Tiền mặt','Refund','2026-05-11 16:22:05','2026-05-11 16:22:05',0),(8,75,4,'2026-05-11 16:39:50','Lỗi sọc màn','Replacement','Completed',0.00,NULL,'Replacement','2026-05-11 16:39:50','2026-05-11 16:39:50',0),(9,74,4,'2026-05-11 16:40:22','Lỗi sọc màn','Refund','Completed',29689000.00,'Tiền mặt','Refund','2026-05-11 16:40:22','2026-05-11 16:40:22',0),(10,92,5,'2026-05-12 04:08:32','Lỗi sọc màn','Refund','Completed',32989000.00,'Chuyển khoản','Refund','2026-05-12 04:08:32','2026-05-12 04:08:32',0),(11,93,4,'2026-05-12 04:09:28','Lỗi sọc màn','Refund','Completed',29689000.00,'Tiền mặt','Refund','2026-05-12 04:09:28','2026-05-12 04:09:28',0),(12,95,4,'2026-05-12 04:10:04','Loa bị rè','Refund','Completed',31790000.00,'Chuyển khoản','Refund','2026-05-12 04:10:04','2026-05-12 04:10:04',0),(13,87,4,'2026-05-12 07:25:44','Lỗi sọc màn','Refund','Completed',36190000.00,'Tiền mặt','Refund','2026-05-12 07:25:44','2026-05-12 07:25:44',0),(14,105,4,'2026-05-12 07:35:49','Lỗi sọc màn','Refund','Completed',40150000.00,'Tiền mặt','Refund','2026-05-12 07:35:49','2026-05-12 07:35:49',0);
/*!40000 ALTER TABLE `warranty` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-12 15:41:47
