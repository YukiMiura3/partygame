<?php
header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . '/db.php';

$id = $_GET['id'] ?? 0;

$stmt = $pdo->prepare("SELECT slides, slide_dir FROM games WHERE id = ?");
$stmt->execute([$id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$slides = json_decode($row["slides"], true);

echo json_encode([
    "slides" => $slides,
    "slideDir" => $row["slide_dir"]
], JSON_UNESCAPED_UNICODE);
