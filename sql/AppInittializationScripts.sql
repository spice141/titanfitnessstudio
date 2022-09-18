CREATE DATABASE `titanfitnessstudio` 

USE titanfitnessstudio



CREATE TABLE `gym_profile` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `GYM_NAME` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `GYM_ADDRESS` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `GYM_OWNER_NAME` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `GYM_OWNER_CONTACT_NUMBER` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `STATUS` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `CREATED_DATE` datetime DEFAULT NULL,
  `CREATED_BY` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `LAST_MODIFIED_DATE` datetime DEFAULT NULL,
  `LAST_MODIFIED_BY` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `SUBSCRIPTION_TYPE` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `EMAIL` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `WEBSITE` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `GYM_LOGO` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `gym_payment_log` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `GYM_PROFILE_ID` int NOT NULL,
  `PAYMENT_TYPE` varchar(45) DEFAULT NULL,
  `PAYMENT_AMOUNT` int DEFAULT NULL,
  `EFFECTIVE_DATE` date DEFAULT NULL,
  `END_DATE` date DEFAULT NULL,
  `PAYMENT_DATE` date DEFAULT NULL,
  `PAYMENT_BALANCE` float DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `GYM_PAYMENT_LOG_GYM_PROFILE_idx` (`GYM_PROFILE_ID`),
  CONSTRAINT `GYM_PAYMENT_LOG_GYM_PROFILE` FOREIGN KEY (`GYM_PROFILE_ID`) REFERENCES `gym_profile` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_master` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_NAME` varchar(45) NOT NULL,
  `PASSWORD` varchar(45) NOT NULL,
  `CREATED_DATE` date DEFAULT NULL,
  `LAST_MODIFIED_DATE` date DEFAULT NULL,
  `GYM_PROFILE_ID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `USER_MASTER_GYM_PROFILE_idx` (`GYM_PROFILE_ID`),
  CONSTRAINT `USER_MASTER_GYM_PROFILE` FOREIGN KEY (`GYM_PROFILE_ID`) REFERENCES `gym_profile` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `customer_profile` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `PHONE` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `EMAIL` varchar(45) DEFAULT NULL,
  `ADDRESS` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `REFERENCE` varchar(100) DEFAULT NULL,
  `IMAGE_PATH` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `CREATED_DATE` datetime DEFAULT NULL,
  `CREATED_BY` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `LAST_MODIFIED_DATE` datetime DEFAULT NULL,
  `LAST_MODIFIED_BY` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `GYM_PROFILE_ID` int DEFAULT NULL,
  `PASSWORD` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `STATUS` tinyint DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `CUSTOMER_PROFILE_GYM_PROFILE_idx` (`GYM_PROFILE_ID`),
  CONSTRAINT `CUSTOMER_PROFILE_GYM_PROFILE` FOREIGN KEY (`GYM_PROFILE_ID`) REFERENCES `gym_profile` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customer_activity_log` (
  `ID` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `CUSTOMER_PROFILE_ID` int NOT NULL,
  `IN_TIME` datetime DEFAULT NULL,
  `OUT_TIME` datetime DEFAULT NULL,
  `DURATION` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `SLOT` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `CREATED_BY` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `CREATED_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `customer_profile_activity_idx` (`CUSTOMER_PROFILE_ID`),
  CONSTRAINT `customer_profile_activity` FOREIGN KEY (`CUSTOMER_PROFILE_ID`) REFERENCES `customer_profile` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customer_measurement_log` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `CUSTOMER_PROFILE_ID` int NOT NULL,
  `WEIGHT` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `HEIGHT` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `SHOULDER` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `CHEST` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ARMS` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ABS` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `THIGH` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ENTRY_DATE` date DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `CUSTOMER_PROFILE_ID_idx` (`CUSTOMER_PROFILE_ID`),
  CONSTRAINT `CUSTOMER_PROFILE_ID` FOREIGN KEY (`CUSTOMER_PROFILE_ID`) REFERENCES `customer_profile` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customer_payment_log` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `CUSTOMER_PROFILE_ID` int NOT NULL,
  `PAYMENT_TYPE` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `PAYMENT_AMOUNT` float NOT NULL,
  `EFFECTIVE_DATE` date NOT NULL,
  `END_DATE` date DEFAULT NULL,
  `PAYMENT_DATE` date NOT NULL,
  `PAYMENT_BALANCE` float DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `customer_profile_payment_idx` (`CUSTOMER_PROFILE_ID`),
  CONSTRAINT `customer_profile_payment` FOREIGN KEY (`CUSTOMER_PROFILE_ID`) REFERENCES `customer_profile` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `titanfitnessstudio`.`gym_profile`
(`ID`,
`GYM_NAME`,
`GYM_ADDRESS`,
`GYM_OWNER_NAME`,
`GYM_OWNER_CONTACT_NUMBER`,
`STATUS`
)
VALUES
(1,
'The Titans Fitness Studio',
'VVP Nagar, Pondy',
'Arun',
'8489135973',
'ACTIVE'
);


INSERT INTO `titanfitnessstudio`.`user_master`
(`ID`,
`USER_NAME`,
`PASSWORD`,
`GYM_PROFILE_ID`)
VALUES
(1,
'Titan Fitness Studio',
1,
1);





