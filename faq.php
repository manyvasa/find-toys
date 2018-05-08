<?php
header('Content-type: text/html; charset=utf-8');
include 'api/index.php';
include 'api/inc/db.php';


$mainFaq = new FindToys($db);

function renderFaq($db) {
    $request_faq = mysqli_query($db, "SELECT questions,answers FROM faq");

    echo "<div class='event__issues'>";

    while($faq_assoc = $request_faq->fetch_assoc())
        echo "<h4>" . $faq_assoc['questions'] . "</h4>" .
        "<div>" . $faq_assoc['answers'] . "</div>";
    echo "</div>";
}



ob_start();
include('build/faq.html');
ob_end_flush();

?>
