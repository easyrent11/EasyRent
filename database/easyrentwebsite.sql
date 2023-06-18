-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2023 at 07:56 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `easyrentwebsite`
--

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `Manufacturer_Code` varchar(20) DEFAULT NULL,
  `model_code` varchar(20) DEFAULT NULL,
  `Plates_Number` int(8) NOT NULL,
  `Year` int(4) DEFAULT NULL,
  `Color` varchar(10) DEFAULT NULL,
  `Seats_Amount` int(2) DEFAULT NULL,
  `Engine_Type` varchar(20) DEFAULT NULL,
  `Transmission_type` varchar(20) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Rental_Price_Per_Day` int(6) DEFAULT NULL,
  `Renter_Id` int(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`Manufacturer_Code`, `model_code`, `Plates_Number`, `Year`, `Color`, `Seats_Amount`, `Engine_Type`, `Transmission_type`, `Description`, `Rental_Price_Per_Day`, `Renter_Id`) VALUES
('bmw', 'm4', 22233355, 2012, 'red', 6, 'Diesel', 'Auto', 'hfghsdgdfsghda', 200, 123456787),
('audi', 'a3', 33311124, 2009, 'yellow', 3, 'Petrol', 'Auto', 'dfhgfdhdfsh', 90, 123456787),
('land rover', 'freelander', 33344476, 2014, 'blue', 7, 'Petrol', 'Auto', 'dfhdfh', 20, 123456787);

-- --------------------------------------------------------

--
-- Table structure for table `car_images`
--

CREATE TABLE `car_images` (
  `Plates_Number` int(8) DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `car_images`
--

INSERT INTO `car_images` (`Plates_Number`, `image_url`) VALUES
(22233355, '839af909ea591311d061ababc8a38841.jpeg'),
(22233355, '23eb666dc876065ac5d208d5ebf411ee.jpeg'),
(22233355, '41cbd960dff9b7b1d00696ab9207a92c.jpeg'),
(22233355, 'b3eb8247de5364597d71414147b7999b.jpeg'),
(33311124, '425d655a4d7888a5afe2b555fa015a8f.jpeg'),
(33311124, 'ed224a13ac367e7654c33bb4b9f4cd2f.jpeg'),
(33344476, 'e477f772d1b5620829dd2ecb5d066204.png'),
(33344476, 'dc1894b830daff73c637af931b87df9b.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `car_manufacturer`
--

CREATE TABLE `car_manufacturer` (
  `Manufacturer_Code` varchar(20) NOT NULL,
  `Manufacturer_Name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `car_manufacturer`
--

INSERT INTO `car_manufacturer` (`Manufacturer_Code`, `Manufacturer_Name`) VALUES
('audi', 'Audi'),
('bmw', 'BMW'),
('land rover', 'Land Rover');

-- --------------------------------------------------------

--
-- Table structure for table `car_models`
--

CREATE TABLE `car_models` (
  `model_code` varchar(20) NOT NULL,
  `model_name` varchar(50) DEFAULT NULL,
  `Manufacturer_Code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `car_models`
--

INSERT INTO `car_models` (`model_code`, `model_name`, `Manufacturer_Code`) VALUES
('a3', 'A3', 'audi'),
('freelander', 'Freelander', 'land rover'),
('m4', 'M4', 'bmw');

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `City_Code` int(10) NOT NULL,
  `City_Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`City_Code`, `City_Name`) VALUES
(2, 'Haifa'),
(57, 'Shfaram');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Start_Date` date NOT NULL,
  `End_Date` date NOT NULL,
  `Order_Id` int(11) NOT NULL,
  `Car_Plates_Number` int(8) DEFAULT NULL,
  `Rentee_id` int(9) DEFAULT NULL,
  `Start_Time` time NOT NULL,
  `End_Time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(9) NOT NULL,
  `phone_number` int(10) NOT NULL,
  `driving_license` varchar(10) NOT NULL,
  `picture` varchar(70) NOT NULL,
  `email` varchar(70) NOT NULL,
  `password` varchar(255) NOT NULL,
  `city_code` int(2) DEFAULT NULL,
  `street_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `isadmin` tinyint(1) DEFAULT 0,
  `status` enum('active','disabled') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `phone_number`, `driving_license`, `picture`, `email`, `password`, `city_code`, `street_name`, `first_name`, `last_name`, `isadmin`, `status`) VALUES
(123456787, 526789123, '35364', '3e4dd4fa9b8c39dd07c0cb55a222f59e.png', 'sobhi@gmail.com', '$2b$10$sweHc8.CoUZdepUJUZ5XFOaLFfntYTsGKaEbQjQUt2Or1/iLPv92S', 57, 'halab1', 'sobhi', 'sh', 0, 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`Plates_Number`),
  ADD KEY `fk_cars_car_manufacturer` (`Manufacturer_Code`),
  ADD KEY `fk_cars_car_models` (`model_code`),
  ADD KEY `FK_Cars_Users` (`Renter_Id`);

--
-- Indexes for table `car_images`
--
ALTER TABLE `car_images`
  ADD KEY `fk_car_images_cars` (`Plates_Number`);

--
-- Indexes for table `car_manufacturer`
--
ALTER TABLE `car_manufacturer`
  ADD PRIMARY KEY (`Manufacturer_Code`);

--
-- Indexes for table `car_models`
--
ALTER TABLE `car_models`
  ADD PRIMARY KEY (`model_code`),
  ADD KEY `fk_car_models_manufacturer` (`Manufacturer_Code`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`City_Code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_Id`),
  ADD KEY `fk_orders_rentee` (`Rentee_id`),
  ADD KEY `fk_orders_car` (`Car_Plates_Number`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `fk_city_code` (`city_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Order_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `FK_Cars_Users` FOREIGN KEY (`Renter_Id`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `fk_cars_car_manufacturer` FOREIGN KEY (`Manufacturer_Code`) REFERENCES `car_manufacturer` (`Manufacturer_Code`),
  ADD CONSTRAINT `fk_cars_car_models` FOREIGN KEY (`model_code`) REFERENCES `car_models` (`model_code`);

--
-- Constraints for table `car_images`
--
ALTER TABLE `car_images`
  ADD CONSTRAINT `fk_car_images_cars` FOREIGN KEY (`Plates_Number`) REFERENCES `cars` (`Plates_Number`);

--
-- Constraints for table `car_models`
--
ALTER TABLE `car_models`
  ADD CONSTRAINT `fk_car_models_manufacturer` FOREIGN KEY (`Manufacturer_Code`) REFERENCES `car_manufacturer` (`Manufacturer_Code`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_car` FOREIGN KEY (`Car_Plates_Number`) REFERENCES `cars` (`Plates_Number`),
  ADD CONSTRAINT `fk_orders_rentee` FOREIGN KEY (`Rentee_id`) REFERENCES `users` (`Id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_city_code` FOREIGN KEY (`city_code`) REFERENCES `cities` (`City_Code`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
