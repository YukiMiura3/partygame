<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$id = $_GET['id'] ?? '';

if (!$id) {
    echo json_encode(['success' => false, 'error' => 'No ID']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM games WHERE id = ?");
    $stmt->execute([$id]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($game) {
        echo json_encode(['success' => true, 'game' => $game], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['success' => false, 'error' => 'Game not found']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
