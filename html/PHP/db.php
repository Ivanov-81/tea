<?php
/**
 * User: Ivanov Oleg
 * Date: 16.07.2018
 * Time: 21:58
 */

function db_connect() {
//     $handle = new mysqli('85.12.197.98', 'h30479674-it206095', 'v6b2EBjyp', 'h30479674-tea_coffee');
    $handle = new mysqli('85.12.197.98', 'h30479674-it206095', 'v6b2EBjyp', 'h30479674-tea_coffee');
    $handle->set_charset("utf8");
    if (!$handle) {
        return false;
    }
    return $handle;
}

function db_error() {
//     $handle = new mysqli('85.12.197.98', 'h30479674-it206095', 'v6b2EBjyp', 'h30479674-tea_coffee');
    $handle = new mysqli('85.12.197.98', 'h30479674-it206095', 'v6b2EBjyp', 'error');
    $handle->set_charset("utf8");
    if (!$handle) {
        return false;
    }
    return $handle;
}
