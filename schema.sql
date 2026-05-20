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
    description VARCHAR(250) NOT NULL,
    category VARCHAR(100) NOT NULL,
    pet_type VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    image VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_name VARCHAR(100) NOT NULL,
    pet_age VARCHAR(100) NOT NULL,
    pet_sex VARCHAR(100) NOT NULL,
    pet_breed VARCHAR(100) NOT NULL,
    pet_type VARCHAR(100) NOT NULL,
    pet_description VARCHAR(500) NOT NULL,
    image VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS adoption_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email_address VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100) NOT NULL,
    home_address VARCHAR(200) NOT NULL,
    house_type VARCHAR(100) NOT NULL,
    yard_type VARCHAR(100) NOT NULL,
    reason VARCHAR(200) NOT NULL,
    existing_pet VARCHAR(200) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,    -- pending, approved, rejected
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS adopteds (
    application_id INT NOT NULL,
    pet_id INT NOT NULL,
    FOREIGN KEY (application_id) REFERENCES adoption_applications(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id),
    PRIMARY KEY (application_id, pet_id)
);

CREATE TABLE IF NOT EXISTS user_carts (
    user_id INT NOT NULL,
    product_id INT NOT NULL, 
    quantity INT NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS orders_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(200) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_id VARCHAR(100),
    total_price DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL,    -- preparing, to ship, shipped, delivered, cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT NOT NULL, 
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders_log(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);