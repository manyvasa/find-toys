
function onSubmit(token) {

    const formNm = $('#form1');
    const message = $(formNm).find(".user-form__msg");
    let nameField = $('#form1_name').val();
    let codeField = $('#form1_code').val();
    nameField = nameField.replace(/^\s+|\s+$/g, '');
    codeField = codeField.replace(/^\s+|\s+$/g, '');
    let captcha = grecaptcha.getResponse();


    if (!nameField || !codeField) {
        message.html('<span style="color: #e80d0d">Некорректные данные</span>');
        grecaptcha.reset();
        setTimeout(function(){
            message.html('');
        }, 2000);
        return;
    };

    if (!captcha.length) {
        message.html('<span style="color: #e80d0d">Ты не человек?</span>');
        grecaptcha.reset();
        setTimeout(function(){
            message.html('');
        }, 2000);
        return;
    }
    $.ajax({
        url: "/api/",
        type: "POST",
        data: formNm.serialize(),
        cache: false,
        beforeSend: function() {
            $(':button').prop({ disabled: true }).css('cursor', 'no-drop');
            $('.user-form__preloader').css('display', 'block');
        },
        success: function(data){
            let response = JSON.parse(data);
            $('.user-form__preloader').css('display', 'none');
            $(':button').prop({ disabled: false }).css('cursor', 'auto');
            if(response.success){
                message.html('<span style="color: #3eb234">Ты молодец! Задание сменилось.</span>');
                // $(".event__date h2").html('Место:<span>#'+response.success.id_event+'</span>').css('background-color', '#c7f1ec');
                // $(".event__text li:nth-child(1) em").html(response.success.area).css('background-color', '#c7f1ec');
                // $(".event__text li:nth-child(2) em").html('до '+response.success.size+' см').css('background-color', '#c7f1ec');
                // $(".event__text li:nth-child(3) p").html(response.success.text).css('background-color', '#c7f1ec');
                // $(".pic").attr("src", response.success.url_img);
                init();
                $('#form1_code, #form1_name').val('');
                setTimeout(function(){
                    message.html('');
                    // $(".event__date h2").css('background-color', '#fff');
                    // $(".event__text li:nth-child(1) em").css('background-color', '#fff');
                    // $(".event__text li:nth-child(2) em").css('background-color', '#fff');
                    // $(".event__text li:nth-child(3) p").css('background-color', '#fff');
                }, 5000);


            } else {
                grecaptcha.reset();
                message.html('<span style="color: #e80d0d">'+ response.error +'</span>');
                $('#form1_code').val('');
                setTimeout(function(){
                    message.html('');
                }, 4000);
            }
        }
    });
    return false;
};

function countDown(data) {
    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
    let arr = data.split(/[- :]/);
    let countDown = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]).getTime(),
    //let countDown = new Date(data.replace(' ', 'T')).getTime(),
        currentTime = new Date().getTime(),
        distanceCheck = countDown - currentTime;

    if (distanceCheck < 0) {
        getCurrentEvent();
        $('.event__countDown').css('display', 'none');
        $('.event__date').css('display', 'block');
        $('.event__info').css('display', 'flex');
        return;
    }

    let x = setInterval(function() {


            let now = new Date().getTime(),
                distance = countDown - now;

            $('.event__countDown').css('display', 'block');
            $('.event__date').css('display', 'none');
            $('.event__info').css('display', 'none');

            document.getElementById('days').innerText = Math.floor(distance / (day)),
                document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)),
                document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
                document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

            if (distance < 0) {
             clearInterval(x);
                getCurrentEvent();

                $('.event__countDown').css('display', 'none');
                $('.event__date').css('display', 'block');
                $('.event__info').css('display', 'flex');
            }

        }, second)
};

function getCurrentEvent() {
    $.ajax({
        url: "/api/?current",
        type: "GET",
        cache: false,
        success: function(data){
            let response = JSON.parse(data);
            if(response.success){
                $(".event__date h2").html('Место:<span>#'+response.success.id_event+'</span>').css('background-color', '#c7f1ec');
                $(".event__text li:nth-child(1) em").html(response.success.area).css('background-color', '#c7f1ec');
                $(".event__text li:nth-child(2) em").html('до '+response.success.size+' см').css('background-color', '#c7f1ec');
                $(".event__text li:nth-child(3) p").html(response.success.text).css('background-color', '#c7f1ec');
                $(".pic").attr("src", response.success.url_img);
                setTimeout(function(){
                    $(".event__date h2").css('background-color', '#fff');
                    $(".event__text li:nth-child(1) em").css('background-color', '#fff');
                    $(".event__text li:nth-child(2) em").css('background-color', '#fff');
                    $(".event__text li:nth-child(3) p").css('background-color', '#fff');
                }, 2000);
            }
        }
    });
};

function init() {
    $.ajax({
        url: "/api/?dateStart",
        type: "GET",
        cache: false,
        success: function(data){
            countDown(data);
        }
    });
};

if (window.location.pathname === '/') init();

$(document).ready(function(){


    $(".btn-code").click(function(e){
        e.preventDefault();
        $("#form1").slideToggle(270);
    });

    $('.accordion > h4').next().hide();
    $('.accordion > h4').click(function(){
        $(this).next().slideToggle();
        $('.accordion > h4').not(this).next().stop(true,true).slideUp();
    });

});