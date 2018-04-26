
$(document).ready(function(){
    $("#form1").submit(function (){
        var formID = $(this).attr('id');
        var formNm = $('#' + formID);
        var message = $(formNm).find(".form-pass__msg");

        $.ajax({
            url: "/api/",
            //url: "test.php",
            type: "POST",
            //data: {"code": code},
            data: formNm.serialize(),
            cache: false,
            success: function(data){
                var response = JSON.parse(data)

                if(response.success){
                    console.log(response);
                    message.html('Ты молодец!! Смотри новый кейс');
                    $(".event__text li:nth-child(1)").html('<b>Размер:</b>до '+response.success.size+'см');
                    $(".event__text li:nth-child(2)").html('<b>Район поиска:</b>'+response.success.area);
                    $(".event__text li:nth-child(3)").html('<b>Подсказка:</b><br><p>'+response.success.text+'</p>');
                    $('#form1_code, #form1_name').val('');


                } else {
                    //message.html('<p>Неправильный код</p>');
                    message.html('<span style="color: #e80d0d">'+ response.error +'</span>');
                    $('#form1_code').val('');
                    /*$(".event__text li:nth-child(1)").html('<b>Размер:</b>недоступно');
                    $(".event__text li:nth-child(2)").html('<b>Район поиска:</b>недоступно');
                    $(".event__text li:nth-child(3)").html('<b>Подсказка:</b><br><p>недоступно</p>');*/
                }
            }
        });
        return false;
    });

    $("#btn_code").click(function(blablabla){
        blablabla.preventDefault();
        $("#form1").slideToggle("slow");
    });
});