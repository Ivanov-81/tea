<?php

include_once('PHP/db.php');
header("Content-Type: text/html; charset=utf-8");

$handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $postData = json_decode(file_get_contents('php://input'), true);

    $order = $postData['order'];
    $address = $postData['address'];
    $description = $postData['description'];
    $delivery = $postData['delivery'];
    $name = $postData['name'];
    $phone = $postData['phone'];
    $email = $postData['email'];
    $date = $postData['date'];
    $products = $postData['data'];

    $query = "INSERT INTO orders (id, address, description, delivery, name, phone, email, date, products)
                      VALUE ('$order', '$address', '$description', '$delivery', '$name', '$phone', '$email', '$date', '$products')";
    $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));
    if ($result) {
        echo json_encode(array('result' => true, 'order' => $order));
    } else {
        echo json_encode(array('result' => false, 'reason' => $result));
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $postData = json_decode(file_get_contents('php://input'), true);

    $orders = [];

    $query = "SELECT * FROM orders"; // order by created desc
    $result = $handle->query($query) or die("<b>Warning Error!!!</b><br />" . mysqli_error($handle));
    if ($result) {
        while ($str = $result->fetch_assoc()) {
            array_push($orders, $str);
        }
        echo json_encode(array('result' => true, 'orders' => $orders));
    }
    else {
        echo json_encode(array('result' => false, 'reason' => 'Ошибка запроса к базе данных product'));
    }
}