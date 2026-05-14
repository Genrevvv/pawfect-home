<?php   
    session_start();

    require 'database.php';
    require 'router.php';

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

    $router->add('/user-login', function () use ($db) {
        $data = get_json_input();

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

    $router->add('/admin-page', function () {
        header('Location: /html/admin-page.html');
    });

    $router->add('/get-products', function () use ($db) {
        $data = get_json_input();
        
        echo json_encode(['products' => $db->get_products($data['category'] ?? null)]);
    });

    $router->add('/add-product', function () use ($db) {
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
            'category' => $_POST['category'],
            'pet_type' => $_POST['pet_type'],
            'price' => $_POST['price'],
            'stock' => $_POST['stock'],
            'image' => $path
        ];

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
            'category' => $_POST['category'],
            'pet_type' => $_POST['pet_type'],
            'price' => $_POST['price'],
            'stock' => $_POST['stock'],
            'image' => $path
        ];

        $result = $db->update_product($product_data);
        if ($result == 0) {
            echo json_encode(['error' => 'Unable to update a product']);
            exit();
        }
        
        echo json_encode(['success' => true, 'product_data' => $product_data]);
    });

    $router->dispatch($path);

    // Auxilliary
    function get_json_input() {
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }
?>