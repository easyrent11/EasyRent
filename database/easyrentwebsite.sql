-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2023 at 12:36 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `activity_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `activity_type` varchar(255) DEFAULT NULL,
  `activity_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`activity_id`, `user_id`, `activity_type`, `activity_time`, `details`) VALUES
(2, NULL, 'New User Registered', '2023-08-23 17:38:05', 'User 463457346 registered to the website'),
(3, NULL, 'New User Registered', '2023-09-19 16:37:02', 'User 123321456 registered to the website'),
(4, NULL, 'New User Registered', '2023-09-24 18:00:54', 'User 555555557 registered to the website'),
(5, NULL, 'New User Registered', '2023-09-24 18:04:44', 'User 444477772 registered to the website'),
(6, NULL, 'New User Registered', '2023-09-24 18:06:20', 'User 333377766 registered to the website'),
(7, NULL, 'New User Registered', '2023-09-24 18:08:38', 'User 676548456 registered to the website');

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
  `Renter_Id` int(9) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`Manufacturer_Code`, `model_code`, `Plates_Number`, `Year`, `Color`, `Seats_Amount`, `Engine_Type`, `Transmission_type`, `Description`, `Rental_Price_Per_Day`, `Renter_Id`, `status`, `upload_date`) VALUES
('bmw', 'm4', 4444666, 1993, 'Black', 4, 'Diesel', 'Manual', 'fgerdh', 500, 123456789, 1, '2023-09-14 13:05:00'),
('bmw', 'm3', 5555444, 2006, 'Black', 5, 'Electric', 'Manual', 'gsdag', 300, 123456789, 1, '2023-11-26 16:56:20'),
('alfa romeo', '145', 6666555, 1992, 'Black', 4, 'Petrol', 'Manual', 'Aweosdgndf', 180, 123456789, 1, '2023-09-17 08:08:17'),
('bmw', 'i3', 7777776, 1992, 'Blue', 5, 'Diesel', 'Auto', 'rrfghdfhd', 230, 123456789, 1, '2023-09-17 08:08:17'),
('chevrolet', 'captiva', 9997771, 1991, 'Black', 1, 'Diesel', 'Manual', 'sdgfdskgkw5tk', 100, 123456783, 0, '2023-09-17 08:08:17'),
('lexus', 'gs 300', 9998887, 1992, 'Blue', 4, 'Diesel', 'Manual', 'fkjgdfkhgdh', 70, 123456783, 1, '2023-09-17 08:08:17');

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
(6666555, 'default-car.jpg'),
(9998887, 'default-car.jpg'),
(9997771, 'default-car.jpg'),
(4444666, 'default-car.jpg'),
(5555444, 'default-car.jpg'),
(7777776, 'default-car.jpg');

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
('alfa romeo', 'Alfa Romeo'),
('audi', 'Audi'),
('bmw', 'BMW'),
('chevrolet', 'Chevrolet'),
('lexus', 'Lexus');

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
('100 avant', '100 Avant', 'audi'),
('145', '145', 'alfa romeo'),
('146', '146', 'alfa romeo'),
('80', '80', 'audi'),
('a3', 'A3', 'audi'),
('captiva', 'Captiva', 'chevrolet'),
('gs 300', 'GS 300', 'lexus'),
('i3', 'i3', 'bmw'),
('m3', 'M3', 'bmw'),
('m4', 'M4', 'bmw');

-- --------------------------------------------------------

--
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` int(11) NOT NULL,
  `user1_id` int(9) NOT NULL,
  `user2_id` int(9) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `chat_rooms`
--

INSERT INTO `chat_rooms` (`id`, `user1_id`, `user2_id`, `created_at`) VALUES
(57, 123456789, 123456783, '2023-10-05 11:01:15'),
(58, 123432654, 123456789, '2023-10-11 16:21:02');

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
(6, 'Ashdod'),
(13, 'Ashkelon'),
(23, 'Ashdod Yam'),
(57, 'Shfaram');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `chat_room_id` int(11) NOT NULL,
  `user_id` int(9) NOT NULL,
  `text` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `chat_room_id`, `user_id`, `text`, `timestamp`) VALUES
(259, 58, 123432654, 'Kefak', '2023-10-11 16:21:06');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `userId` int(9) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `order_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
  `End_Time` time NOT NULL,
  `status` varchar(30) NOT NULL,
  `Renter_Id` int(11) DEFAULT NULL,
  `Order_Date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Start_Date`, `End_Date`, `Order_Id`, `Car_Plates_Number`, `Rentee_id`, `Start_Time`, `End_Time`, `status`, `Renter_Id`, `Order_Date`) VALUES
