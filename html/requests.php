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
    if (isset($postData['name'])) {
        $name = $postData['name'];
        $parent = $postData['parent'];
        $class = $postData['class'];
        $photo = $postData['photo'];
        if ($name != ' ') {
            $query = "INSERT INTO product_groups (name, parent_id, class, photo)
                          VALUE ('$name', '$parent','$class','$photo')";
            $result = $handle->query($query) or die(" Ошибка product_groups: " . mysqli_error($handle));
            if ($result) {
                $q = "SELECT * FROM product_groups WHERE name = '" . $name . "'";
                $res = $handle->query($q) or die(" Ошибка product_groups: " . mysqli_error($handle));
                $stg = $res->fetch_assoc();
                echo json_encode(array('result' => true, 'data' => $stg));
            } else {
                echo json_encode(array('result' => false, 'reason' => $result));
            }
        }
    }
    elseif (isset($postData['header_news'])) {
        $id = $postData['id'];
        $name = $postData['header_news'];
        $text = $postData['text'];
        $archive = $postData['archive'];
        if ($name != ' ') {
            $query = "INSERT INTO news (id, name, text, archive) VALUE ('$id','$name','$text','$archive')";
            $result = $handle->query($query) or die(" Ошибка news: " . mysqli_error($handle));
            if ($result) {
                $q = "SELECT * FROM news WHERE id = '" . $id . "'";
                $res = $handle->query($q) or die(" Ошибка news2: " . mysqli_error($handle));
                $stg = $res->fetch_assoc();
                echo json_encode(array('result' => true, 'data' => $stg));
            } else {
                echo json_encode(array('result' => false, 'reason' => $result));
            }
        }
    }
    elseif (isset($postData['header_article'])) {
        $id = $postData['id'];
        $name = $postData['header_article'];
        $text = $postData['text'];
        $archive = $postData['archive'];
        if ($name != ' ') {
            $query = "INSERT INTO аrticles (id, name, text, archive) VALUE ('$id','$name','$text','$archive')";
            $result = $handle->query($query) or die(" Ошибка article: " . mysqli_error($handle));
            if ($result) {
                $q = "SELECT * FROM аrticles WHERE id = '" . $id . "'";
                $res = $handle->query($q) or die(" Ошибка article2: " . mysqli_error($handle));
                $stg = $res->fetch_assoc();
                echo json_encode(array('result' => true, 'data' => $stg));
            } else {
                echo json_encode(array('result' => false, 'reason' => $result));
            }
        }
    }
    elseif (isset($postData['product'])) {  // добавление товара
        $id = $postData['id'];
        $group_id = $postData['group_id'];
        $product = $postData['product'];
        $vendor_code = $postData['vendor_code'];
        $unit = $postData['unit'];
        $price = $postData['price'];
        $file = $postData['file'];
        $description = $postData['description'];
        $recipe = $postData['recipe'];
        $date = $postData['date'];
        $promotion = $postData['promotion'];

        if ($product != ' ') {
            $code = $postData['uuid'];
            $query = "SELECT * FROM product WHERE id = '" . $code . "'";
            $result = $handle->query($query) or die(" Ошибка: " . mysqli_error($handle));
            if ($result) {

            } else {
                $prod = [];
                $query = "INSERT INTO product (id, group_id, name, photo, vendor_code, upload_date, description, recipe, unit, price, promotion)
                      VALUE ('$id', '$group_id', '$product', '$file', '$vendor_code', '$date','$description', '$recipe', '$unit', '$price', '$promotion')";
                $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));
                if ($result) {
                    $query = "SELECT * FROM product";
                    $res = $handle->query($query);
                    while ($stg = $res->fetch_assoc()) {
                        array_push($prod, $stg);
                    }
                    echo json_encode(array('result' => true, 'data' => $prod));
                }
            }
        }
    }
