<?php
header('Content-type: text/html; charset=utf-8');
include 'api/inc/db.php';

$res = mysqli_query($db, "SELECT size,area,text FROM events WHERE state=true");
$row = mysqli_fetch_assoc($res);


$request_rating = mysqli_query($db, "SELECT name, count_wins FROM persons");

// Формируем массив со статьями
$articles = array();
while ($rating = mysqli_fetch_assoc($request_rating))
{
    $articles[] = $rating;
}

ob_start();
include('build/index.html');
ob_end_flush();

?>
