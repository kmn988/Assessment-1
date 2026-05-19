-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: sys
-- ------------------------------------------------------
-- Server version	8.0.45

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
  `id` char(32) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('03d2a8715ed14c42a652e56f719b2f67','varus@gmail.com','USER','Varus','$2b$12$3Xoa8mLi/K3U7K2ajMf9MOn3ufEZmfJxaXLbX3fTILh21qRqzEarO'),('12a37584a7d845f791649433751b2848','ad@gmail.com','ADMIN','string','$2b$12$DrKr9mqHTqrcS06SlHoL..vPRKxV.ti4RDt/Ro5Xw4jCYkCaLySbm'),('824984cd0b304b57b8417bd1ccc2a431','doe@gmail.com','USER','John','$2b$12$LzFvJJXxvuBj5N6ONDW5EurfD2y8ocRsSn6UnaL2nAU8QpHMCr1BW'),('a4725843503147b98466adcd6614df1c','admin2@example.com','ADMIN','string','$2b$12$3o50OPAEnCHgSBFRSOwYZOlU/sZokJ4do4HVcC889owY7PX2WsP0e'),('ac414a4470604ef88694a56f41ed8466','user1@gmail.com','USER','benjamin-2','$2b$12$RUi.6rgrAAKs9mEX9MKjKu99EhLbAggZ1EDOvXQ0iP8ZSrsi.2pIG'),('b495634d533e4f0fa68ff49db4134538','admin@example.com','ADMIN','admin','$2b$12$lpG2WB0Qwkql0U7tP0CN3OseyYlcvPIZXaWFYBUc4FmoRx3UcoONm'),('c6d9f9ecb902470c882c654599f72987','user@example.com','USER','string','$2b$12$LhPSfEx/0MvSvdGvreMXKeTeGJp9b.fWFS2ND.kV6G6GE8Wj86yE2'),('ece4628f8f3443f399721101e0d2e3df','john@gmail.com','USER','John Doe','$2b$12$aDM7l12SOXDkNbqbrTrtsuYPAWxPOww.Sc8tWkRMC.U9EzsklI526'),('f5c6e1bdd68c4ae2a17b5cf1713a9d95','user@gmail.com','ADMIN','a','$2b$12$kPvSJYSl4IgaD3fDFrq9Me4tetLHld3nQd6DM3hDthPxx9qNhSGSa'),('faa0690b2350442d94052998308053f4','atrox@gmail.com','USER','Atrox','$2b$12$G390NusH16l8pSZCMOu8J.K0f4diHchXIWbymAEdz48Rx2qAw7wMi');
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

-- Dump completed on 2026-05-19 12:13:51
