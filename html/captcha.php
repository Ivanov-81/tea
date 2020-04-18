<?php

include_once('PHP/fn.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $ip = $_SERVER['REMOTE_ADDR'];
    $agent = $_SERVER['HTTP_USER_AGENT'];
    $postData = json_decode(file_get_contents('php://input'), true);
    $KEY = "97LeIxAhjgYYGGjtbOOfVBjgYZVRqyHh71UMIE";
    $result = false;
    $captcha = "";
    $timer = 120;
    $error = "";

    if(isset($postData['key'])){
        $site_key = $postData['key'];
        if($KEY == $site_key) {
            $captcha = generate_string();
            $result = true;
        }
        else {
            $error = "Ключи не совпадают!";
        }
    }

    if ($result) {
        echo json_encode(array('result' => true, 'data' => ['timer' => $timer, 'captcha' => $captcha, 'ip' => $ip, 'agent' => $agent]));
    }
    else {
        echo json_encode(array('result' => false, 'reason' => $error));
    }
}