<?php
header('Content-type: text/html; charset=utf-8');
include 'api/index.php';
include 'api/inc/db.php';


$mainHistory = new FindToys($db);

function renderHistory($db) {
    $requestHistory = mysqli_query($db, "SELECT id_event,area,size,text,url_img,user_win FROM events");
    echo "<div class='event__history accordion '>";

    while($History_assoc = $requestHistory->fetch_assoc())

        echo "<h4>Ивент: #" . $History_assoc['id_event'] . " [". $History_assoc['area'] ."]</h4>" .
                "<div class=\"event__info\">" .
                    "<div class=\"event__text\">" .
                        "<svg class=\"icon-svg\" viewBox=\"0 0 32 32\" version=\"1.1\" width=\"24\" height=\"24\" aria-hidden=\"true\">" .
                        "<path d=\"M26 6v-4h-20v4h-6v4c0 3.314 2.686 6 6 6 0.627 0 1.232-0.096 1.801-0.275 1.443 2.063 3.644 3.556 6.199 4.075v6.2h-2c-2.209 0-4 1.791-4 4h16c0-2.209-1.791-4-4-4h-2v-6.2c2.555-0.519 4.756-2.012 6.199-4.075 0.568 0.179 1.173 0.275 1.801 0.275 3.314 0 6-2.686 6-6v-4h-6zM6 13.625c-1.999 0-3.625-1.626-3.625-3.625v-2h3.625v2c0 1.256 0.232 2.457 0.655 3.565-0.213 0.039-0.431 0.060-0.655 0.060zM29.625 10c0 1.999-1.626 3.625-3.625 3.625-0.224 0-0.442-0.021-0.655-0.060 0.423-1.107 0.655-2.309 0.655-3.565v-2h3.625v2z\"></path>" .
                        "</svg>" .
                        "<span class=\"user-win\">=> ". $History_assoc['user_win'] ."</span>" .
                        "<p>". $History_assoc['text'] ."</p>" .
                    "</div>" .
                    "<div class=\"event__pic\"><img class=\"pic\" src=\" " . $History_assoc['url_img'] ." \"></div>" .
                "</div>";
    echo "</div>";
}



ob_start();
include('build/history.html');
ob_end_flush();

?>
