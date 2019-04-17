$(document).ready(function()
{
    console.log("READY!!");
    // var email = $('#email').val();
    // var password = $('#password').val();
    var btnLogin = $('#btn-login');

    btnLogin.on('click', function (e) {
        e.preventDefault();
        console.log(`credentials ${ $('#email').val()} ${ $('#password').val()}`);

        $.ajax({
            url: '/login',
            data:{ email: $('#email').val(), password: $('#password').val() },
            method: 'POST'
        }).then(function(user){
            $('div').html(user);
            console.log("user!!!!!! " + user);
        });
    })
});
