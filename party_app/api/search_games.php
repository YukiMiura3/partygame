<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

// PHPエラーがJSON出力を壊さないように
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    // パラメータ取得
    $keyword = $_GET['keyword'] ?? '';
    $players = $_GET['players'] ?? '';
    $time    = $_GET['time'] ?? '';
    $genre   = $_GET['genre'] ?? '';

    // ベースのクエリ
    $sql = "SELECT id, name, players, time, items, genre, banner_image FROM games WHERE 1=1";
    $params = [];

    // キーワード検索（部分一致）
    if ($keyword !== '') {
        $sql .= " AND name LIKE :keyword";
        $params[':keyword'] = '%' . $keyword . '%';
    }

    // 人数（完全一致）
    if ($players !== '') {
        $sql .= " AND players = :players";
        $params[':players'] = $players;
    }

    // 時間（完全一致）
    if ($time !== '') {
        $sql .= " AND time = :time";
        $params[':time'] = $time;
    }

    // ジャンル（完全一致）
    if ($genre !== '') {
        $sql .= " AND genre = :genre";
        $params[':genre'] = $genre;
    }

    // SQL実行
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'count'  => count($results),
        'results' => $results
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
