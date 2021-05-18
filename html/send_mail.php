<?php

use PHPMailer\PHPMailer\PHPMailer;

require_once "PHP_Mailer/PHPMailer.php";
require_once "PHP_Mailer/SMTP.php";
require_once "PHP_Mailer/Exception.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    $address = $postData['address'];
    $email = $postData['email'];
    $name = $postData['name'];
    $phone = $postData['phone'];
    $phone_template = $postData['phone_template'];
    $products = $postData['products'];
    $order = $postData['order'];
    $SMTPDebug = $postData['SMTPDebug'];
    $string = "";
    $amount = 0;
    $subj = "Заявка на доставку";

    foreach ($products as $value) {
        $amount = $amount + $value["amount"];
        $string .= "<div style='border-bottom: 1px solid #ebebeb; font-size: 13px'>
                <span style='margin: 0 10px 0 0; width: 100px; min-width: 100px'>" . $value["vendor_code"] . "</span>
                <span style='margin: 0 10px 0 0'>" . $value["name"] . "</span>
                <span>" . $value["price"] . "</span> руб/" . $value["unit"] . "
                <br/><span style='font-weight: bolder'>На сумму: " . $value["amount"] . " руб</span>
            </div>";
    }

    $mail = new PHPMailer();

    $mail->SMTPDebug = $SMTPDebug;
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth = true;
    $mail->Host = "smtp.gmail.com";
    $mail->Username = "chainaya.zhemchuzhina@gmail.com";
    $mail->Password = "lfyz1401";
    $mail->Port = 587;
    $mail->SMTPSecure = "tls";

    $mail->isHTML(true);
    $mail->setFrom('chainaya.zhemchuzhina@gmail.com', 'Чайная жемчужина');
    $mail->addAddress($email);
    $mail->addAddress("chainaya.zhemchuzhina@gmail.com");
    $mail->addReplyTo("chainaya.zhemchuzhina@gmail.com", "Reply");

    $mail->Subject = ('Заявка на доставку из магазина "Чайная жемчужина"');
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
    $mail->Body = $message;

    if ($mail->send()) {
        echo "OK";
    } else {
        echo "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    }

}