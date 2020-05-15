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

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

    $status = true;
    $pd = [];

    $query = "SELECT * FROM errors"; // order by created desc
    $result = $handle->query($query) or die("<b>Warning Error!!!</b><br />" . mysqli_error($handle));
    if ($result) {
        while ($str = $result->fetch_assoc()) {
            array_push($pd, $str);
        }
    }
    else {
        echo json_encode(array('result' => false, 'reason' => 'Ошибка запроса к базе данных product'));
        $status = false;
        return false;
    }

    if ($status) {
        echo json_encode($pd); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
    }
    else {
        echo json_encode(array('result' => false, 'reason' => 'Ошибка!!!')); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
    }

    $handle->close();
}