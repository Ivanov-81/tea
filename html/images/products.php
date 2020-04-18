<?php
/**
 * Created by PhpStorm.
 * User: Ivanov Oleg
 * Date: 11.11.2018
 * Time: 13:32
 */

include_once('db.php');

if($_SERVER['REQUEST_METHOD'] == 'POST') {

    $handle = db_connect() or die("Вроде как ошибка" . mysqli_error($handle));
    if(isset($_FILES["file"]["name"])) {
        $new_name = $_POST['uuid'];
        $uuid = $_POST['uuid'];
        $group_id = $_POST['group_id'];
        $product = $_POST['product'];
        $name = $_POST['old_name'];
        $vendor_code = $_POST['vendor_code'];
        $unit = $_POST['unit'];
        $price = $_POST['price'];
//        $file = $_POST['file'];
        $description = $_POST['description'];
        $recipe = $_POST['recipe'];
        $date = $_POST['date'];
        $promotion = $_POST['promotion'];
        $archived = $_POST['archived'];
        $new = $_POST['new'];

        if ($_FILES['file']['error'][0] == 1) {
            echo json_encode(array('result' => false, 'reason' => 'Error: ' . $_FILES['file']['error'][0] . '<br>'));
        } else {
            $uploaddir = '../www/images/products/';
            if (!is_dir($uploaddir)) {
                mkdir($uploaddir, 0777);
            }
            $filename = $_FILES['file']['name'][0];
            $namefile = $new_name . ".jpg";
            $filename = $namefile;
            $uploadfile = $uploaddir . basename($filename);

            move_uploaded_file($_FILES['file']['tmp_name'][0], $uploadfile);


            if ($product != ' ') {
                $query = "INSERT INTO product (uuid, group_id, name, photo, vendor_code, upload_date, description, recipe, unit, price, promotion, new, archived)
                    VALUE ('$uuid', '$group_id', '$product', '$uploadfile', '$vendor_code', '$date','$description', '$recipe', '$unit', '$price', '$promotion', '$new', '$archived')";
                $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));
                if ($result) {
                    echo json_encode(array('result' => true, 'data' => ['path' => $uploaddir . $new_name . '.jpg', 'uuid' => $new_name]));
                }
            }
            else {
                $query = "UPDATE product SET group_id = '$group_id', name = '$name', photo = '$uploadfile', vendor_code = '$vendor_code', upload_date = '$date', description = '$description', recipe = '$recipe', unit = '$unit', price = '$price', promotion = '$promotion', new = '$new', archived = '$archived'  WHERE uuid = '$uuid'";
                $result = $handle->query($query) or die("Ошибка " . mysqli_error($handle));
                if ($result) {
                    echo json_encode(array('result' => true, 'data' => ['path' => $uploaddir . $new_name . '.jpg', 'uuid' => $new_name]));
                } else {
                    echo json_encode(array('result' => false, 'reason' => $result, 'reason2' => error_get_last(), 'uuid' => $uuid));
                }
            }
        }
    }
    else {
        $postData = json_decode(file_get_contents('php://input'), true);

        if(isset($postData['product'])) {
            $code = $postData['product'];
            $query = "SELECT * FROM product WHERE uuid = '".$code."'";
            $result = $handle->query($query) or die(" Ошибка: ".mysqli_error($handle));
            $prd = $result->fetch_assoc();
            if ($result) {
                echo json_encode(array('result' => true, 'data'=> $prd));
            }
            else {
                echo json_encode(array('result' => false, 'reason' => $result));
            }
        }
        if(isset($postData['group'])) {
            $subGrp = [];
            $gp = $postData['group'];
            $pd = [];
            $ar = [];
            $query = "SELECT id, name, photo, parent_id FROM product_groups WHERE parent_id = '".$gp."'";
            $result = $handle->query($query) or die(" Ошибка: ".mysqli_error($handle));
            while ($stg = $result->fetch_assoc()) {
                array_push($subGrp, $stg);
                array_push($ar, $stg['id']);
            }

            foreach ($ar as $vl) {
                $qur = "SELECT id, name, photo, parent_id FROM product_groups WHERE parent_id = '".$vl."'";
                $res = $handle->query($qur) or die(" Ошибка: " . mysqli_error($handle));
                while ($stg = $res->fetch_assoc()) {
                    array_push($subGrp, $stg);
                }
            }

            foreach ($subGrp as $vl) {
                $qur = "SELECT * FROM product WHERE group_id = '".$vl['id']."'";
                $res = $handle->query($qur) or die(" Ошибка: " . mysqli_error($handle));
                while ($stg = $res->fetch_assoc()) {
                    array_push($pd, $stg);
                }
            }
            if ($result) {
                echo json_encode(array('result'=>true, 'data'=> ['products' => $pd, 'sub_groups' => $subGrp]));
            }
            else {
                echo json_encode(array('result' => false, 'reason' => $result));
            }
        }
    }
}