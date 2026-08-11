USE turfbook;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS pricing_rules;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS users;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','customer') NOT NULL
);

-- FACILITIES
CREATE TABLE facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    base_rate DECIMAL(10,2) NOT NULL,
    slot_duration INT NOT NULL
);

-- PRICING RULES
CREATE TABLE pricing_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facility_id INT NOT NULL,
    rule_type ENUM('peak','weekend','discount','tax') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- BOOKINGS
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    facility_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('Booked','Cancelled') DEFAULT 'Booked',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- SAMPLE ADMIN
INSERT INTO users
(username, email, contact_number, password, role)
VALUES
('admin', 'admin@turfbook.com', '9999999999', 'admin123', 'admin');

-- SAMPLE FACILITIES
INSERT INTO facilities (name, type, base_rate, slot_duration) VALUES
('Turf 1', 'Football', 800, 60),
('Badminton Court A', 'Badminton', 300, 60),
('Box Cricket Net', 'Cricket', 500, 60);

-- SAMPLE PRICING RULES

-- Turf 1
INSERT INTO pricing_rules (facility_id, rule_type, value) VALUES
(1, 'peak', 1.50),
(1, 'weekend', 1.20),
(1, 'discount', 10),
(1, 'tax', 18);

-- Badminton Court A
INSERT INTO pricing_rules (facility_id, rule_type, value) VALUES
(2, 'peak', 1.30),
(2, 'weekend', 1.15),
(2, 'discount', 5),
(2, 'tax', 18);

-- Box Cricket Net
INSERT INTO pricing_rules (facility_id, rule_type, value) VALUES
(3, 'peak', 1.40),
(3, 'weekend', 1.25),
(3, 'discount', 8),
(3, 'tax', 18);