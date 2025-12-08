<?php
header("Content-Type: application/json");
require_once "db.php";

$input = json_decode(file_get_contents("php://input"), true);

$category = $input["category"] ?? "";
$theme = $input["theme"] ?? "";

if (!$category || !$theme) {
    echo json_encode(["success" => false, "message" => "入力不足"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO themes (category, theme) VALUES (?, ?)");
$stmt->execute([$category, $theme]);

echo json_encode(["success" => true]);
