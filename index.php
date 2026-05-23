<?php   
    session_start();

    require 'database.php';
    require 'router.php';
    require 'validator.php';

    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $router = new Router;
    $db = new Database('pawfect_home.db');

    // Path redirection
    $router->add('/', function () {
        header('Location: index.html');
    });

    $router->add('/login', function () {
        header('Location: /html/login.html');
    });

    $router->add('/register', function () {
        header('Location: /html/register.html');
    });

    $router->add('/adoption-form', function () {
        if (!isLoggedIn()) {
            header('Location: /html/login-required.html');
            return;
        }

        header('Location: /html/adoption-form.html');
    });

    $router->add('/adoption-status', function () {
        if (!isLoggedIn()) {
            header('Location: /html/login-required.html');
            return;
        }

        header('Location: /html/adoption-status.html');
    });

    $router->add('/order-status', function () {
        if (!isLoggedIn()) {
            header('Location: /html/login-required.html');
            return;
        }

        header('Location: /html/order-status.html');
    });

    $router->add('/user-login', function () use ($db) {
        $data = get_json_input();

        $auth = isValidAuthInput($data['username'], $data['password']);
        if (!$auth['valid']) {
            echo json_encode(['error' => $auth['error']]);
            exit();
        }

        $result = $db->verify_user($data['username'], $data['password']);
        if (!$result['success']) {
            echo json_encode($result);
            exit();
        }

        $result = $db->get_user($data['username']);

        $_SESSION['username'] = $result['username'];
        $_SESSION['user_id'] = $result['id'];
        $_SESSION['user_type'] = $result['user_type'];
        
        echo json_encode([
            'success' => true,
            'username' => $data['username'],
            'user_type' => $result['user_type']
        ]);
    });

    $router->add('/user-logout', function () {
        session_unset();

        echo json_encode(['success' => true, 'message' => 'logout successful']);
    });

    $router->add('/user-register', function () use ($db) {
        $data = get_json_input();

        $auth = isValidAuthInput($data['username'], $data['password']);
        if (!$auth['valid']) {
            echo json_encode(['error' => $auth['error']]);
            exit();
        }

        $result = $db->get_user($data['username']);
        if ($result != false) {
            echo json_encode(['error' => 'Username already exist']);
            exit();
        }
        
        $result = $db->insert_user($data['username'], $data['password'], $data['confirm']);
        if (is_array($result) && isset($result['error'])) {
            echo json_encode($result);
            exit();    
        }

        echo json_encode(['success' => true]);
    });

    $router->add('/delete-account', function () use ($db) {                
        $result = $db->delete_user($_SESSION['user_id']);

        if ($result == 0) {
            echo json_encode(['error' => 'Unable to delete user']);
            exit();
        }

        session_unset();

        echo json_encode(['success' => true, 'message' => 'Account deletion successful']);
    });

    $router->add('/admin-page', function () {
        if ($_SESSION['user_type'] != 'admin') {
            header('Location: /html/401.html');
            return;
        }

        header('Location: /html/admin-page.html');
    });

    $router->add('/get-featured', function () use ($db) {
        echo json_encode($db->get_featured());
    });

    $router->add('/get-products', function () use ($db) {
        $data = get_json_input();
        
        echo json_encode(['products' => $db->get_products($data['category'] ?? null)]);
    });

    $router->add('/add-product', function () use ($db) {
        if (!isset($_FILES['image'])) {
            echo json_encode(['error' => 'Please upload an image']);
            exit();
        }
        
        $file = $_FILES['image'];
        
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if ($file["error"] !== 0) {
            echo json_encode(['error' => 'File upload was unsuccessful']);
            exit();
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = uniqid('prod_', true) . '.' . $extension;
        $path = $uploadDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $path)) {
            echo json_encode(['error' => 'File save was unsucessful']);
            exit();
        }

        $product_data = [
            'product_name' => $_POST['product_name'],
            'description' => $_POST['description'],
            'category' => $_POST['category'],
            'pet_type' => $_POST['pet_type'],
            'price' => $_POST['price'],
            'stock' => $_POST['stock'],
            'image' => $path
        ];

        $product_validation = isValidProduct($product_data);
        if (!$product_validation['valid']) {
            echo json_encode(['error' => $product_validation['valid']]);
            exit();
        }

        $result = $db->add_product($product_data);
        if ($result['changes'] == 0) {
            echo json_encode(['error' => 'Unable to add a product']);
            exit();
        }

        $product_data['id'] = $result['id'];
        
        echo json_encode(['success' => true, 'product_data' => $product_data]);
    });

    $router->add('/delete-product', function () use ($db) {
        $data = get_json_input();

        $result = $db->delete_product($data['product_id']);
        if ($result == 0) {
            echo json_encode(['success' => false]);
            exit();
        }

        echo json_encode(['success' => true]);
    });

    $router->add('/update-product', function () use ($db) {
        if (isset($_FILES['image'])) {
            $file = $_FILES['image'];

            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            if ($file["error"] !== 0) {
                echo json_encode(['error' => 'File upload was unsuccessful']);
                exit();
            }

            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = uniqid('prod_', true) . '.' . $extension;
            $path = $uploadDir . $fileName;

            if (!move_uploaded_file($file['tmp_name'], $path)) {
                echo json_encode(['error' => 'File save was unsucessful']);
                exit();
            }
        }
        else {
            $path = $_POST['image'];
        }
        
        $product_data = [
            'product_id' => $_POST['product_id'],
            'product_name' => $_POST['product_name'],
            'description' => $_POST['description'],
            'category' => $_POST['category'],
            'pet_type' => $_POST['pet_type'],
            'price' => $_POST['price'],
            'stock' => $_POST['stock'],
            'image' => $path
        ];

        if (!isValidProduct($product_data)) {
            echo json_encode(['error' => 'Please fill up all fields']);
            exit();
        }

        $result = $db->update_product($product_data);
        if ($result == 0) {
            echo json_encode(['error' => 'Unable to update a product']);
            exit();
        }
        
        echo json_encode(['success' => true, 'product_data' => $product_data]);
    });

    $router->add('/get-pets', function () use ($db) {
        $data = get_json_input();
        
        echo json_encode(['pets' => $db->get_pets()]);
    });

    $router->add('/add-pet', function () use ($db) {
        if (!isset($_FILES['image'])) {
            echo json_encode(['error' => 'Please upload an image']);
            exit();
        }
        
        $file = $_FILES['image'];

        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if ($file["error"] !== 0) {
            echo json_encode(['error' => 'File upload was unsuccessful']);
            exit();
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = uniqid('pet_', true) . '.' . $extension;
        $path = $uploadDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $path)) {
            echo json_encode(['error' => 'File save was unsucessful']);
            exit();
        }

        $pet_data = [
            'pet_name' => $_POST['pet_name'],
            'pet_age' => $_POST['pet_age'],
            'pet_sex' => $_POST['pet_sex'],
            'pet_breed' => $_POST['pet_breed'],
            'pet_type' => $_POST['pet_type'],
            'pet_description' => $_POST['pet_description'],
            'image' => $path
        ];

        if (!isValidPet($pet_data)) {
            echo json_encode(['error' => 'Please fill up all fields']);
            exit();
        }

        $result = $db->add_pet($pet_data);
        if ($result['changes'] == 0) {
            echo json_encode(['error' => 'Unable to add a pet']);
            exit();
        }

        $pet_data['id'] = $result['id'];
        
        echo json_encode(['success' => true, 'pet_data' => $pet_data]);
    });

    $router->add('/delete-pet', function () use ($db) {
        $data = get_json_input();

        $result = $db->delete_pet($data['pet_id']);
        if ($result == 0) {
            echo json_encode(['success' => false]);
            exit();
        }

        echo json_encode(['success' => true]);
    });

    $router->add('/update-pet', function () use ($db) {
        if (isset($_FILES['image'])) {
            $file = $_FILES['image'];

            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            if ($file["error"] !== 0) {
                echo json_encode(['error' => 'File upload was unsuccessful']);
                exit();
            }

            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = uniqid('pet_', true) . '.' . $extension;
            $path = $uploadDir . $fileName;

            if (!move_uploaded_file($file['tmp_name'], $path)) {
                echo json_encode(['error' => 'File save was unsucessful']);
                exit();
            }
        }
        else {
            $path = $_POST['image'];
        }
        
        $pet_data = [
            'pet_id' => $_POST['pet_id'],
            'pet_name' => $_POST['pet_name'],
            'pet_age' => $_POST['pet_age'],
            'pet_sex' => $_POST['pet_sex'],
            'pet_breed' => $_POST['pet_breed'],
            'pet_type' => $_POST['pet_type'],
            'pet_description' => $_POST['pet_description'],
            'image' => $path
        ];

        if (!isValidPet($pet_data)) {
            echo json_encode(['error' => 'Please fill up all fields']);
            exit();
        }

        $result = $db->update_pet($pet_data);
        if ($result == 0) {
            echo json_encode(['error' => 'Unable to update a pet']);
            exit();
        }
        
        echo json_encode(['success' => true, 'pet_data' => $pet_data]);
    });

    $router->add('/submit-adoption-application', function () use ($db) {
        $data = get_json_input();
        $data['user_id'] = $_SESSION['user_id'];

        if (!isValidApplication($data)) {
            echo json_encode(['success' => false, 'error' => 'Invalid form data']);
            exit();
        }

        $result = $db->setup_adoption_application($data);

        echo json_encode(['success' => true, 'application_id' => $result]);
    });

    $router->add('/get-all-adoption-applications', function () use ($db) {
        echo json_encode($db->get_adoption_applications());
    });

    $router->add('/get-adoption-applications', function () use ($db) {
        echo json_encode($db->get_adoption_applications($_SESSION['user_id']));
    });

    $router->add('/approve-adoption-application', function () use ($db) {
        $data = get_json_input();

        $result = $db->update_adoption_application('approved', $data['application_id']);

        if ($result == 0) {
            echo json_encode(['error' => 'Unable to udpate application status']);
            return;
        }

        echo json_encode(['success' => true]);
    });

    $router->add('/reject-adoption-application', function () use ($db) {
        $data = get_json_input();
    
        $result = $db->update_adoption_application('rejected', $data['application_id']);

        if ($result == 0) {
            echo json_encode(['error' => 'Unable to udpate application status']);
            return;
        }
        
        echo json_encode(['success' => true]);
    });

    $router->add('/save-user-cart', function () use ($db) {
        if (!isLoggedIn()) {
            exit();
        }

        $data = get_json_input();
        $db->save_user_cart($data, $_SESSION['user_id']);

        echo json_encode(['success' => true]);
    });

    $router->add('/get-user-cart', function () use ($db) {
        echo json_encode($db->get_user_cart($_SESSION['user_id']));
    });

    $router->add('/place-order', function () use ($db) {
        if (!isLoggedIn()) { 
            header('Location: /html/login-required.html');
            return; 
        }

        $data = get_json_input();

        $name = trim($data['name'] ?? '');
        $address = trim($data['address'] ?? '');
        $payment_method = $data['payment_method'] ?? null;
        $payment_id = $data['payment_id'] ?? null;

        if ($name == '' || $address == '') {
            echo json_encode(['success' => false, 'error' => 'Empty details field']);
            exit();
        }

        if ($payment_method != 'cod' && empty($payment_id)) {
            echo json_encode(['success' => false, 'error' => 'Empty payment ID']);
            exit();
        }

        if ($payment_method == 'gcash' || $payment_method == 'maya') {
            if (!isValidPhoneNumber($payment_id)) {
                echo json_encode(['success' => false, 'error' => 'Invalid phone number']);
                exit();
            }
        }
        else if ($payment_method == 'card') {
            if (!isValidCard($payment_id)) {
                echo json_encode(['success' => false, 'error' => 'Invalid card number']);
                exit();
            }
        }

        $data['user_id'] = $_SESSION['user_id'];
        echo json_encode($db->place_order($data));
    });

    $router->add('/get-all-orders', function () use ($db) {
        echo json_encode($db->get_orders());
    });

    $router->add('/get-user-order', function () use ($db) {
        echo json_encode($db->get_orders($_SESSION['user_id']));
    });

    $router->add('/update-order-status', function () use ($db) {
        $data = get_json_input();
        echo json_encode([$db->update_order_status($data['order_id'], $data['status'])]);
    });

    $router->add('/cancel-order', function () use ($db) {
        $data = get_json_input();
        echo json_encode([$db->update_order_status($data['order_id'], 'cancelled')]);
    });

    $router->add('/fetch-overview-data', function () use ($db) {
        echo json_encode($db->get_overview_data());
    });

    $router->add('/fetch-all-data', function () use ($db) {
        echo json_encode($db->get_all_data());
    });

    $router->dispatch($path);

    // Auxilliary
    function get_json_input() {
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }

    function isLoggedIn() {
        if (isset($_SESSION['user_id'])) {
            return true;
        }

        return false;
    }
?>
