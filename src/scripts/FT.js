
$(document).ready(function(){
    $("#form1").submit(function (){
        var formID = $(this).attr('id');
        var formNm = $('#' + formID);
        var message = $(formNm).find(".form-pass__msg");

        $.ajax({
            url: "/api/",
            type: "POST",
            data: formNm.serialize(),
            cache: false,
            success: function(data){
                var response = JSON.parse(data)

                if(response.success){
                    //console.log(response);
                    message.html('<span style="color: #3eb234">Код принят! Ивент обновился.</span>');
                    $(".event__date h2").html('Ивент:<span>#'+response.success.id_event+'</span>').css('background-color', '#c7f1ec');
                    $(".event__text li:nth-child(1)").html('<b>Район поиска:</b>'+response.success.area).css('background-color', '#c7f1ec');
                    $(".event__text li:nth-child(2)").html('<b>Размер:</b>до '+response.success.size+'см').css('background-color', '#c7f1ec');
                    $(".event__text li:nth-child(3)").html('<b>Подсказка:</b><br><p>'+response.success.text+'</p>').css('background-color', '#c7f1ec');

                    $(".pic").attr("src", response.success.url_img);
                    $('#form1_code, #form1_name').val('');
                    setTimeout(function(){
                        message.html('')
                        $(".event__date h2").css('background-color', '#fff');
                        $(".event__text li:nth-child(1)").css('background-color', '#fff');
                        $(".event__text li:nth-child(2)").css('background-color', '#fff');
                        $(".event__text li:nth-child(3)").css('background-color', '#fff');
                    }, 5000);


                } else {
                    message.html('<span style="color: #e80d0d">'+ response.error +'</span>');
                    $('#form1_code').val('');
                    setTimeout(function(){
                        message.html('')
                    }, 4000);
                }
            }
        });
        return false;
    });

    $("#btn_code").click(function(e){
        e.preventDefault();
        $("#form1").slideToggle(270);
    });

    $('.event__issues > h4').next().hide();
    $('.event__issues > h4').click(function(){
        $(this).next().slideToggle();
        $('.event__issues > h4').not(this).next().stop(true,true).slideUp();
    });

});