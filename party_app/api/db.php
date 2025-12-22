<?php
$host = "localhost";
$dbname = "icebreak";
$user = "appuser";
$pass = "rtyu90pl@MySQL";

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", 
                $user, $pass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