('2023-12-23', '2023-12-29', 196, 4444666, 123456783, '10:00:00', '10:00:00', 'pending', 123456789, '2023-12-04 17:56:17'),
('2023-12-13', '2023-12-23', 197, 5555444, 123456783, '10:00:00', '10:00:00', 'pending', 123456789, '2023-12-04 18:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `Id` int(9) NOT NULL,
  `Reported_User_Id` int(9) DEFAULT NULL,
  `Reporting_User_Id` int(9) DEFAULT NULL,
  `Report_Cause` varchar(50) DEFAULT NULL,
  `Message` text DEFAULT NULL
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
  `status` enum('active','disabled') DEFAULT 'active',
  `Report_Counter` int(20) DEFAULT 0,
  `register_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `phone_number`, `driving_license`, `picture`, `email`, `password`, `city_code`, `street_name`, `first_name`, `last_name`, `isadmin`, `status`, `Report_Counter`, `register_date`) VALUES
(98098098, 524987777, '987987654', 'default.jpg', 'jack@gmail.com', '$2b$10$J6MP4Bjb2sJQOxYl/5a4kuI028a636fTdm5a2SV6xPyiOE.s.Cv7a', 6, 'djfkg12', 'jack', 'ch', 0, 'active', 0, '2023-08-21 14:57:59'),
(121121121, 524123876, '123876653', 'default.jpg', 'admin@gmail.com', '$2a$10$eNvyW0r9TYvICzOCrH/sh.YZq.WSYESymX8SzB9od9JqOLvkCGLuy', 2, 'Admin Street', 'Admin', 'a', 1, 'active', 0, '2023-08-21 14:57:59'),
(123432654, 524321122, '575648787', 'default.jpg', 'john@gmail.com', '$2b$10$Zn9gKxFKZReZCS/3qcqg2Oyn2nGq4sbUwRBRumsYTXmJJiQJkYLG2', 1, 'djfkg153', 'john', 'doe', 0, 'active', 0, '2023-08-21 14:57:59'),
(123456783, 524321123, '435634267', 'default.jpg', 'omar@gmail.com', '$2b$10$tGuZn3XEi6O4swdo/.fVm.s4YZ75qZB2p7g/sNk3Je8vEIOT.s3tS', 2, 'djfkg12', 'omar', 'taha', 0, 'active', 9, '2023-09-18 08:56:08'),
(123456789, 526324123, '534565473', '3517718853d9e6fd80fcf3c2fbdab654.jpeg', 'sobhi@gmail.com', '$2b$10$/6tqRR/j/S4cl9/.GAdKuO.V1DLkR.q9wwUk/ZRBSHZEc7Kv9QYp2', 57, 'halab11', 'sobhi', 'shehab', 0, 'active', 3, '2023-09-17 13:24:38'),
(565432764, 524987773, '565437654', 'default.jpg', 'jack@outlook.com', '$2b$10$w9kK9/fNWJAEbyZD3FYvB.3m71c7JHTcwgQoJp4USLgfnQpfAFV.K', 23, 'djfkg12', 'jack', 'dfhdfs', 0, 'active', 0, '2023-08-22 11:02:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`City_Code`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_room_id` (`chat_room_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_Id`),
  ADD KEY `fk_orders_rentee` (`Rentee_id`),
  ADD KEY `fk_orders_car` (`Car_Plates_Number`),
  ADD KEY `FK_Renter_Id` (`Renter_Id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Reported_User_Id` (`Reported_User_Id`),
  ADD KEY `Reporting_User_Id` (`Reporting_User_Id`);

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
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=260;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Order_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `Id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`Id`);

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
-- Constraints for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `chat_rooms_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`Id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_rooms` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`Id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`Id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_Renter_Id` FOREIGN KEY (`Renter_Id`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `fk_orders_car` FOREIGN KEY (`Car_Plates_Number`) REFERENCES `cars` (`Plates_Number`),
  ADD CONSTRAINT `fk_orders_rentee` FOREIGN KEY (`Rentee_id`) REFERENCES `users` (`Id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`Reported_User_Id`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`Reporting_User_Id`) REFERENCES `users` (`Id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_city_code` FOREIGN KEY (`city_code`) REFERENCES `cities` (`City_Code`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
