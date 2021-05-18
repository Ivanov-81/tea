<?php

header("Content-Type: text/html; charset=utf-8");

/**
 * Created by PhpStorm.
 * User: Ivanov Oleg
 * Date: 16.07.2018
 * Time: 19:48
 */

include_once('PHP/db.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

    if(isset($postData['group'])) {
        $group = $postData['group'];
        $subGrp = [];
        $pd = [];
        $ar = [];
        $query = "SELECT id, name, photo, parent_id FROM product_groups WHERE parent_id = '".$group."' ORDER BY name ASC";
        $result = $handle->query($query) or die(" Ошибка: ".mysqli_error($handle));
        while ($stg = $result->fetch_assoc()) {
            array_push($subGrp, $stg);
            array_push($ar, $stg['id']);
        }

        foreach ($ar as $vl) {
            $qur = "SELECT id, name, photo, parent_id FROM product_groups WHERE parent_id = '".$vl."' ORDER BY name ASC";
            $res = $handle->query($qur) or die(" Ошибка: " . mysqli_error($handle));
            while ($stg = $res->fetch_assoc()) {
                array_push($subGrp, $stg);
            }
        }

        foreach ($subGrp as $vl) {
            $qur = "SELECT * FROM product WHERE group_id = '".$vl['id']."' ORDER BY name ASC";
            $res = $handle->query($qur) or die(" Ошибка: " . mysqli_error($handle));
            while ($stg = $res->fetch_assoc()) {
                array_push($pd, $stg);
            }
        }
        if ($result) {
            echo json_encode(array('products' => $pd, 'sub_groups' => $subGrp));
        }
        else {
            echo json_encode(array('result' => false, 'reason' => $result));
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

    $status = true;
    $pd = [];

    $query = "SELECT * FROM product"; // order by created desc
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