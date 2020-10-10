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

    echo $postData;

    if (isset($postData['name'])) {  // добавление товара
        $id = $postData['id'];
        $group_id = $postData['group_id'];
        $product = $postData['name'];
        $vendor_code = $postData['vendor_code'];
        $unit = $postData['unit'];
        $price = $postData['price'];
        $file = $postData['images'];
        $description = $postData['description'];
        $recipe = $postData['recipe'];
        $date = $postData['date'];
        $promotion = $postData['promotion'];

        if ($product != ' ') {
            $code = $postData['id'];
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

    $handle->close();
}