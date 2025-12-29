<?php
// NPlusOne Fashion - Authentication API (Shared Hosting Compatible)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

// Simple file-based user storage (in production, use a proper database)
$users_file = '../data/users.json';

// Ensure data directory exists
if (!file_exists('../data')) {
    mkdir('../data', 0755, true);
}

// Initialize users file if it doesn't exist
if (!file_exists($users_file)) {
    file_put_contents($users_file, json_encode([]));
}

function loadUsers() {
    global $users_file;
    $content = file_get_contents($users_file);
    return json_decode($content, true) ?: [];
}

function saveUsers($users) {
    global $users_file;
    file_put_contents($users_file, json_encode($users, JSON_PRETTY_PRINT));
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function generateToken() {
    return bin2hex(random_bytes(32));
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$action = $input['action'];

try {
    switch ($action) {
        case 'register':
            $name = trim($input['name'] ?? '');
            $email = trim($input['email'] ?? '');
            $password = $input['password'] ?? '';
            
            // Validation
            if (empty($name) || empty($email) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'All fields are required']);
                exit;
            }
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Invalid email format']);
                exit;
            }
            
            if (strlen($password) < 6) {
                echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
                exit;
            }
            
            $users = loadUsers();
            
            // Check if user already exists
            foreach ($users as $user) {
                if ($user['email'] === $email) {
                    echo json_encode(['success' => false, 'message' => 'Email already registered']);
                    exit;
                }
            }
            
            // Create new user
            $newUser = [
                'id' => count($users) + 1,
                'name' => $name,
                'email' => $email,
                'password' => hashPassword($password),
                'created_at' => date('Y-m-d H:i:s')
            ];
            
            $users[] = $newUser;
            saveUsers($users);
            
            echo json_encode(['success' => true, 'message' => 'Account created successfully']);
            break;
            
        case 'login':
            $email = trim($input['email'] ?? '');
            $password = $input['password'] ?? '';
            
            if (empty($email) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Email and password are required']);
                exit;
            }
            
            $users = loadUsers();
            
            // Find user
            $user = null;
            foreach ($users as $u) {
                if ($u['email'] === $email) {
                    $user = $u;
                    break;
                }
            }
            
            if (!$user || !verifyPassword($password, $user['password'])) {
                echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
                exit;
            }
            
            // Create session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['login_time'] = time();
            
            echo json_encode([
                'success' => true, 
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ]
            ]);
            break;
            
        case 'logout':
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
            break;
            
        case 'check':
            if (isset($_SESSION['user_id'])) {
                echo json_encode([
                    'success' => true,
                    'logged_in' => true,
                    'user' => [
                        'id' => $_SESSION['user_id'],
                        'name' => $_SESSION['user_name'],
                        'email' => $_SESSION['user_email']
                    ]
                ]);
            } else {
                echo json_encode(['success' => true, 'logged_in' => false]);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>