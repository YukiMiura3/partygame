<?php
header("Content-Type: application/json");
require_once __DIR__ . '/db.php';

$stmt = $pdo->query("SELECT * FROM themes ORDER BY RAND() LIMIT 1");
$data = $stmt->fetch(PDO::FETCH_ASSOC);

if ($data) {
    echo json_encode([
        "success" => true,
        "category" => $data["category"],
        "theme" => $data["theme"]
    ]);
} else {
    echo json_encode(["success" => false]);
}
