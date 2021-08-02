<?php
/**
 * Created by PhpStorm.
 * User: Ivanov Oleg
 * Date: 29.07.2021
 * Time: 13:57
 */

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

    if (isset($postData['_csrf'])) {
        $login = $postData['login'];
        $password = md5($postData['password']);
        $query = "SELECT * FROM admin_user WHERE login = '" . $login . "'";
        $result = $handle->query($query) or die(" Ошибка: " . mysqli_error($handle));
        $stg = $result->fetch_assoc();
        if ($password == $stg['password']) {
            echo json_encode(array('result' => true));
        } else {
            echo json_encode(array('result' => false, 'reason' => 'Не верные данные!!!'));
        }
    }

}
