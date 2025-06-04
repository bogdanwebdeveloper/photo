<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Simple stats API for the CDN
function getDirectorySize($directory) {
    $size = 0;
    if (is_dir($directory)) {
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file) {
            if ($file->isFile()) {
                $size += $file->getSize();
            }
        }
    }
    return $size;
}

function countFiles($directory, $extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']) {
    $count = 0;
    if (is_dir($directory)) {
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file) {
            if ($file->isFile()) {
                $extension = strtolower($file->getExtension());
                if (in_array($extension, $extensions)) {
                    $count++;
                }
            }
        }
    }
    return $count;
}

function formatBytes($size, $precision = 2) {
    $units = array('B', 'KB', 'MB', 'GB', 'TB');
    
    for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
        $size /= 1024;
    }
    
    return round($size, $precision) . ' ' . $units[$i];
}

try {
    $photosDir = $_SERVER['DOCUMENT_ROOT'] . '/photos';
    $albumsDir = $_SERVER['DOCUMENT_ROOT'] . '/albums';
    
    $photoCount = 0;
    $albumCount = 0;
    $totalSize = 0;
    
    // Count photos
    if (is_dir($photosDir)) {
        $photoCount = countFiles($photosDir);
        $totalSize += getDirectorySize($photosDir);
    }
    
    // Count albums
    if (is_dir($albumsDir)) {
        $albumDirs = array_filter(glob($albumsDir . '/*'), 'is_dir');
        $albumCount = count($albumDirs);
        $totalSize += getDirectorySize($albumsDir);
    }
    
    echo json_encode([
        'photos' => $photoCount,
        'albums' => $albumCount,
        'totalSize' => formatBytes($totalSize),
        'totalSizeBytes' => $totalSize,
        'timestamp' => date('c')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to get stats',
        'message' => $e->getMessage()
    ]);
}
?>
