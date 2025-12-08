<?php
$host = "192.168.12.71";
$dbname = "icebreak";
$user = "(ユーザー名)";
$pass = "(パスワード)";

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", 
                $user, $pass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
