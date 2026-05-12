DROP DATABASE pawfect_home;

CREATE DATABASE IF NOT EXISTS pawfect_home;
USE pawfect_home;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) CHECK (user_type IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    stock INT NOT NULL,
    price DOUBLE(10, 2) NOT NULL
);