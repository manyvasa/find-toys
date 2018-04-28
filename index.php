<?php
header('Content-type: text/html; charset=utf-8');
include 'api/index.php';
include 'api/inc/db.php';


$res = mysqli_query($db, "SELECT id_event,size,area,text FROM events WHERE state=true");
$row = mysqli_fetch_assoc($res);


ob_start();
include('build/index.html');
ob_end_flush();

?>
