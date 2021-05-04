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

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    $address = $postData['address'];
    $email = $postData['email'];
    $name = $postData['name'];
    $phone = $postData['phone'];
    $phone_template = $postData['phone_template'];
    $products = $postData['products'];
    $order = $postData['order'];
    $string = "";
    $amount = 0;

    foreach ($products as $value) {
        $amount = $amount + $value["amount"];
        $string .= "<div style='border-bottom: 1px solid #ebebeb; font-size: 13px'>
                <span style='margin: 0 10px 0 0; width: 100px; min-width: 100px'>".$value["vendor_code"]."</span>
                <span style='margin: 0 10px 0 0'>".$value["name"]."</span>
                <span>".$value["price"]."</span> руб/".$value["unit"]."
                <br/><span style='font-weight: bolder'>На сумму: ".$value["amount"]." руб</span>
            </div>";
    }

    try {
        $mail->isSMTP();
        $mail->CharSet = "UTF-8";
        $mail->SMTPAuth   = true;

        // Настройки вашей почты
        $mail->Host       = 'smtp.gmail.com'; // SMTP сервера GMAIL  ssl://smtp.gmail.com:465
        $mail->Username   = 'chainaya.zhemchuzhina'; // Логин на почте chainaya.zhemchuzhina
        $mail->Password   = 'ncxsxuczaapelpnl'; // Пароль на почте   voiqcybfgspuagwl   Этот последний ncxsxuczaapelpnl
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;
        $mail->setFrom('chainaya.zhemchuzhina@gmail.com'); //'chainaya.zhemchuzhina@gmail.com', 'Чайная жемчужина' Адрес самой почты и имя отправителя
        $mail->SMTPDebug = 3;
        // Получатель письма
        $mail->addAddress($email);
        $mail->SMTPKeepAlive = true;
        $mail->Mailer = “smtp”; // don't change the quotes! “smtp”



        // -----------------------
        // Само письмо
        // -----------------------
        $mail->isHTML(true);
        $mail->Subject = "Заявка на доставку";  //из магазина \"Чайная жемчужина\"
        $message = '<div style="width: calc(100% - 60px); height: 550px">
                    <h2>Заказ на доставку из магазина "Чайная жемчужина"</h2>
                    <div>
                        <h3>Заказ №'.$order.'</h3>
                        <p><b>'.$name.'</b> прислал(а) заказ с сайта "Чайная жемчужина"</p>
                        <p>Адрес доставки: '.$address.'</a></p>
                        <p>Номер телефона: <a href="tel:'.$phone.'">'.$phone_template.'</a></p>
                        <p>'.$string.'</p>
                    </div>
                    <div style="margin-bottom: 20px">Итого: <b>'.$amount.'</b> руб.</div>
                    <img alt="logo" src="http://xn----7sbabyfbqd8agh9e3bi7j.xn--p1ai/images/pic_05.jpg" style="width: 600px">
                </div>';
        $mail->Body    = $message;
        $mail->AltBody = '';


// Проверяем отравленность сообщения
        if ($mail->send()) {
            echo "Сообщение отправлено";
        } else {
            echo "Сообщение не было отправлено. Неверно указаны настройки вашей почты. Причина ошибки: {$mail->ErrorInfo}";
        }

    } catch (Exception $e) {
        echo "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    }
}