//    elseif (isset($postData['archived'])) {
//        $uuid = $postData['id'];
//        $archived = $postData['archived'];
//        $query = "UPDATE product SET archived = '$archived' WHERE uuid = '" . $uuid . "'";
//        $result = $handle->query($query);
//        if ($result) {
//            echo json_encode(array('result' => true));
//        } else {
//            echo json_encode(array('result' => false, 'reason' => $result));
//        }
//    }
//    elseif (isset($postData['promotion'])) {
//        $uuid = $postData['id'];
//        $promotion = $postData['promotion'];
//        $query = "UPDATE product SET promotion = '$promotion' WHERE uuid = '" . $uuid . "'";
//        $result = $handle->query($query);
//        if ($result) {
//            echo json_encode(array('result' => true));
//        } else {
//            echo json_encode(array('result' => false, 'reason' => $result));
//        }
//    }
    elseif (isset($postData['code'])) { // запрос на редактирование товара
        $code = $postData['code'];
        $query = "SELECT * FROM product WHERE id = '" . $code . "'";
        $result = $handle->query($query) or die(" Ошибка: " . mysqli_error($handle));
        $stg = $result->fetch_assoc();
        if ($result) {
            echo json_encode(array('result' => true, 'data' => $stg));
        } else {
            echo json_encode(array('result' => false, 'reason' => $result));
        }
    }
    elseif (isset($postData['info'])) {
        $ar = [];
        $arr = $postData['info'];
        foreach ($arr as $value) {
            $uuid = $value['uuid'];
            $grp = $value['group'];
            $product = $value['name'];
            $vendor_code = $value['vendor'];
            $date = $value['date'];
            $description = $value['description'];
            $recipe = $value['recipe'];
            $unit = $value['unit'];
            $price = $value['price'];
            $query = "INSERT INTO product (id, group_id, name, photo, vendor_code, upload_date, description, recipe, unit, price) 
              VALUE ('$uuid', '$grp', '$product', null, '$vendor_code', '$date','$description', '$recipe', '$unit', '$price')";
            $result = $handle->query($query) or die(" Ошибка: " . mysqli_error($handle));
            if ($result) {
                array_push($ar, $result);
            }
            echo json_encode(array('result' => true, 'data' => count($ar)));
        }
    }
    elseif (isset($postData['email'])) {
        $email = $postData['email'];
        $arch = $postData['archive'];
        $query = "INSERT INTO newsletter (email, archived) VALUE ('$email', '$arch')";
        $result = $handle->query($query);
        if ($result) {
            echo json_encode(array('result' => true));
        } else {
            echo json_encode(array('result' => false, 'reason' => mysqli_error($handle)));
        }
    }
    elseif (isset($postData['_csrf'])) {
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
    elseif (isset($postData['block'])) {
        $id = $_SERVER['REMOTE_ADDR'];
        $date = $postData['date'];
        $query = "INSERT INTO block_id (address,date_evt,active) VALUE ('$id',$date,'false')";
        $result = $handle->query($query) or die(" Ошибка: " . mysqli_error($handle));
        if ($result) {
            echo json_encode(array('result' => true));
        } else {
            echo json_encode(array('result' => false, 'reason' => $handle));
        }
    }
    elseif (isset($postData['promotion_item'])) {
        $prom = [];
        $qry = "SELECT * FROM product WHERE promotion = '" . $postData['promotion_item'] . "'"; // order by created desc WHERE uuid = '".$code."'
        $res = $handle->query($qry) or die(" Ошибка: " . mysqli_error($handle));
        if ($res) {
            while ($stg = $res->fetch_assoc()) {
                array_push($prom, $stg);
            }
            echo json_encode(array('result' => true, 'data' => ['products' => $prom]));
        } else {
            echo json_encode(array('result' => false, 'reason' => $res));
        }
    }
    else {
        $status = true;
        $gp = [];
        $pd = [];
        $nw = [];
        $at = [];
        $lt = [];

        $query = "SELECT * FROM product_groups"; // order by created desc
        $result = $handle->query($query) or die ('Нет соединения: ' . mysqli_error($handle));
        if ($result) {
            while ($str = $result->fetch_assoc()) {
                array_push($gp, $str);
            }
        }
        else {
            echo json_encode(array('result' => false, 'reason' => 'Ошибка запроса к базе данных product_groups'));
            $status = false;
            return false;
        }
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
        $query = "SELECT * FROM news"; // order by created desc
        $result = $handle->query($query) or die("<b>Warning Error!!!</b><br />" . mysqli_error($handle));
        if ($result) {
            while ($str = $result->fetch_assoc()) {
                array_push($nw, $str);
            }
        }
        else {
            echo json_encode(array('result' => false, 'reason' => 'Ошибка запроса к базе данных news'));
            $status = false;
            return false;
        }
        $query = "SELECT * FROM articles"; // order by created desc
        $result = $handle->query($query) or die("<b>Warning Error!!!</b><br />" . mysqli_error($handle));
        if ($result) {
            while ($str = $result->fetch_assoc()) {
                array_push($at, $str);
            }
        }
        else {
            echo json_encode(array('result' => false, 'reason' => 'Ошибка запроса к базе данных articles'));
            $status = false;
            return false;
        }

//        if (json_last_error_msg() != 'No error') {
//            echo json_encode(array('result' => true, 'data' => ['products' => $pd, 'product_groups' => $gp, 'news' => $nw, 'articles' => $at])); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
//        }




        if ($status) {
            echo json_encode(array('result' => true, 'data' => ['products' => $pd, 'product_groups' => $gp, 'news' => $nw, 'articles' => $at])); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
        }
        else {
            echo json_encode(array('result' => false, 'reason' => 'Ошибка!!!')); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
        }
    }
    $handle->close();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    $postData = json_decode(file_get_contents('php://input'), true);

        $status = true;
        $pd = [];
        $nw = [];
        $at = [];
        $lt = [];

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
        $query = "SELECT * FROM news"; // order by created desc
        $result = $handle->query($query) or die("<b>Warning Error!!!</b><br />" . mysqli_error($handle));
        if ($result) {
            while ($str = $result->fetch_assoc()) {
                array_push($nw, $str);
            }
        }
        else {
            echo json_encode(array('result' => false, 'reason' => 'Ошибка запроса к базе данных news'));
            $status = false;
            return false;
        }
        $query = "SELECT * FROM articles"; // order by created desc
        $result = $handle->query($query) or die("<b>Warning Error!!!</b><br />" . mysqli_error($handle));
        if ($result) {
            while ($str = $result->fetch_assoc()) {
                array_push($at, $str);
            }
        }
        else {
            echo json_encode(array('result' => false, 'reason' => 'Ошибка запроса к базе данных articles'));
            $status = false;
            return false;
        }

//        if (json_last_error_msg() != 'No error') {
//            echo json_encode(array('result' => true, 'data' => ['products' => $pd, 'product_groups' => $gp, 'news' => $nw, 'articles' => $at])); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
//        }

        if ($status) {
            echo json_encode(array('result' => true, 'data' => ['products' => $pd, 'product_groups' => $gp, 'news' => $nw, 'articles' => $at])); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
        }
        else {
            echo json_encode(array('result' => false, 'reason' => 'Ошибка!!!')); //, 'product_groups' => $gp, 'products' => $pd, 'news' => $nw, 'articles' => $at
        }


    $handle->close();
}