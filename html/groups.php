<?php
/**
 * Created by PhpStorm.
 * User: Ivanov Oleg
 * Date: 16.07.2018
 * Time: 19:48
 */

include_once('PHP/db.php');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

    $status = true;
    $gp = [];

    $query = "SELECT * FROM product_groups"; // WHERE parent_id = 0 order by created desc
    $result = $handle->query($query) or die ('Нет соединения с базой данных: ' . mysqli_error($handle));

    if ($result) {
        while ($str = $result->fetch_assoc()) {
            array_push($gp, $str);
        }
    }
    else {
        echo json_encode(array('result' => false, 'reason' => 'Ошибка запроса к таблице "product_groups"'));
        $status = false;
        return false;
    }

    if ($status) {
        echo json_encode($gp); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
    }
    else {
        echo json_encode(array('result' => false, 'reason' => 'Ошибка!!!')); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
    }


    $handle->close();
}