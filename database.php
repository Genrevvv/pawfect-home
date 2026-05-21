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

        public function get_featured() {
            $stmt = $this->db->prepare('                
                SELECT p.*
                FROM pets p
                WHERE p.id NOT IN (
                    SELECT a.pet_id
                    FROM adopteds a
                    JOIN adoption_applications ap
                        ON ap.id = a.application_id
                    WHERE ap.status = "approved"
                )
                AND p.pet_type = "dog"
                LIMIT 5
            ');
            $stmt->execute();
            $featured_dogs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $this->db->prepare('
                SELECT p.*
                FROM pets p
                WHERE p.id NOT IN (
                    SELECT a.pet_id
                    FROM adopteds a
                    JOIN adoption_applications ap
                        ON ap.id = a.application_id
                    WHERE ap.status = "approved"
                )
                AND p.pet_type = "cat"
                LIMIT 5
            ');
            $stmt->execute();
            $featured_cats = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $this->db->prepare('SELECT * FROM products LIMIT 5');
            $stmt->execute();
            $featured_products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'featured_dogs' => $featured_dogs,
                'featured_cats' => $featured_cats,
                'featured_products' => $featured_products
            ];
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
                VALUES (null, :product_name, :description, :category, :pet_type, :price, :stock, :image)
            ');
            
            $stmt->execute([
                'product_name' => $product_data['product_name'],
                'description' => $product_data['description'],
                'category' => $product_data['category'],
                'pet_type' => $product_data['pet_type'],
                'price' => $product_data['price'],
                'stock' => $product_data['stock'],
                'image' => $product_data['image']
            ]);

            return ['changes' => $stmt->rowCount(), 'id' => $this->db->lastInsertId()];
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
                    description = :description,
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
                'description' => $product_data['description'],
                'category' => $product_data['category'],
                'pet_type' => $product_data['pet_type'],
                'price' => $product_data['price'],
                'stock' => $product_data['stock'],
                'image' => $product_data['image'],
            ]);

            return $stmt->rowCount();
        }

        public function get_pets() {
            $stmt = $this->db->prepare('
                SELECT p.*
                    FROM pets p
                    WHERE p.id NOT IN (
                        SELECT a.pet_id
                        FROM adopteds a
                        JOIN adoption_applications ap
                            ON ap.id = a.application_id
                        WHERE ap.status = "approved"
                    );
            ');
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function add_pet($pet_data) {
            $stmt = $this->db->prepare('
                INSERT INTO pets (pet_name, pet_age, pet_sex, pet_breed, pet_type, pet_description, image)
                VALUES (:pet_name, :pet_age, :pet_sex, :pet_breed, :pet_type, :pet_description, :image)
            ');
            
            $stmt->execute([
                'pet_name' => $pet_data['pet_name'],
                'pet_age' => $pet_data['pet_age'],
                'pet_sex' => $pet_data['pet_sex'],
                'pet_breed' => $pet_data['pet_breed'],
                'pet_type' => $pet_data['pet_type'],
                'pet_description' => $pet_data['pet_description'],
                'image' => $pet_data['image']
            ]);

            return ['changes' => $stmt->rowCount(), 'id' => $this->db->lastInsertId()];
        }

        public function delete_pet($pet_id) {
            $stmt = $this->db->prepare('DELETE FROM pets WHERE id = :pet_id');
            $stmt->execute(['pet_id' => $pet_id]);

            return $stmt->rowCount();
        }

        public function update_pet($pet_data) {
            $stmt = $this->db->prepare('
                UPDATE pets SET 
                    pet_name = :pet_name, 
                    pet_age = :pet_age,
                    pet_sex = :pet_sex,
                    pet_breed = :pet_breed,
                    pet_type = :pet_type,
                    pet_description = :pet_description,
                    image = :image
                WHERE id = :pet_id
            ');

            $stmt->execute([
                'pet_id' => $pet_data['pet_id'],
                'pet_name' => $pet_data['pet_name'],
                'pet_age' => $pet_data['pet_age'],
                'pet_sex' => $pet_data['pet_sex'],
                'pet_breed' => $pet_data['pet_breed'],
                'pet_type' => $pet_data['pet_type'],
                'pet_description' => $pet_data['pet_description'],
                'image' => $pet_data['image'],
            ]);

            return $stmt->rowCount();
        }

        public function setup_adoption_application($form_data) {
            $stmt = $this->db->prepare('
                INSERT INTO adoption_applications 
                (user_id, full_name, email_address, phone_number, home_address, house_type, yard_type, reason, existing_pet, status)
                VALUES 
                (:user_id, :full_name, :email_address, :phone_number, :home_address, :house_type, :yard_type, :reason, :existing_pet, :status)
            ');

            $stmt->execute([
                'user_id' => $form_data['user_id'],
                'full_name' => $form_data['full_name'],
                'email_address' => $form_data['email_address'],
                'phone_number' => $form_data['phone_number'],
                'home_address' => $form_data['home_address'],
                'house_type' => $form_data['house_type'],
                'yard_type' => $form_data['yard_type'],
                'reason' => $form_data['reason'],
                'existing_pet' => $form_data['existing_pet'],
                'status' => 'pending'
            ]);

            $application_id = $this->db->lastInsertId();

            $stmt = $this->db->prepare('
                INSERT INTO adopteds (application_id, pet_id)
                VALUES (:application_id, :pet_id)
            ');

            foreach ($form_data['selected_pets'] as $pet_id) {
                $stmt->execute([
                    'application_id' => $application_id,
                    'pet_id' => $pet_id
                ]);
            }

            return $application_id;
        }

        public function get_adoption_applications($user_id = null) {
            $sql = '
                SELECT 
                    aa.id AS application_id,
                    aa.user_id,
                    aa.full_name,
                    aa.email_address,
                    aa.phone_number,
                    aa.home_address,
                    aa.house_type,
                    aa.yard_type,
                    aa.reason,
                    aa.existing_pet,
                    aa.status,

                    u.username,
                    u.user_type,

                    p.id AS pet_id,
                    p.pet_name,
                    p.pet_age,
                    p.pet_sex,
                    p.pet_breed,
                    p.pet_type,
                    p.pet_description,
                    p.image AS pet_image

                FROM adoption_applications aa
                JOIN users u ON aa.user_id = u.id
                JOIN adopteds a ON aa.id = a.application_id
                JOIN pets p ON a.pet_id = p.id
            ';

            if (!empty($user_id)) {
                $sql .= ' WHERE u.id = :user_id';
                $stmt = $this->db->prepare($sql);
                $stmt->execute(['user_id' => $user_id]);
            } else {
                $stmt = $this->db->prepare($sql);
                $stmt->execute();
            }

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $applications = [];

            foreach ($rows as $row) {
                $appId = $row['application_id'];

                if (!isset($applications[$appId])) {
                    $applications[$appId] = [
                        'user' => [
                            'id' => $row['user_id'],
                            'username' => $row['username'],
                            'user_type' => $row['user_type']
                        ],
                        'adoption_application' => [
                            'id' => $row['application_id'],
                            'full_name' => $row['full_name'],
                            'email_address' => $row['email_address'],
                            'phone_number' => $row['phone_number'],
                            'home_address' => $row['home_address'],
                            'house_type' => $row['house_type'],
                            'yard_type' => $row['yard_type'],
                            'reason' => $row['reason'],
                            'existing_pet' => $row['existing_pet'],
                            'status' => $row['status']
                        ],
                        'pets' => []
                    ];
                }

                $applications[$appId]['pets'][] = [
                    'id' => $row['pet_id'],
                    'pet_name' => $row['pet_name'],
                    'pet_age' => $row['pet_age'],
                    'pet_sex' => $row['pet_sex'],
                    'pet_breed' => $row['pet_breed'],
                    'pet_type' => $row['pet_type'],
                    'pet_description' => $row['pet_description'],
                    'image' => $row['pet_image']
                ];
            }

            return $applications;
        }

        public function update_adoption_application($status, $application_id) {
            $stmt = $this->db->prepare('
                UPDATE adoption_applications
                SET status = :status
                WHERE id = :id
            ');

            $stmt->execute([
                'status' => $status,
                'id' => $application_id
            ]);

            return $stmt->rowCount();
        }

        public function save_user_cart($user_cart, $user_id) {
            $inserStmt = $this->db->prepare('
                INSERT INTO user_carts (user_id, product_id, quantity)
                VALUES (:user_id, :product_id, :quantity)
                ON DUPLICATE KEY UPDATE
                quantity = VALUES(quantity)
            ');

            $deleteStmt = $this->db->prepare('
                DELETE FROM user_carts
                WHERE user_id = :user_id
                AND product_id = :product_id
            ');
        
            foreach ($user_cart as $item) {
                if ($item['quantity'] == 0) {
                    $deleteStmt->execute([
                        'user_id' => $user_id,
                        'product_id' => $item['product_id']
                    ]);
                }
                else {
                    $inserStmt->execute([
                        'user_id' => $user_id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity']
                    ]);
                }
            }

            return;
        }

        public function get_user_cart($user_id) {
            $stmt = $this->db->prepare('
                SELECT 
                    p.id,
                    p.product_name,
                    p.description,
                    p.category,
                    p.pet_type,
                    p.price,
                    p.stock,
                    p.image,
                    uc.quantity
                FROM user_carts uc
                JOIN products p ON uc.product_id = p.id
                WHERE uc.user_id = :user_id;
            ');

            $stmt->execute(['user_id' => $user_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function get_orders($user_id = null) {
            $sql = '
                SELECT 
                    ol.id AS order_id,
                    ol.user_id,
                    ol.name,
                    ol.address,
                    ol.payment_method,
                    ol.payment_id,
                    ol.total_price,
                    ol.status,
                    ol.created_at,

                    p.id AS product_id,
                    p.product_name,
                    p.description,
                    p.category,
                    p.pet_type,
                    p.price,
                    p.image,

                    o.quantity

                FROM orders_log ol
                JOIN orders o ON ol.id = o.order_id
                JOIN products p ON o.product_id = p.id
            ';

            if (!empty($user_id)) {
                $sql .= ' WHERE ol.user_id = :user_id';
                $stmt = $this->db->prepare($sql);
                $stmt->execute(['user_id' => $user_id]);
            } else {
                $stmt = $this->db->prepare($sql);
                $stmt->execute();
            }

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $orders = [];

            foreach ($rows as $row) {
                $orderId = $row['order_id'];

                if (!isset($orders[$orderId])) {
                    $orders[$orderId] = [
                        'order' => [
                            'id' => $row['order_id'],
                            'user_id' => $row['user_id'],
                            'name' => $row['name'],
                            'address' => $row['address'],
                            'payment_method' => $row['payment_method'],
                            'payment_id' => $row['payment_id'],
                            'total_price' => $row['total_price'],
                            'status' => $row['status'],
                            'created_at' => $row['created_at'],
                        ],
                        'products' => []
                    ];
                }

                $orders[$orderId]['products'][] = [
                    'id' => $row['product_id'],
                    'product_name' => $row['product_name'],
                    'description' => $row['description'],
                    'category' => $row['category'],
                    'pet_type' => $row['pet_type'],
                    'price' => $row['price'],
                    'image' => $row['image'],
                    'quantity' => $row['quantity']
                ];
            }

            return $orders;
        }

        public function place_order($order_data) {  
            try {
                $this->db->beginTransaction();

                $orders_log_stmt = $this->db->prepare('
                    INSERT INTO orders_log 
                    (user_id, name, address, payment_method, payment_id, total_price, status)
                    VALUES 
                    (:user_id, :name, :address, :payment_method, :payment_id, :total_price, :status)
                ');

                $orders_log_stmt->execute([
                    'user_id' => $order_data['user_id'],
                    'name' => $order_data['name'],
                    'address' => $order_data['address'],
                    'payment_method' => $order_data['payment_method'],
                    'payment_id' => $order_data['payment_id'],
                    'total_price' => $order_data['total_price'],
                    'status' => 'pending'
                ]);

                $order_id = $this->db->lastInsertId();

                $orders_stmt= $this->db->prepare('
                    INSERT INTO orders (order_id, product_id, quantity)
                    VALUES (:order_id, :product_id, :quantity)
                ');

                $stock_stmt = $this->db->prepare('
                    UPDATE products
                    SET stock = stock - :quantity
                    WHERE id = :product_id 
                    AND stock >= :quantity
                ');

                foreach ($order_data['cart'] as $item) {
                    $orders_stmt->execute([
                        'order_id' => $order_id,
                        'product_id' => $item['id'],
                        'quantity' => $item['quantity']
                    ]);

                    $stock_stmt->execute([
                        'product_id' => $item['id'],
                        'quantity' => $item['quantity']
                    ]);

                    if ($stock_stmt->rowCount() === 0) {
                        throw new Exception("Purchase failed. Insufficient stock for " . $item['product_name']);
                    }
                }

                $this->clear_user_cart($order_data['user_id']);

                $this->db->commit();

                return [
                    'success' => true,
                    'order_id' => $order_id
                ];

            } 
            catch (Exception $e) {
                $this->db->rollBack();
                return [
                    'success' => false,
                    'error' => $e->getMessage()
                ];
            }
        }

        public function clear_user_cart($user_id) {
            $stmt = $this->db->prepare('DELETE FROM user_carts WHERE user_id = :user_id');
            $stmt->execute(['user_id' => $user_id]);
        }

        public function update_order_status($order_id, $status) {
            $stmt = $this->db->prepare('
                UPDATE orders_log 
                SET status = :status
                WHERE id = :order_id
            ');

            $stmt->execute([
                'order_id' => $order_id,
                'status' => $status
            ]);

            return $stmt->rowCount();
        }

        public function get_overview_data() {
            $stmt1 = $this->db->prepare('
                SELECT 
                    YEARWEEK(created_at, 1) AS week,
                    COUNT(*) AS total_orders,
                    SUM(total_price) AS weekly_sales
                FROM orders_log
                GROUP BY YEARWEEK(created_at, 1)
                ORDER BY week DESC
            ');

            $stmt2 = $this->db->prepare('
                SELECT 
                    DATE_FORMAT(created_at, "%Y-%u") AS week,
                    COUNT(*) AS pending_applications
                FROM adoption_applications
                WHERE status = "pending"
                GROUP BY week
                ORDER BY week DESC
            ');

            $stmt3 = $this->db->prepare('
                SELECT 
                    p.id,
                    p.product_name,
                    SUM(o.quantity) AS total_sold
                FROM orders o
                JOIN products p ON p.id = o.product_id
                GROUP BY o.product_id
                ORDER BY total_sold DESC
                LIMIT 5;
            ');

            $stmt1->execute();
            $stmt2->execute();
            $stmt3->execute();

            $orders = $stmt1->fetchAll(PDO::FETCH_ASSOC);
            $applications = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            $top_products = $stmt3->fetchAll(PDO::FETCH_ASSOC);

            $weekly_sales = array_sum(array_column($orders, 'weekly_sales'));
            $total_orders = array_sum(array_column($orders, 'total_orders'));
            $pending_applications = array_sum(array_column($applications, 'pending_applications'));

            return [
                'weekly_sales' => $weekly_sales,
                'total_orders' => $total_orders,
                'pending_applications' => $pending_applications,
                'top_products' => $top_products
            ];
        }

        public function get_all_data() {
            $stmt1 = $this->db->prepare('SELECT * FROM pets');
            $stmt1->execute();
            $pets = $stmt1->fetchAll(PDO::FETCH_ASSOC);

            $stmt2 = $this->db->prepare('SELECT * FROM products');
            $stmt2->execute();
            $products = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            return [
                'pets' => $pets,
                'products' => $products
            ];
        }

    }
?>