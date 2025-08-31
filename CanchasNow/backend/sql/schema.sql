CREATE DATABASE IF NOT EXISTS CanchasNow;
USE CanchasNow;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Encrypted password
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('user', 'owner', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Owners table
CREATE TABLE owners (
    owner_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(100), -- Business name (e.g., "Field El Golazo")
    address VARCHAR(200),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Field types table (synthetic_type separated from fields)
CREATE TABLE field_types (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- Example: football-7, football-11, other
);

-- Fields table
CREATE TABLE fields (
    field_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    type_id INT NOT NULL, -- Reference to field_types
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(200),
    price_per_hour DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id),
    FOREIGN KEY (type_id) REFERENCES field_types(type_id)
);

-- Schedules table
CREATE TABLE schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (field_id) REFERENCES fields(field_id)
);

-- Reservations table (price removed)
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    field_id INT NOT NULL,
    schedule_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (field_id) REFERENCES fields(field_id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
);

-- Sales table (new, linked to reservations)
CREATE TABLE sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('cash', 'card', 'transfer') DEFAULT 'cash',
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);