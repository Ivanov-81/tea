<?php

include_once('PHP/db.php');

header("Content-Type: text/html; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $handle = db_error() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

    $id = $postData['id'];
    $msg = $postData['message'];
    $line = $postData['line'];
    $column = $postData['column'];
    $error = $postData['error'];

    $query = "INSERT INTO errors (id, message, line, col, error) VALUE ('$id', '$msg', '$line', '$column', '$error')";
    $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));

}