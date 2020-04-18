<?php
/*
 * User: Ivanov Oleg
 * Date: 12.04.2020
 * Time: 21:15
 */
header("Content-Type: text/html; charset=utf-8");
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    $group = $postData['group'];
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    $email = $postData['email'];
    $name = $postData['name'];
    $phone = $postData['phone'];
    $phone_template = $postData['phone_template'];
    $products = $postData['products'];
    $str = "";

    foreach ($products as $value) {
        $str .= "";
    }

    try {
        $msg = "ok";
        $mail->isSMTP();
        $mail->CharSet = "UTF-8";
        $mail->SMTPAuth   = true;

        // Настройки вашей почты
        $mail->Host       = 'smtp.gmail.com'; // SMTP сервера GMAIL
        $mail->Username   = 'gmiolegv'; // Логин на почте
        $mail->Password   = 'vrscsjvawepkkeyj'; // Пароль на почте
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;
        $mail->setFrom('gmiolegv@gmail.com', 'Чайная жемчужина'); // Адрес самой почты и имя отправителя

        // Получатель письма
        $mail->addAddress('ivanov-81@mail.ru');
        $mail->addAddress('danil-klimov-2013@mail.ru');
        $mail->addAddress($email);

        // -----------------------
        // Само письмо
        // -----------------------
        $mail->isHTML(true);
        $message = '<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center; width: calc(100% - 60px); height: 550px">
                    <h2>Заявка на доставку из магазина "Чайная жемчужина"</h2>
                    <div>
                        <img alt="logo" src="http://94.19.190.165/images/pic_05.jpg" style="width: 600px">
                        <p><b>'.$name.'</b> прислал(а) заявку с сайта "Чайная жемчужина"</p>
                        <p>Номер телефона: <a href="tel:'.$phone.'">'.$phone_template.'</a></p>
                        

                        
                        
                        <p>'.serialize($products).'</p>
                    </div>
                </div>';
        $mail->Subject = "Заявка на доставку из магазина \"Чайная жемчужина\"";
        $mail->Body    = $message;


// Проверяем отравленность сообщения
        if ($mail->send()) {
            echo "$msg";
        } else {
            echo "Сообщение не было отправлено. Неверно указаны настройки вашей почты";
        }

    } catch (Exception $e) {
        echo "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    }
}