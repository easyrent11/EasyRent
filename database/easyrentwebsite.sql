-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2023 at 01:07 PM
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
  `Type` int(3) DEFAULT NULL,
  `Manufacturer` varchar(20) DEFAULT NULL,
  `Model` varchar(20) DEFAULT NULL,
  `Plates_Number` int(8) NOT NULL,
  `Year` int(4) DEFAULT NULL,
  `Color` varchar(10) DEFAULT NULL,
  `Pictures` varchar(20) DEFAULT NULL,
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

INSERT INTO `cars` (`Type`, `Manufacturer`, `Model`, `Plates_Number`, `Year`, `Color`, `Pictures`, `Seats_Amount`, `Engine_Type`, `Transmission_type`, `Description`, `Rental_Price_Per_Day`, `Renter_Id`) VALUES
(1, 'M001', '1', 12345678, 2022, 'Red', 'car1.jpg', 3, 'Petrol', 'Automatic', 'Description for Car 1', 100, 123456789),
(1, 'M002', '1', 21212155, 2021, 'White', 'car3.jpg', 5, 'Gasoline', 'Automatic', 'Description for Car 3', 150, 987654321),
(1, 'M001', '2', 29977788, 2019, 'Black', 'car4.jpg', 7, 'Hybrid', 'Automatic', 'Description for Car 4', 130, 987654321),
(1, 'M001', '2', 33333322, 2020, 'Blue', 'car2.jpg', 3, 'Diesel', 'Manual', 'Description for Car 2', 120, 555555555),
(1, 'M002', '1', 88866633, 2023, 'Silver', 'car5.jpg', 3, 'Electric', 'Automatic', 'Description for Car 5', 200, 123456789);

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
('M001', 'Mercedes'),
('M002', 'Bmw');

-- --------------------------------------------------------

--
-- Table structure for table `car_models`
--

CREATE TABLE `car_models` (
  `model_code` varchar(20) NOT NULL,
  `model_name` varchar(50) DEFAULT NULL,
  `manufacturer_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `car_models`
--

INSERT INTO `car_models` (`model_code`, `model_name`, `manufacturer_code`) VALUES
('1', 'E300', 'M001'),
('2', 'M4', 'M002');

-- --------------------------------------------------------

--
-- Table structure for table `car_types`
--

CREATE TABLE `car_types` (
  `Type_Id` int(3) NOT NULL,
  `Type_Name` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `car_types`
--

INSERT INTO `car_types` (`Type_Id`, `Type_Name`) VALUES
(1, 'Sedan'),
(2, 'HatchBack'),
(3, 'Suv');

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
(1, 'Tel Aviv'),
(2, 'Haifa'),
(3, 'ShfarAm');

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

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Start_Date`, `End_Date`, `Order_Id`, `Car_Plates_Number`, `Rentee_id`, `Start_Time`, `End_Time`) VALUES
('2023-05-27', '2023-05-30', 1, 12345678, 987654321, '09:00:00', '18:00:00'),
('2023-06-01', '2023-06-05', 2, 29977788, 555555555, '12:00:00', '20:00:00');

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
  `last_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `phone_number`, `driving_license`, `picture`, `email`, `password`, `city_code`, `street_name`, `first_name`, `last_name`) VALUES
(123456789, 1234567890, 'DL123', 'user1.jpg', 'user1@example.com', 'password1', 1, 'Street 1', 'John', 'Doe'),
(555555555, 2147483647, 'DL789', 'user3.jpg', 'user3@example.com', 'password3', 3, 'Street 3', 'Mike', 'Johnson'),
(987654321, 2147483647, 'DL456', 'user2.jpg', 'user2@example.com', 'password2', 2, 'Street 2', 'Jane', 'Smith');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`Plates_Number`),
  ADD KEY `Renter_Id` (`Renter_Id`),
  ADD KEY `cars_ibfk_3` (`Manufacturer`),
  ADD KEY `cars_ibfk_4` (`Model`),
  ADD KEY `cars_ibfk_2` (`Type`);

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
  ADD KEY `manufacturer_code` (`manufacturer_code`);

--
-- Indexes for table `car_types`
--
ALTER TABLE `car_types`
  ADD PRIMARY KEY (`Type_Id`);

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
  ADD KEY `Car_Plates_Number` (`Car_Plates_Number`),
  ADD KEY `Rentee_id` (`Rentee_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `city_code` (`city_code`);

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
  ADD CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`Renter_Id`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`Type`) REFERENCES `car_types` (`Type_Id`),
  ADD CONSTRAINT `cars_ibfk_3` FOREIGN KEY (`Manufacturer`) REFERENCES `car_manufacturer` (`Manufacturer_Code`),
  ADD CONSTRAINT `cars_ibfk_4` FOREIGN KEY (`Model`) REFERENCES `car_models` (`model_code`);

--
-- Constraints for table `car_models`
--
ALTER TABLE `car_models`
  ADD CONSTRAINT `car_models_ibfk_1` FOREIGN KEY (`manufacturer_code`) REFERENCES `car_manufacturer` (`Manufacturer_Code`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`Car_Plates_Number`) REFERENCES `cars` (`Plates_Number`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`Rentee_id`) REFERENCES `users` (`Id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`city_code`) REFERENCES `cities` (`City_Code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
