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

    $router->dispatch($path);

    // Auxilliary
    function get_json_input() {
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }
?>