CREATE DATABASE IF NOT EXISTS turfbook;
USE turfbook;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS pricing_rules;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS category_admin_invites;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

SET FOREIGN_KEY_CHECKS = 1;


-- =========================================================
-- CATEGORIES
-- =========================================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) NOT NULL
);


-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    role ENUM('admin', 'customer') NOT NULL,
    category_id INT NULL,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
);


-- =========================================================
-- CATEGORY ADMIN INVITE CODES
-- =========================================================

CREATE TABLE category_admin_invites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL UNIQUE,
    invite_code VARCHAR(255) NOT NULL UNIQUE,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
);


-- =========================================================
-- FACILITIES
-- =========================================================

CREATE TABLE facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    base_rate DECIMAL(10,2) NOT NULL,

    pricing_unit ENUM(
        'hour',
        'day',
        'night',
        'session',
        'event',
        'person',
        'item'
    ) NOT NULL,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
);


-- =========================================================
-- PRICING RULES
-- =========================================================

CREATE TABLE pricing_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,

    category_id INT NULL,
    facility_id INT NULL,

    rule_type ENUM(
        'peak',
        'weekend',
        'discount',
        'tax'
    ) NOT NULL,

    value DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (category_id)
        REFERENCES categories(id),

    FOREIGN KEY (facility_id)
        REFERENCES facilities(id)
);


-- =========================================================
-- BOOKINGS
-- =========================================================

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    facility_id INT NOT NULL,

    booking_date DATE NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,

    quantity INT NOT NULL DEFAULT 1,

    amount DECIMAL(10,2) NOT NULL,

    status ENUM('Booked', 'Cancelled')
        DEFAULT 'Booked',

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (facility_id)
        REFERENCES facilities(id)
);


-- =========================================================
-- INSERT THE 9 CATEGORIES
-- =========================================================

INSERT INTO categories
    (name, description, icon)
VALUES
(
    'Academic',
    'Classrooms, laboratories and libraries',
    'school'
),
(
    'Sports & Fitness',
    'Sports turfs, gym and swimming pool',
    'fitness_center'
),
(
    'Events & Conference',
    'Auditoriums, conference halls and seminar halls',
    'event'
),
(
    'Technology & Innovation',
    'Computer labs, innovation centres and maker spaces',
    'computer'
),
(
    'Food & Dining',
    'Cafeterias, canteens and food courts',
    'restaurant'
),
(
    'Accommodation',
    'Hostels, dormitories and guest houses',
    'hotel'
),
(
    'Health & Wellness',
    'Medical centres, counselling and first-aid facilities',
    'health_and_safety'
),
(
    'Recreation & Culture',
    'Student clubs, music rooms, art spaces and recreation areas',
    'palette'
),
(
    'Transport & Infrastructure',
    'Parking, campus buses, EV charging and utilities',
    'directions_bus'
);


-- =========================================================
-- CATEGORY ADMIN INVITE CODES
-- =========================================================
-- These are development/demo codes.
-- We will move these to environment variables later.

INSERT INTO category_admin_invites
    (category_id, invite_code)
VALUES
(1, 'ACADEMIC_ADMIN_2026'),
(2, 'SPORTS_ADMIN_2026'),
(3, 'EVENTS_ADMIN_2026'),
(4, 'TECH_ADMIN_2026'),
(5, 'FOOD_ADMIN_2026'),
(6, 'ACCOMMODATION_ADMIN_2026'),
(7, 'HEALTH_ADMIN_2026'),
(8, 'RECREATION_ADMIN_2026'),
(9, 'TRANSPORT_ADMIN_2026');


-- =========================================================
-- SAMPLE ADMIN
-- =========================================================
-- Temporary development admin.
-- Password will be replaced/hashed through the application.

INSERT INTO users
    (username, email, password, contact_number, role, category_id)
VALUES
(
    'academic_admin',
    'academic@firststeps.com',
    'admin123',
    '9999999991',
    'admin',
    1
);


-- =========================================================
-- SAMPLE FACILITIES
-- =========================================================


-- ---------------------------------------------------------
-- 1. ACADEMIC
-- Pricing unit: hour
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    1,
    'Classroom 101',
    'Classroom',
    'Standard academic classroom suitable for lectures and workshops.',
    500.00,
    'hour'
),
(
    1,
    'Computer Laboratory 1',
    'Laboratory',
    'Computer laboratory suitable for academic sessions and practical work.',
    1000.00,
    'hour'
),
(
    1,
    'Central Library Study Room',
    'Library',
    'Quiet study and group discussion room.',
    300.00,
    'hour'
);


-- ---------------------------------------------------------
-- 2. SPORTS & FITNESS
-- Pricing unit: hour
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    2,
    'Football Turf',
    'Sports Turf',
    'Full-size artificial football turf.',
    800.00,
    'hour'
),
(
    2,
    'Fitness Gym',
    'Gym',
    'Fully equipped fitness and training facility.',
    500.00,
    'hour'
),
(
    2,
    'Swimming Pool',
    'Swimming Pool',
    'Swimming and aquatic recreation facility.',
    600.00,
    'hour'
);


