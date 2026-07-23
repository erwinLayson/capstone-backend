-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 23, 2026 at 03:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gradesync_v3`
--

-- --------------------------------------------------------

--
-- Table structure for table `classrooms`
--

CREATE TABLE `classrooms` (
  `id` int(11) NOT NULL,
  `section` varchar(20) NOT NULL,
  `gradeLevel` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classrooms`
--

INSERT INTO `classrooms` (`id`, `section`, `gradeLevel`) VALUES
(9, 'abno', 12),
(10, 'abnormal', 12),
(13, 'aguinaldo', 9),
(11, 'aguinaldo', 10),
(14, 'del pilar', 8),
(15, 'jupiter', 7);

-- --------------------------------------------------------

--
-- Table structure for table `class_students`
--

CREATE TABLE `class_students` (
  `id` bigint(20) NOT NULL,
  `classId` int(11) NOT NULL,
  `enrollmentId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class_subjects`
--

CREATE TABLE `class_subjects` (
  `id` int(11) NOT NULL,
  `classId` int(11) NOT NULL,
  `teacherId` bigint(20) NOT NULL,
  `subjectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_subjects`
--

INSERT INTO `class_subjects` (`id`, `classId`, `teacherId`, `subjectId`) VALUES
(8, 9, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `class_teacher`
--

CREATE TABLE `class_teacher` (
  `id` bigint(20) NOT NULL,
  `classId` int(11) NOT NULL,
  `teacherId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_teacher`
--

INSERT INTO `class_teacher` (`id`, `classId`, `teacherId`) VALUES
(5, 13, NULL),
(6, 14, NULL),
(7, 15, 3);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint(20) NOT NULL,
  `dateEnrolled` date NOT NULL DEFAULT curdate(),
  `classId` int(11) NOT NULL,
  `schoolYearId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollment_details`
--

CREATE TABLE `enrollment_details` (
  `id` bigint(20) NOT NULL,
  `enrollmentId` bigint(20) NOT NULL,
  `subjectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schoolyear`
--

CREATE TABLE `schoolyear` (
  `id` int(11) NOT NULL,
  `startYear` varchar(20) NOT NULL,
  `endYear` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `school_info`
--

CREATE TABLE `school_info` (
  `id` int(11) NOT NULL,
  `schoolId` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `district` varchar(20) NOT NULL,
  `division` varchar(50) NOT NULL,
  `region` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_info`
--

INSERT INTO `school_info` (`id`, `schoolId`, `name`, `district`, `division`, `region`, `created_at`, `updated_at`) VALUES
(1, 12345, 'sksu', '1', 'South', '213', '2026-06-27 03:54:07', '2026-07-03 09:08:33');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `lrn` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `middlename` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `sex` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `code` text NOT NULL,
  `unit` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `code`, `unit`) VALUES
(1, 'Mathematics', 'MT', 111),
(2, 'Science and health', 'SCI', 3),
(3, 'filino', 'fi', 3),
(4, 'English', 'eng', 3),
(5, 'English', 'ENGENG', 2),
(6, 'Bisaya', '207', 1),
(7, 'Tagalog part', 'Buangit', 2),
(10, 'Phil health', 'phih', 123),
(11, 'Phil health2', 'phih4', 123),
(12, 'adsada', '1231', 123),
(13, 'ddadasd', '2342', 1231),
(14, 'filino', '1231', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(20) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `userId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `email`, `firstname`, `middlename`, `lastname`, `suffix`, `userId`) VALUES
(3, 'Aguinaldo@1', 'Erwin', 'balboa', 'Layson', 'JR', 39),
(4, 'Aguinaldo@1.com', ' Jan', 'Doe', 'Malabalay', NULL, 53),
(5, 'Aguinaldo@14444', ' a', 'a ', 'b ', NULL, 54);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_subject_assignment`
--

CREATE TABLE `teacher_subject_assignment` (
  `id` bigint(20) NOT NULL,
  `teacherId` bigint(20) NOT NULL,
  `subjectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher_subject_assignment`
--

INSERT INTO `teacher_subject_assignment` (`id`, `teacherId`, `subjectId`) VALUES
(5, 3, 3),
(6, 4, 3),
(7, 4, 4),
(9, 3, 2),
(10, 4, 2),
(12, 5, 2),
(13, 5, 4),
(16, 5, 1),
(17, 3, 1),
(18, 4, 1),
(19, 3, 4),
(20, 5, 3),
(21, 3, 5),
(22, 4, 5),
(23, 5, 5),
(24, 3, 6),
(25, 4, 6),
(26, 5, 6),
(27, 3, 7),
(28, 4, 7),
(29, 5, 7),
(35, 3, 10),
(36, 5, 10),
(37, 4, 10),
(38, 3, 11),
(39, 4, 11),
(40, 5, 11),
(41, 3, 12),
(42, 4, 12),
(43, 5, 12),
(44, 3, 13),
(45, 4, 13),
(46, 5, 13),
(47, 3, 14);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin@example.com', '$2b$10$YHdBvXajs67yyMHrqcEVQ.ubfChElwOoHtvOGv/2tas1/.SRiG2He', 'admin', '2026-06-16 07:07:49', NULL),
(2, 'student@example.com', '$2b$10$NoK5CMnbNfq8RUyWnzoDU.ELqcdMEcnqovXkFtVLR1fML3mMyn0YK', 'student', '2026-06-17 01:30:37', NULL),
(6, 'erwin@example.com', '$2b$10$XVsdQV2dyqigDUF//w5pEeR5TCbRHBjyn0b6UN95CKLGy54XrmQvy', 'student', '2026-06-22 15:51:58', NULL),
(8, 'student1@example.com', '$2b$10$3n1IWiTfBVUZs.BvDvFKquDqn3iWmeq08oEh5/Yb1f83MMVL/EOZu', 'student', '2026-06-23 00:34:10', NULL),
(9, 'teacher@example.com', '$2b$10$aqPVXIiu22HwlDb8dYevouLmtu2bW3EV8VISfmwbPHfVYBptN1N22', 'teacher', '2026-06-23 00:35:50', NULL),
(10, 'student2@example.com', '$2b$10$8z97sSLsTAFikXxOfkGioeBj8g/h3p1y6VSfqhnsIWrI1wG/sSSY2', 'student', '2026-06-23 01:08:36', NULL),
(12, 'student3@example.com', '$2b$10$aB2lZOmk2aEum8JEeP/08Oy9b7wn.dQAwa8MTEGHU4tn4HE5jMwEG', 'student', '2026-06-23 12:12:54', NULL),
(34, 'student1234@example.com', '$2b$10$PjZVHCw8vQEGvbwUwWCfvun.TLTyuGydWbr.hNeyODzKYBl38RVTS', 'student', '2026-07-03 01:47:32', NULL),
(35, 'admin55@example.com', '$2b$10$PjWDP2KhgXAUIWcHC3CEze0InHrNX8sTsrNZP0SoG6rL2cy.P/Nmi', 'admin', '2026-07-03 04:45:39', NULL),
(36, 'student12434@example.com', '$2b$10$2pgow/qbqb7vMtFAyfMJ1Oo1TfQ3en3EVgN5DVewOQrxL2n1Ny8Fa', 'student', '2026-07-03 08:32:00', NULL),
(39, 'Aguinaldo@1', '$2b$10$cxTj0TGQNRfMsdUAlT/Z1ea2Ukrj0TypqcHP.s0sk.jU9XleLi1zq', 'teacher', '2026-07-04 09:24:46', NULL),
(40, 'user@gmail.com', '$2b$10$ITlDVVYH6.1NO1chqtkbG.BLKeGwsyyyI5ZoXj0lRiNXNj/mkPhUW', 'student', '2026-07-06 09:14:42', NULL),
(41, 'user@gmail.comm', '$2b$10$Dc988vwuHO5.1R2BJ3J0beXf89Cqca.tm779gjFbEt98vuqDGIUyu', 'student', '2026-07-06 09:22:03', NULL),
(42, 'usesr@gmail.comm', '$2b$10$IaIQiJAgu88cs4IOkcV7p.FEairvemfzxeE2m08cVczjbujBXxBI2', 'student', '2026-07-06 09:22:57', NULL),
(43, 'usesrs@gmail.comm', '$2b$10$UKUSOyNvnK3WVylJbh1JnuNp.ITnMvtt7TP5BBaLIW7iElU2ex14S', 'student', '2026-07-06 09:23:07', NULL),
(44, 'usessrs@gmail.comm', '$2b$10$HAoQgAynLWq9uBpKE3dGSOdMQxANg.Ed/9s/16NzsQqgWTGoeyFd2', 'student', '2026-07-06 09:23:12', NULL),
(45, 'usersss@gmail.com', '$2b$10$lmLPnbT5JSD7cPtU8Jj06ejKaJDCAYEIedxx0ee9z6MwDHO7FtVtS', 'student', '2026-07-06 09:28:28', NULL),
(46, 'userssss@gmail.com', '$2b$10$L/dige61RM7lU0LJZc7zk.iQhQ3jgy7bT/BqpZDuvNd0/bQQnGpk.', 'student', '2026-07-06 09:29:02', NULL),
(47, 'usersssss@gmail.com', '$2b$10$H69YVNANr4Atpl.L7pUCROM0PLGEA4FiobDvwaD4K2wvNtYlI5cQq', 'student', '2026-07-06 09:30:16', NULL),
(48, 'ussersss@gmail.com', '$2b$10$35zG/e/dkUxXiL5O8euNOusZr8oac6er2fmOqfj5wQhMx6b6D9/pa', 'student', '2026-07-06 09:30:31', NULL),
(49, 'sussersss@gmail.com', '$2b$10$kk.LzuBK7AxN.UIsvu.70ukz9GglJlsIEC8CMHZRWxdCC.HliKrCC', 'student', '2026-07-06 09:32:24', NULL),
(50, 'susserssss@gmail.com', '$2b$10$6GnD6DEBg7RAR9pZxfXXu.nJ3XAU2nmBUXsL4IdUlCVQwyZLmpYgS', 'student', '2026-07-06 09:40:13', NULL),
(51, 'sussersss@gmil.com', '$2b$10$t2jdUfFTawnypWOiHLCZc.QQx27KNqiC7Jg/s7QBl4cymdsnGkF4W', 'student', '2026-07-06 10:31:39', NULL),
(52, 'sussersss@ssgmil.com', '$2b$10$7FkMAh4vhkZqV9DS9EbAROgoPOSjo6/L.VXybzDnH6SijAZ87ZwF.', 'student', '2026-07-06 13:20:19', NULL),
(53, 'Aguinaldo@1.com', '$2b$10$ZtRjNedW6c9ENW7LYkD3IOaYgIHAgdcu1F8y4uKzIfF6locvbUAJy', 'teacher', '2026-07-08 01:04:44', NULL),
(54, 'Aguinaldo@14444', '$2b$10$xxGq0lm9jVdVL5G/uUl4C.5DvNgyVmifVmCMm57Bc2rAHJnoYhC8.', 'teacher', '2026-07-13 04:24:29', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classrooms`
--
ALTER TABLE `classrooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_classroom_section` (`section`,`gradeLevel`);

--
-- Indexes for table `class_students`
--
ALTER TABLE `class_students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_class_student1` (`classId`),
  ADD KEY `fk_class_student2` (`enrollmentId`);

--
-- Indexes for table `class_subjects`
--
ALTER TABLE `class_subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_class_subjects` (`subjectId`,`teacherId`),
  ADD KEY `classId` (`classId`),
  ADD KEY `fk_class_subjects_teacher` (`teacherId`);

--
-- Indexes for table `class_teacher`
--
ALTER TABLE `class_teacher`
  ADD PRIMARY KEY (`id`),
  ADD KEY `classId` (`classId`),
  ADD KEY `teacherId` (`teacherId`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrollment_details`
--
ALTER TABLE `enrollment_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schoolyear`
--
ALTER TABLE `schoolyear`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `school_info`
--
ALTER TABLE `school_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_teacher1` (`userId`);

--
-- Indexes for table `teacher_subject_assignment`
--
ALTER TABLE `teacher_subject_assignment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tsa_1` (`teacherId`),
  ADD KEY `fk_tsa_2` (`subjectId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classrooms`
--
ALTER TABLE `classrooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `class_students`
--
ALTER TABLE `class_students`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `class_subjects`
--
ALTER TABLE `class_subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `class_teacher`
--
ALTER TABLE `class_teacher`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `enrollment_details`
--
ALTER TABLE `enrollment_details`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schoolyear`
--
ALTER TABLE `schoolyear`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `school_info`
--
ALTER TABLE `school_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `teacher_subject_assignment`
--
ALTER TABLE `teacher_subject_assignment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `class_students`
--
ALTER TABLE `class_students`
  ADD CONSTRAINT `fk_class_student1` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_class_student2` FOREIGN KEY (`enrollmentId`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `class_subjects`
--
ALTER TABLE `class_subjects`
  ADD CONSTRAINT `fk_class_subjects_subject` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_class_subjects_teacher` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `class_teacher`
--
ALTER TABLE `class_teacher`
  ADD CONSTRAINT `class_teacher_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`id`),
  ADD CONSTRAINT `class_teacher_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_class_teacher2` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teacherId_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `fk_teacher1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teacher_subject_assignment`
--
ALTER TABLE `teacher_subject_assignment`
  ADD CONSTRAINT `fk_tsa_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tsa_2` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
