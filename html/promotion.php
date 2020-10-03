<?php
/**
 * Created by PhpStorm.
 * User: Ivanov Oleg
 * Date: 16.07.2018
 * Time: 19:48
 */

include_once('PHP/db.php');
header("Content-Type: text/html; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

    if (isset($postData['promotion'])) {
        $uuid = $postData['id'];
        $promotion = $postData['promotion'];
        $query = "UPDATE product SET promotion = '$promotion' WHERE uuid = '" . $uuid . "'";
        $result = $handle->query($query);
        if ($result) {
            echo json_encode(array('result' => true));
        } else {
            echo json_encode(array('result' => false, 'reason' => $result));
        }
    }

    $handle->close();
}