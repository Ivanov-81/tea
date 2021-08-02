<?php
/**
 * Created by PhpStorm.
 * User: Ivanov Oleg
 * Date: 31.07.2021
 * Time: 20:34
 */

include_once('PHP/db.php');
header("Content-Type: text/html; charset=utf-8");


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

    if (isset($postData['price'])) {
        $error = '';
        $error2 = '';
        $id = $postData['id'];
        $price = $postData['price'];
        $date = $postData['date'];
        $query = "INSERT INTO prices (product_id, price, date)
              VALUE ('$id', '$price', '$date')";
        $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));
        if (!$result) {
            $error = 'Ошибка записи в таблицу prices';
        }
        $query = "UPDATE product SET price = '$price' WHERE id = '" . $id . "'";
        $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));

        if (!$result) {
            $error2 = 'Ошибка записи в таблицу product';
        }

        if($error == '' && $error2 == '') {
            echo json_encode(array('result' => true));
        }
        else {
            echo json_encode(array('result' => false, 'error' => $error, 'error2' => $error2));
        }
    }

}
