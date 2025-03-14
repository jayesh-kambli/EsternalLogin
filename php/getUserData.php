<?php
header("Content-Type: application/json");
require 'spyc.php'; // Load YAML parser

// Get UUID from request
$uuid = isset($_GET['uuid']) ? $_GET['uuid'] : '';

if (!$uuid) {
    echo json_encode(["error" => "No UUID provided"]);
    exit;
}

$file_path = "C:/Users/ADMIN/Desktop/New folder/servers/SigmaS8/plugins/Essentials/userdata/$uuid.yml";

// Check if file exists
if (!file_exists($file_path)) {
    echo json_encode(["error" => "User data file not found"]);
    exit;
}

// Read YAML file
$yaml_data = Spyc::YAMLLoad($file_path);

// Convert YAML to JSON and return it
echo json_encode($yaml_data, JSON_PRETTY_PRINT);
?>
