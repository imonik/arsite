$(document).ready(function()
{
    console.log("READY!!");
    var $btnLogin = $('#btn-login');
    $("#message").text("")
    var re = /\S+@\S+\.\S+/;

    $btnLogin.on('click', function (e) {

        var message = "";
        
        if($('#password').val() == ""){
            message += 'Por favor ingrese el password\n';
        }else if($('#email').val() ==  ""){
            message += 'Por favor ingrese el correo\n';
        }else if (!re.test($('#email').val())){
            message += 'Por favor ingrese un correo valido\n';
        }

        if(message != ""){
            e.preventDefault();
            $("#message").text(message).fadeIn();
        }
    })
});
