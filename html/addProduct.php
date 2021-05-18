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
        $file = $_POST['image1'];

        if ($product != ' ') {

            $query = "SELECT * FROM product WHERE id = '" . $id . "'";

            $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));

            if (!$result) {
                die(mysqli_error($handle));
            } else {
                $direct = '/html/images/products/'.$id.'/';
                echo $direct.'<br/>';

                if (!is_dir($direct)) {
                    mkdir($direct, '0777');
                }

                echo $_FILES['image1']['name'].'<br/>';
                $filetype = array ('jpg','png','jpeg');

                $upfiletype = substr( $_FILES['image1']['name'],  strrpos( $_FILES['image1']['name'], "." ) + 1 );

                echo 'upfiletype: '.$upfiletype.'<br/>';
                if ( in_array ( $upfiletype, $filetype ) ) {
                    if ( $_FILES["image1"]["size"] > 1024*1024*2 ) {
                        echo ( "Размер файла превышает допустимый<br />." );
                    }
                    else {
                        if ( is_uploaded_file ( $_FILES["image1"]["tmp_name"] ) ) {
                            // Если перемещение файла в директорию для наших файлов прошло успешно, то выводим сообщение
                            if ( move_uploaded_file ( $_FILES["image1"]["tmp_name"], $direct.$_FILES["image1"]["name"] ) ) {
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

                $prod = [];
                $query = "INSERT INTO product (id, group_id, name, photo, vendor_code, upload_date, description, recipe, unit, price, promotion)
                      VALUE ('$id', '$group_id', '$product', '$file', '$vendor_code', '$date','$description', '$recipe', '$unit', '$price', '$promotion')";
                $result = $handle->query($query) or die("Ошибка: " . mysqli_error($handle));
                if ($result) {
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