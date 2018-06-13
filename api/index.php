<?php

include 'inc/db.php';


class FindToys {
    public $db = null;
    public $candidate_name = null;
    public $candidate_code = null;

    public $wins_person = null;

    public $event_code = null;
    public $event_id = null;
    public $current_event = null;

    public $request_rating = null;

    function __construct($db) {
        $this->db = $db;
    }

    public function getRatingTable() {
        $request_rating = mysqli_query($this->db, "SELECT name, count_wins FROM Persons ORDER by count_wins DESC LIMIT 3");

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
            $this->candidate_name = trim($this->candidate_name);
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
        $this->event_id = $request_code['id_event'];
        $this->event_code = $request_code['code'];
    }

    public function regPersonOrUpdate () {

        if(mb_strtolower($this->candidate_name, "UTF-8") === mb_strtolower($this->wins_person, "UTF-8")) {

            mysqli_query($this->db, "UPDATE persons SET count_wins=count_wins+1 WHERE name= '$this->candidate_name'");
        } else {
            mysqli_query($this->db, "INSERT INTO persons(Name, count_wins) VALUES ('".$this->candidate_name."', '1')");
        }
        mysqli_query($this->db, "UPDATE events SET user_win = '".$this->candidate_name."' WHERE id_event = '".$this->event_id."'");
    }

    public function switchEvent() {

        $next_event_id = $this->event_id + 1;

        $count_events = mysqli_fetch_assoc(mysqli_query($this->db, "SELECT COUNT(*) FROM events"));
        $last_event = $count_events['COUNT(*)'];

        if ($last_event < $next_event_id){
            mysqli_query($this->db, "UPDATE events SET state = false  WHERE state = true");
            mysqli_query($this->db, "UPDATE events SET state = true  WHERE id_event = '1'");
        }elseif ($last_event >= $next_event_id){
            mysqli_query($this->db, "UPDATE events SET state = false  WHERE state = true");
            mysqli_query($this->db, "UPDATE events SET state = true  WHERE id_event = $next_event_id");
        }

    }

    public function finishEvent() {
        if($this->event_code === $this->candidate_code){

            $this->switchEvent();
            $this->regPersonOrUpdate();

            $sel_cnt = mysqli_fetch_assoc(mysqli_query($this->db, "SELECT id_event, size, area, text, url_img FROM events WHERE state = true"));
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
    sleep(3);
    $event->finishEvent();
}

