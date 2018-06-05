<?php

$db_host = "localhost";
$db_name = "findToys";
$db_user = "root";
$db_pass = "";


$db = mysqli_connect ($db_host, $db_user, "", $db_name) or die ("Невозможно подключиться к БД");

mysqli_query ($db, "SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_connection = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'");