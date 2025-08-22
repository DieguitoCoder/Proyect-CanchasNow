CREATE DATABASE CanchasYA;
USE CanchasYA;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Encriptada
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('user', 'owner', 'admin') DEFAULT 'user', -- Rol: usuario, dueño o administrador
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE owners (
    owner_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(100), -- Nombre del negocio (ejemplo: "Cancha El Golazo")
    address VARCHAR(200),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE fields (
    field_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(200),
    price_per_hour DECIMAL(10, 2) NOT NULL,
    synthetic_type ENUM('football-7', 'football-11', 'other') DEFAULT 'football-7',
    image_url VARCHAR(255), -- URL de la imagen de la cancha
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id)
);

CREATE TABLE schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL, -- Ejemplo: 08:00
    end_time TIME NOT NULL,   -- Ejemplo: 22:00
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (field_id) REFERENCES fields(field_id)
);

CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    field_id INT NOT NULL,
    schedule_id INT NOT NULL,
    reservation_date DATE NOT NULL, -- Día de la reserva
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (field_id) REFERENCES fields(field_id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
);