-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 25, 2015 at 02:42 AM
-- Server version: 5.5.43
-- PHP Version: 5.4.41-0+deb7u1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `PersonalSite`
--

-- --------------------------------------------------------

--
-- Table structure for table `argument`
--

CREATE TABLE IF NOT EXISTS `argument` (
  `name` text NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requires_option` tinyint(1) NOT NULL DEFAULT '0',
  `requires_argument_child` tinyint(4) NOT NULL DEFAULT '0',
  `command_id` int(11) NOT NULL,
  `argument_tier` int(11) NOT NULL DEFAULT '1',
  `argument_parent` int(11) NOT NULL DEFAULT '0',
  `user_defined` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `command_id` (`command_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `argument`
--

INSERT INTO `argument` (`name`, `id`, `requires_option`, `requires_argument_child`, `command_id`, `argument_tier`, `argument_parent`, `user_defined`) VALUES
('resume', 1, 0, 0, 2, 1, 0, 0),
('pseubuntu', 2, 0, 0, 4, 1, 0, 0),
('home', 3, 0, 0, 2, 1, 0, 0),
('terminal', 5, 1, 0, 5, 1, 0, 0),
('clear', 6, 0, 0, 6, 1, 0, 0),
('ls', 7, 0, 0, 6, 1, 0, 0),
('sandbox', 8, 0, 0, 2, 1, 0, 0),
('grid', 17, 0, 1, 8, 1, 0, 0),
('row', 18, 0, 1, 8, 1, 0, 0),
('grid_name', 19, 0, 0, 8, 2, 17, 1),
('row_name', 20, 0, 0, 8, 2, 18, 1);

-- --------------------------------------------------------

--
-- Table structure for table `argument_option`
--

CREATE TABLE IF NOT EXISTS `argument_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `argument_id` int(11) NOT NULL,
  `short_name` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `argument_id` (`argument_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `argument_option`
--

INSERT INTO `argument_option` (`id`, `name`, `argument_id`, `short_name`) VALUES
(1, '--top', 5, '-t'),
(2, '--bottom', 5, '-b');

-- --------------------------------------------------------

--
-- Table structure for table `command`
--

CREATE TABLE IF NOT EXISTS `command` (
  `name` text NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requires_option` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `command`
--

INSERT INTO `command` (`name`, `id`, `requires_option`) VALUES
('ls', 1, 0),
('cd', 2, 0),
('clear', 3, 0),
('help', 4, 0),
('move', 5, 0),
('man', 6, 0),
('create', 8, 0);

-- --------------------------------------------------------

--
-- Table structure for table `command_option`
--

CREATE TABLE IF NOT EXISTS `command_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `short_name` text NOT NULL,
  `command_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `command_id` (`command_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `command_option`
--

INSERT INTO `command_option` (`id`, `name`, `short_name`, `command_id`) VALUES
(3, '--top', '-t', 8),
(4, '--bottom', '-b', 5);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `argument`
--
ALTER TABLE `argument`
  ADD CONSTRAINT `argument_ibfk_1` FOREIGN KEY (`command_id`) REFERENCES `command` (`id`);

--
-- Constraints for table `argument_option`
--
ALTER TABLE `argument_option`
  ADD CONSTRAINT `argument_option_ibfk_1` FOREIGN KEY (`argument_id`) REFERENCES `argument` (`id`);

--
-- Constraints for table `command_option`
--
ALTER TABLE `command_option`
  ADD CONSTRAINT `command_option_ibfk_1` FOREIGN KEY (`command_id`) REFERENCES `command` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
