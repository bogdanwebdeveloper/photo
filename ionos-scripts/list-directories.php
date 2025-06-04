<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Get the path parameter
$path = $_GET['path'] ?? '';

// Security: only allow paths within photos and albums directories
$allowedPaths = ['/photos', '/albums'];
$isAllowed = false;
foreach ($allowedPaths as $allowedPath) {
    if (strpos($path, $allowedPath) === 0) {
        $isAllowed = true;
        break;
    }
}

if (!$isAllowed) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

// Convert to actual file system path
$fullPath = $_SERVER['DOCUMENT_ROOT'] . $path;

// Check if directory exists
if (!is_dir($fullPath)) {
    http_response_code(404);
    echo json_encode(['error' => 'Directory not found']);
    exit;
}

// Get all subdirectories
$directories = [];

if ($handle = opendir($fullPath)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && is_dir($fullPath . '/' . $entry)) {
            $directories[] = $entry;
        }
    }
    closedir($handle);
}

// Sort directories alphabetically
sort($directories);

echo json_encode(['directories' => $directories]);
?>
