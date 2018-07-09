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
    public $countDownTime = null;

    public $params_isValid = false;


    function __construct($db) {
        $this->db = $db;
    }

    public function getCountDownTime() {

        $result_time = mysqli_fetch_assoc(mysqli_query($this->db, "SELECT date_start FROM events WHERE state=true"));
        $this->countDownTime = $result_time['date_start'];

    }

    public function getCurrentEvent() {

        date_default_timezone_set("Asia/Yekaterinburg");

        $this->getCountDownTime();
        $t = time();
        $s = strtotime($this->countDownTime);

        if ( $t >= $s ) {
            $result_currEvent = mysqli_fetch_assoc(mysqli_query($this->db, "SELECT id_event,size,area,text,url_img FROM events WHERE state=true"));
            echo json_encode(['success' => $result_currEvent]);
        } else {
            echo json_encode(['error' => 'there will be time will be a place']);
        }
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

        function postCaptcha($user_response) {
            $fields_string = '';
            $fields = array(
                'secret' => '6LfP914UAAAAAGd0-GB5tZUXbrTL2zQxmzGaNGnT',
                'response' => $user_response
            );
            foreach($fields as $key=>$value)
                $fields_string .= $key . '=' . $value . '&';
            $fields_string = rtrim($fields_string, '&');

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
            curl_setopt($ch, CURLOPT_POST, count($fields));
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);

            $result = curl_exec($ch);
            curl_close($ch);

            return json_decode($result, true);
        }

        $result_recaptcha = postCaptcha($_POST['g-recaptcha-response']);

        if (!$result_recaptcha['success']) {
            // Если капча не правильная
            //$this->reCap = $_POST['name'];
        } else {
            // Если капча правильная
            if (
                isset($_POST['name']) && isset($_POST['code']) &&
                !empty($_POST['name']) && !empty($_POST['code'])
            )
            {
                $this->candidate_name = trim(strip_tags($_POST['name']));
                $this->candidate_code = strip_tags($_POST['code']);
                $this->params_isValid = true;
            }
        }
    }

    public function checkNameIfExists() {
        $query_pers = mysqli_query($this->db, "SELECT name FROM Persons WHERE name= '".$this->candidate_name."'");

        if ($query_pers){
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

            mysqli_query($this->db, "UPDATE Persons SET count_wins=count_wins+1 WHERE name= '$this->candidate_name'");
        } else {
            mysqli_query($this->db, "INSERT INTO Persons(Name, count_wins) VALUES ('".$this->candidate_name."', '1')");
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
        if($this->event_code === $this->candidate_code && trim($this->candidate_name) && $this->params_isValid){

            $this->switchEvent();
            $this->regPersonOrUpdate();

            $sel_cnt = mysqli_fetch_assoc(mysqli_query($this->db, "SELECT id_event, size, area, text, url_img FROM events WHERE state = true"));
            if ($sel_cnt){
                echo json_encode(['success' => $sel_cnt]);
            } else {
                echo json_encode(['error' => 'Interesting error']);
            }
        } else if ($this->event_code != $this->candidate_code && trim($this->candidate_name) && $this->params_isValid) {
            echo json_encode(['error' => 'Неправильный код']);

        } else if ($this->event_code === $this->candidate_code && !$this->params_isValid) {
            echo json_encode(['error' => 'Пройдите каптчу']);
        } else if ($this->event_code === $this->candidate_code && !(trim($this->candidate_name)) && $this->params_isValid) {
            echo json_encode(['error' => 'Некоректное имя']);
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

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['dateStart'])) {
        $event = new FindToys($db);
        $event->getCountDownTime();
        echo $event->countDownTime;

    } else if (isset($_GET['current'])) {
        $event = new FindToys($db);
        $event->getCurrentEvent();
    }
}

