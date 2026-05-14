<?php

    class Database {
        private $db = null;

        public function __construct($db_name = 'pawfect_home.db') {
            $config = require 'config.php';

            try {
                $this->db = new PDO(
                    "mysql:host={$config['db_host']};dbname={$config['db_name']}",
                    $config['db_user'],
                    $config['db_pass']
                );

               $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            catch (PDOException $e) {
                echo json_encode(['error' => 'Unable to connect', 'log' => $e->getMessage()]);
                exit();
            }
        }

        public function get_user($username) {
            $stmt = $this->db->prepare('SELECT * FROM users WHERE username = :username');
            $stmt->execute(['username' => $username]);

            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function get_user_id($username) {
            $stmt = $this->db->prepare('SELECT id FROM users WHERE username = :username');
            $stmt->execute(['username' => $username]);

            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function verify_user($username, $password) {
            $result = $this->get_user($username);

            if ($result == false) {
                return ['success' => false, 'error' => 'User not found'];
            }

            $stmt = $this->db->prepare('SELECT password FROM users WHERE username = :username');
            $stmt->execute(['username' => $username]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!password_verify($password, $result['password'])) {
                echo json_encode(['success' => false, 'error' => 'Incorrect password']);
                exit();
            }

            return ['success' => true];
        }

        public function insert_user($username, $password, $confirm) {
            if (!(strlen($username) > 0 && strlen($password) > 0)) {
                return ['error' => 'Empty username or password field'];
            }

            if ($password != $confirm) {
                return ['error' => 'Incorrect cofirmation password'];
            }
            
            $stmt = $this->db->prepare('
                INSERT INTO users (username, password, user_type)
                VALUES (:username, :password, "user")'
            );

            return $stmt->execute([
                'username' => $username, 
                'password' => password_hash($password, PASSWORD_DEFAULT),
            ]);
        }

        public function get_products($category) {
            if (isset($category)) {
                $stmt = $this->db->prepare('SELECT * FROM products WHERE category = :category');
                $stmt->execute(['category' => $category]);

                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }

            $stmt = $this->db->prepare('SELECT * FROM products');
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function add_product($product_data) {
            $stmt = $this->db->prepare('
                INSERT INTO products 
                VALUES (null, :product_name, :category, :pet_type, :price, :stock, :image)
            ');
            
            $stmt->execute([
                'product_name' => $product_data['product_name'],
                'category' => $product_data['category'],
                'pet_type' => $product_data['pet_type'],
                'price' => $product_data['price'],
                'stock' => $product_data['stock'],
                'image' => $product_data['image']
            ]);

            return ['changes' => $stmt->rowCount(), 'product_id' => $this->db->lastInsertId()];
        }

        public function delete_product($product_id) {
            $stmt = $this->db->prepare('DELETE FROM products WHERE id = :product_id');
            $stmt->execute(['product_id' => $product_id]);

            return $stmt->rowCount();
        }

        public function update_product($product_data) {
            $stmt = $this->db->prepare('
                UPDATE products SET 
                    product_name = :product_name, 
                    category = :category,
                    pet_type = :pet_type,
                    price = :price,
                    stock = :stock,
                    image = :image
                WHERE id = :product_id
            ');

            $stmt->execute([
                'product_id' => $product_data['product_id'],
                'product_name' => $product_data['product_name'],
                'category' => $product_data['category'],
                'pet_type' => $product_data['pet_type'],
                'price' => $product_data['price'],
                'stock' => $product_data['stock'],
                'image' => $product_data['image'],
            ]);

            return $stmt->rowCount();
        }
    }
?>