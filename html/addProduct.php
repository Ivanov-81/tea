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

    if (isset($_POST['name'])) {  // добавление товара

        $product = $_POST['name'];
        $group_id = $_POST['group_id'];
        $vendor_code = $_POST['vendor_code'];
        $unit = $_POST['unit'];
        $price = $_POST['price'];
        $description = $_POST['description'];
        $recipe = $_POST['recipe'];
        $id = $_POST['id'];
        $date = $_POST['date'];
        $promotion = $_POST['promotion'];
        $archived = $_POST['archived'];
        $files = $_FILES;
        $photo = "";

        if ($product != ' ') {

            $query = "SELECT * FROM product WHERE id = '" . $id . "'";

            $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));

            if (!$result) {
                die(mysqli_error($handle));
            } else {
                $direct = '../images/products/'.$id.'/';

                if (!mkdir($direct, 0777, true)) {
                    die('Failed to create folders...');
                }

                $filetype = array ('jpg','png','jpeg');

                for($i = 1; $i <= 4; $i++) {

                    if($files['image'.$i.'']) {

                        $upfiletype = substr( $files['image'.$i.'']['name'],  strrpos( $files['image'.$i.'']['name'], "." ) + 1 );

                        if ( in_array ( $upfiletype, $filetype ) ) {
                            if ( $files["image".$i.""]["size"] > 1024*1024*2 ) {
                                echo ( "Размер файла превышает допустимый<br />." );
                            }
                            else {
                                if ( is_uploaded_file ( $files["image".$i.""]["tmp_name"] ) ) {
                                    // Если перемещение файла в директорию для наших файлов прошло успешно, то выводим сообщение
                                    if ( move_uploaded_file ( $files["image".$i.""]["tmp_name"], $direct.$id.'_'.$i.'.'.$upfiletype ) ) {
                                        if($photo == "") {
                                            $photo = $direct.$id."_".$i.".".$upfiletype;
                                        }
                                        else {
                                            $photo = $photo .",". $direct.$id.'_'.$i.'.'.$upfiletype;
                                        }
                                        echo "Файл успешно загружен! <br />";
                                    } else {
                                        echo "Файл не удалось загрузить на сервер<br />";
                                    }
                                } else {
                                    echo "Файл загрузить не удалось<br />";
                                }
                            }
                        }
                        else {
                            echo "Не поддерживаемый формат файла!";
                        }
                    }


                }

                $prod = [];
                $query = "INSERT INTO product (id, group_id, name, photo, vendor_code, upload_date, description, recipe, unit, price, promotion, archived)
                      VALUE ('$id', '$group_id', '$product', '$photo', '$vendor_code', '$date','$description', '$recipe', '$unit', '$price', '$promotion', '$archived')";
                $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));
                if ($result) {

                    $q = "INSERT INTO prices (product_id, price, date) VALUE ('$id', '$price', '$date')";
                    echo $q;
                    $handle->query($q) or die("Ошибка addProduct: " . mysqli_error($handle));

                    $query = "SELECT * FROM product WHERE id = '" . $id . "'";
                    $res = $handle->query($query);
                    while ($stg = $res->fetch_assoc()) {
                        array_push($prod, $stg);
                    }
                    echo json_encode(array('result' => true, 'data' => $prod));
                }
            }
        }
        else {
            echo "else 60: " . $product . "<br/>product";
        }
    }

    $handle->close();
}
