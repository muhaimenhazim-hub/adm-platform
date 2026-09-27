<?php
// تنظیمات اتصال به دیتابیس MySQL در XAMPP
$host = 'localhost';
$dbname = 'adm_db'; // دیتابیسی که در عکس ساختید
$username = 'root';
$password = ''; // در زامپ به صورت پیش‌فرض خالی است

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    die(json_encode([
        'status' => 'error',
        'message' => 'خطا در اتصال به پایگاه‌داده: ' . $e->getMessage()
    ]));
}
?>