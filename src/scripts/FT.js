
$(document).ready(function(){
    $("#form1").submit(function (){
        const formID = $(this).attr('id');
        const formNm = $('#' + formID);
        const message = $(formNm).find(".user-form__msg");

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
                    message.html('<span style="color: #3eb234">Ты молодец! Ивент сменился.</span>');
                    $(".event__date h2").html('Ивент:<span>#'+response.success.id_event+'</span>').css('background-color', '#c7f1ec');
                    $(".event__text li:nth-child(1) em").html(response.success.area).css('background-color', '#c7f1ec');
                    $(".event__text li:nth-child(2) em").html('до '+response.success.size+' см').css('background-color', '#c7f1ec');
                    $(".event__text li:nth-child(3) p").html(response.success.text).css('background-color', '#c7f1ec');
                    $(".pic").attr("src", response.success.url_img);
                    $('#form1_code, #form1_name').val('');
                    setTimeout(function(){
                        message.html('');
                        $(".event__date h2").css('background-color', '#fff');
                        $(".event__text li:nth-child(1) em").css('background-color', '#fff');
                        $(".event__text li:nth-child(2) em").css('background-color', '#fff');
                        $(".event__text li:nth-child(3) p").css('background-color', '#fff');
                    }, 5000);


                } else {
                    message.html('<span style="color: #e80d0d">'+ response.error +'</span>');
                    $('#form1_code').val('');
                    setTimeout(function(){
                        message.html('');
                    }, 4000);
                }
            }
        });
        return false;
    });

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