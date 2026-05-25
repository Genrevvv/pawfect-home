DROP DATABASE IF EXISTS pawfect_home;

CREATE DATABASE pawfect_home;
USE pawfect_home;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) CHECK (user_type IN ('user', 'admin'))
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    category VARCHAR(100) NOT NULL,
    pet_type VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    image VARCHAR(250)
);

CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_name VARCHAR(100) NOT NULL,
    pet_age VARCHAR(100) NOT NULL,
    pet_sex VARCHAR(100) NOT NULL,
    pet_breed VARCHAR(100) NOT NULL,
    pet_type VARCHAR(100) NOT NULL,
    pet_description VARCHAR(500) NOT NULL,
    image VARCHAR(250)
);

CREATE TABLE adoption_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    full_name VARCHAR(100) NOT NULL,
    email_address VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100) NOT NULL,
    home_address VARCHAR(200) NOT NULL,
    house_type VARCHAR(100) NOT NULL,
    yard_type VARCHAR(100) NOT NULL,
    reason VARCHAR(200) NOT NULL,
    existing_pet VARCHAR(200) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE adopteds (
    application_id INT NOT NULL,
    pet_id INT NOT NULL,
    PRIMARY KEY (application_id, pet_id),
    FOREIGN KEY (application_id) REFERENCES adoption_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE TABLE user_carts (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(200) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_id VARCHAR(100),
    total_price DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE orders (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders_log(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);