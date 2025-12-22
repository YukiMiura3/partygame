<?php
header("Content-Type: application/json; charset=utf-8");
require_once "db.php";

$input = json_decode(file_get_contents("php://input"), true);

$category = trim($input["category"] ?? "");
$theme = trim($input["theme"] ?? "");

if ($category === "" || $theme === "") {
    echo json_encode([
        "success" => false,
        "message" => "入力不足"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO themes (category, theme) VALUES (?, ?)"
    );
    $stmt->execute([$category, $theme]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {

    // MySQL: Duplicate entry (UNIQUE制約違反)
    if (isset($e->errorInfo[1]) && $e->errorInfo[1] === 1062) {
        echo json_encode([
            "success" => false,
            "message" => "同じ話題はすでに登録されています"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "DBエラーが発生しました"
        ]);
    }
}