-- ---------------------------------------------------------
-- 3. EVENTS & CONFERENCE
-- Pricing unit: event
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    3,
    'Main Auditorium',
    'Auditorium',
    'Large auditorium suitable for conferences and major events.',
    15000.00,
    'event'
),
(
    3,
    'Conference Hall A',
    'Conference Hall',
    'Professional conference and meeting space.',
    10000.00,
    'event'
),
(
    3,
    'Seminar Hall 1',
    'Seminar Hall',
    'Medium-sized hall for seminars and presentations.',
    7500.00,
    'event'
);


-- ---------------------------------------------------------
-- 4. TECHNOLOGY & INNOVATION
-- Pricing unit: hour
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    4,
    'Computer Lab 2',
    'Computer Lab',
    'High-performance computer laboratory.',
    1000.00,
    'hour'
),
(
    4,
    'Innovation Centre',
    'Innovation Centre',
    'Collaborative space for technology and innovation projects.',
    1500.00,
    'hour'
),
(
    4,
    'Maker Space',
    'Maker Space',
    'Hands-on prototyping and fabrication facility.',
    1200.00,
    'hour'
);


-- ---------------------------------------------------------
-- 5. FOOD & DINING
-- Pricing unit: person
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    5,
    'Main Cafeteria',
    'Cafeteria',
    'Large dining area suitable for groups and regular meals.',
    300.00,
    'person'
),
(
    5,
    'Campus Canteen',
    'Canteen',
    'Casual dining and refreshment facility.',
    200.00,
    'person'
),
(
    5,
    'Food Court',
    'Food Court',
    'Multi-vendor food and dining area.',
    400.00,
    'person'
);


-- ---------------------------------------------------------
-- 6. ACCOMMODATION
-- Pricing unit: night
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    6,
    'Guest House Room 101',
    'Guest House',
    'Comfortable guest accommodation.',
    2500.00,
    'night'
),
(
    6,
    'Student Dormitory',
    'Dormitory',
    'Shared accommodation facility.',
    800.00,
    'night'
),
(
    6,
    'Hostel Room 201',
    'Hostel',
    'Student hostel accommodation.',
    1000.00,
    'night'
);


-- ---------------------------------------------------------
-- 7. HEALTH & WELLNESS
-- Pricing unit: session
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    7,
    'Medical Centre',
    'Medical Centre',
    'General medical consultation facility.',
    1000.00,
    'session'
),
(
    7,
    'Counselling Room',
    'Counselling',
    'Private counselling and wellness consultation room.',
    800.00,
    'session'
),
(
    7,
    'First-Aid Facility',
    'First Aid',
    'Facility for basic medical assistance.',
    500.00,
    'session'
);


-- ---------------------------------------------------------
-- 8. RECREATION & CULTURE
-- Pricing unit: hour
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    8,
    'Student Club Room',
    'Student Club',
    'Flexible room for student clubs and activities.',
    400.00,
    'hour'
),
(
    8,
    'Music Room',
    'Music Room',
    'Room equipped for music practice and activities.',
    600.00,
    'hour'
),
(
    8,
    'Art Studio',
    'Art Space',
    'Creative space for art and design activities.',
    500.00,
    'hour'
);


-- ---------------------------------------------------------
-- 9. TRANSPORT & INFRASTRUCTURE
-- Pricing unit: hour
-- ---------------------------------------------------------

INSERT INTO facilities
    (category_id, name, type, description, base_rate, pricing_unit)
VALUES
(
    9,
    'Campus Parking',
    'Parking',
    'Reserved campus parking space.',
    50.00,
    'hour'
),
(
    9,
    'EV Charging Station',
    'EV Charging',
    'Electric vehicle charging facility.',
    200.00,
    'hour'
),
(
    9,
    'Campus Bus',
    'Campus Bus',
    'Campus transportation service.',
    1000.00,
    'hour'
);


-- =========================================================
-- DEFAULT CATEGORY PRICING RULES
-- =========================================================

-- Academic
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(1, 'discount', 10.00),
(1, 'tax', 5.00);


-- Sports & Fitness
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(2, 'peak', 1.50),
(2, 'weekend', 1.20),
(2, 'discount', 10.00),
(2, 'tax', 18.00);


-- Events & Conference
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(3, 'discount', 10.00),
(3, 'tax', 18.00);


-- Technology & Innovation
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(4, 'peak', 1.25),
(4, 'discount', 10.00),
(4, 'tax', 18.00);


-- Food & Dining
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(5, 'discount', 5.00),
(5, 'tax', 5.00);


-- Accommodation
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(6, 'weekend', 1.15),
(6, 'discount', 5.00),
(6, 'tax', 12.00);


-- Health & Wellness
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(7, 'discount', 10.00),
(7, 'tax', 5.00);


-- Recreation & Culture
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(8, 'weekend', 1.20),
(8, 'discount', 10.00),
(8, 'tax', 18.00);


-- Transport & Infrastructure
INSERT INTO pricing_rules
    (category_id, rule_type, value)
VALUES
(9, 'peak', 1.20),
(9, 'discount', 5.00),
(9, 'tax', 18.00);