-- MySQL dump 10.13  Distrib 5.6.24, for Win64 (x86_64)
--
-- Host: localhost    Database: personalsite
-- ------------------------------------------------------
-- Server version	5.6.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `argument`
--

DROP TABLE IF EXISTS `argument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `argument` (
  `name` text NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requires_option` tinyint(1) NOT NULL DEFAULT '0',
  `requires_argument_child` tinyint(4) NOT NULL DEFAULT '0',
  `command_id` int(11) NOT NULL,
  `argument_tier` int(11) NOT NULL DEFAULT '1',
  `argument_parent` int(11) NOT NULL DEFAULT '0',
  `user_defined` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `command_id` (`command_id`),
  CONSTRAINT `argument_ibfk_1` FOREIGN KEY (`command_id`) REFERENCES `command` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `argument`
--

LOCK TABLES `argument` WRITE;
/*!40000 ALTER TABLE `argument` DISABLE KEYS */;
INSERT INTO `argument` VALUES ('resume',1,0,0,2,1,0,0),('pseubuntu',2,0,0,4,1,0,0),('home',3,0,0,2,1,0,0),('terminal',5,1,0,5,1,0,0),('clear',6,0,0,6,1,0,0),('ls',7,0,0,6,1,0,0),('sandbox',8,0,0,2,1,0,0),('grid',17,0,1,8,1,0,0),('row',18,0,1,8,1,0,0),('grid_name',19,0,0,8,2,17,1),('row_name',20,0,0,8,2,18,1),('ProjectHeader',21,0,0,10,2,37,0),('TylerSouthmayd.com',22,0,0,10,2,37,0),('UConnSmash.com',24,0,0,10,2,37,0),('RaspberryPi',25,0,0,10,2,37,0),('Chinook',26,0,0,10,2,37,0),('HTMLEditor',27,0,0,10,2,37,0),('ProjectHeader',29,0,0,11,2,40,0),('TylerSouthmayd.com',30,0,0,11,2,40,0),('UConnSmash.com',31,0,0,11,2,40,0),('RaspberryPi',32,0,0,11,2,40,0),('Chinook',33,0,0,11,2,40,0),('HTMLEditor',34,0,0,11,2,40,0),('.',35,0,0,10,1,0,0),('.',36,0,0,11,1,0,0),('project',37,0,0,10,1,0,0),('project',40,0,0,11,1,0,0),('Navbar',41,0,0,10,1,0,0),('Navbar',42,0,0,11,1,0,0),('add',43,0,0,6,1,0,0),('mv',44,0,0,6,1,0,0),('rm',45,0,0,6,1,0,0),('git',46,0,0,6,1,0,0),('help',47,0,0,6,1,0,0),('cd',48,0,0,6,1,0,0);
/*!40000 ALTER TABLE `argument` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `argument_option`
--

DROP TABLE IF EXISTS `argument_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `argument_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `argument_id` int(11) NOT NULL,
  `short_name` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `argument_id` (`argument_id`),
  CONSTRAINT `argument_option_ibfk_1` FOREIGN KEY (`argument_id`) REFERENCES `argument` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `argument_option`
--

LOCK TABLES `argument_option` WRITE;
/*!40000 ALTER TABLE `argument_option` DISABLE KEYS */;
INSERT INTO `argument_option` VALUES (1,'--top',5,'-t'),(2,'--bottom',5,'-b');
/*!40000 ALTER TABLE `argument_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `command`
--

DROP TABLE IF EXISTS `command`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `command` (
  `name` text NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requires_option` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `command`
--

LOCK TABLES `command` WRITE;
/*!40000 ALTER TABLE `command` DISABLE KEYS */;
INSERT INTO `command` VALUES ('ls',1,0,1),('cd',2,0,1),('clear',3,0,1),('help',4,0,1),('mv',5,0,1),('man',6,0,1),('create',8,0,0),('git',9,0,1),('add',10,0,1),('rm',11,0,1);
/*!40000 ALTER TABLE `command` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `command_option`
--

DROP TABLE IF EXISTS `command_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `command_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `short_name` text NOT NULL,
  `command_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `command_id` (`command_id`),
  CONSTRAINT `command_option_ibfk_1` FOREIGN KEY (`command_id`) REFERENCES `command` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `command_option`
--

LOCK TABLES `command_option` WRITE;
/*!40000 ALTER TABLE `command_option` DISABLE KEYS */;
INSERT INTO `command_option` VALUES (3,'--top','-t',8),(4,'--bottom','-b',5);
/*!40000 ALTER TABLE `command_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'personalsite'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-01-22 15:38:48
