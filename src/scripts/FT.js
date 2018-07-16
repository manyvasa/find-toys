
const bIdEvent = $(".event__date h2"),
    fieldArea = $(".event__text li:nth-child(1) em"),
    fieldSize = $(".event__text li:nth-child(2) em"),
    fieldText = $(".event__text li:nth-child(3) p"),
    fieldImg = $(".pic");

const headAccordion = $('.accordion > h4');


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
                init();
                $('#form1_code, #form1_name').val('');

                setTimeout(function(){
                    message.html('');
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
        day = hour * 24,
        bCountDown = $('.event__countDown'),
        bDate = $('.event__date'),
        bInfo = $('.event__info');

    let arr = data.split(/[- :]/);
    let countDown = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]).getTime(),
        currentTime = new Date().getTime(),
        distanceCheck = countDown - currentTime;

    if (distanceCheck < 0) {
        getCurrentEvent();
        bCountDown.css('display', 'none');
        bDate.css('display', 'block');
        bInfo.css('display', 'flex');
        return;
    }

    let x = setInterval(function() {

            let now = new Date().getTime(),
                distance = countDown - now;

            bCountDown.css('display', 'block');
            bDate.css('display', 'none');
            bInfo.css('display', 'none');

            document.getElementById('days').innerText = Math.floor(distance / (day)),
                document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)),
                document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
                document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

            if (distance < 0) {
             clearInterval(x);
                getCurrentEvent();

                bCountDown.css('display', 'none');
                bDate.css('display', 'block');
                bInfo.css('display', 'flex');
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

                bIdEvent.html('Место:<span>#'+response.success.id_event+'</span>').css('background-color', '#c7f1ec');
                fieldArea.html(response.success.area).css('background-color', '#c7f1ec');
                fieldSize.html('до '+response.success.size+' см').css('background-color', '#c7f1ec');
                fieldText.html(response.success.text).css('background-color', '#c7f1ec');
                fieldImg.attr("src", response.success.url_img);

                setTimeout(function(){

                    bIdEvent.css('background-color', '#fff');
                    fieldArea.css('background-color', '#fff');
                    fieldSize.css('background-color', '#fff');
                    fieldText.css('background-color', '#fff');
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

    headAccordion.next().hide();
    headAccordion.click(function(){
        $(this).next().slideToggle();
        headAccordion.not(this).next().stop(true,true).slideUp();
    });

});