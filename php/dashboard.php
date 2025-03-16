<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_data";

// Enable error reporting for debugging
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['success' => false, 'message' => 'User not logged in.']));
}

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"), true);
$client_ip = isset($data['ip']) ? filter_var($data['ip'], FILTER_VALIDATE_IP) : null;

$ipUpdated = false; // Track if IP update was successful

if ($client_ip) {
    // Always update the IP
    $updateIpStmt = $conn->prepare("UPDATE users SET ip = ? WHERE id = ?");
    $updateIpStmt->bind_param("si", $client_ip, $user_id);
    
    if ($updateIpStmt->execute()) {
        $ipUpdated = true; // Mark update as successful
    }
    $updateIpStmt->close();
}

// Fetch user details along with UUID
$stmt = $conn->prepare("
    SELECT u.name, u.whitelist, u.geyser, uuid.uuid
    FROM users u
    LEFT JOIN uuid ON u.name = uuid.name
    WHERE u.id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'name' => $row['name'],
        'uuid' => $row['uuid'] ?? 0, // Returns null if UUID is not found
        'geyser' => $row['geyser'],
        'whitelisted' => $row['whitelist'],
        'ip_updated' => $ipUpdated
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found.']);
}

$stmt->close();
$conn->close();
?>
