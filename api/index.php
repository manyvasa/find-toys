<?php

include 'inc/db.php';


class FindToys {
    public $db = null;
    public $candidate_name = null;
    public $candidate_code = null;

    public $wins_person = null;
    public $event_code = null;

    public $request_rating = null;

    function __construct($db) {
        $this->db = $db;
    }



    public function getMainContent() {
        $request_rating = mysqli_query($this->db, "SELECT name, count_wins FROM persons");

        echo "<table  id='rating__table'> 
        <thead><tr><th style=\"
    width: 200px\">Имя</th><th>Очки</th></tr></thead>";
        while($row_rating = $request_rating->fetch_assoc())

            echo "<tr>" .
                "<td >" . $row_rating['name'] . "</td>" .
                "<td >" . $row_rating['count_wins'] . "</td>" .
                "</tr>";
        echo "</table>";
    }



    public function getPostParams () {
        if (
            isset($_POST['name']) && isset($_POST['code']) &&
            !empty($_POST['name']) && !empty($_POST['code'])
        )
        {
            $this->candidate_name = strip_tags($_POST['name']);
            $this->candidate_code = strip_tags($_POST['code']);
        }
    }

    public function checkNameIfExists() {
        $query_pers = mysqli_query($this->db, "SELECT name FROM persons WHERE name= '".$this->candidate_name."'");

        if($query_pers){
            $request_person = mysqli_fetch_assoc($query_pers);
            $this->wins_person = $request_person['name'];
        }
    }

    public function getPlayingCode() {
        $request_code = mysqli_fetch_assoc(mysqli_query($this->db, "SELECT code, id_event FROM events WHERE state=true"));
        $this->event_code = $request_code['code'];
    }

    public function regPersonOrUpdate () {
        if($this->candidate_name === $this->wins_person) {
            mysqli_query($this->db, "UPDATE persons SET count_wins=count_wins+1 WHERE name= '$this->candidate_name'");
        } else {
            mysqli_query($this->db, "INSERT INTO persons(Name, count_wins) VALUES ('".$this->candidate_name."', '1')");
        }
    }

    public function switchEvent() {
        $request_code = mysqli_fetch_assoc(mysqli_query($this->db, "SELECT code, id_event FROM events WHERE state=true"));
        $next_event = $request_code['id_event'] + 1;

        mysqli_query($this->db, "UPDATE events SET state = false  WHERE state = true");
        mysqli_query($this->db, "UPDATE events SET state = true  WHERE id_event = $next_event");
    }

    public function finishEvent() {
        if($this->event_code === $this->candidate_code){

            $this->switchEvent();
            $this->regPersonOrUpdate();

            $sel_cnt = mysqli_fetch_assoc(mysqli_query($this->db, "SELECT id_event, size, area, text FROM events WHERE state = true"));
            if ($sel_cnt){
                echo json_encode(['success' => $sel_cnt]);
            } else {
                echo json_encode(['error' => 'Interesting error']);
            }
        } else {
            echo json_encode(['error' => 'Неправильный код']);
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $event = new FindToys($db);
    $event->getPostParams();
    $event->checkNameIfExists();
    $event->getPlayingCode();
    $event->finishEvent();
}

//$ins_event = mysqli_query($db, "UPDATE events SET state=0  WHERE state=true");
//$ins_event2 = mysqli_query($db, "UPDATE events SET state=1  WHERE id_event= $id_event");
