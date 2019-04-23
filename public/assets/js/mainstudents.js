$(document).ready(function(){
    console.log("READY");

    var _date;
    var _membership;
    var _expiration;

    var $membershipsSelect    = $("#memberships");
    var $startDateSelect      = $("#date");
    var $expirationDateSelect = $("#expiration");

    function getMemberships() {
        $.ajax({
            url: '/getmemberships',
            method: 'GET'
        }).then(function(result) {
            console.log(result);
            $.each(result, function() {
                $membershipsSelect.append(`<option value="${this.id}" >${this.description}</option>`);
            });
        });
    }
    
    getMemberships();
    $startDateSelect.datepicker();
    $expirationDateSelect.datepicker();

    $startDateSelect.change(function() {
        _date = $(this).val();
        console.log(_date);
    });

    $membershipsSelect.change(function() {
        _membership = $(this).val();
        console.log(_membership);
    });

    $expirationDateSelect.change(function() {
        _expiration = $(this).val();
        console.log(_expiration);
    });

    $('#btn-add-student').click(function(e) {
        e.preventDefault();

        let name           = $("#name").val();
        let lastName       = $("#lastName").val();
        let startDate      = new Date(_date).toISOString().slice(0, 10);
        let expirationDate = new Date(_expiration).toISOString().slice(0, 10);
        var status         = 1; // active

        var student_obj = {
            name                : name,
            last_name           : lastName,
            start_time          : startDate,
            membership_type     : _membership,
            membership_end_date : expirationDate
         };

        console.log(student_obj);

        $.ajax({
            url: '/addstudent',
            method: 'POST',
            data: student_obj
        }).then(function(message) {
            console.log(message);
            window.location.replace("/mainstudents"); // redirect to students main page (listing)
        }).fail(function(error) {
            console.log(error);
            if (error.status == 403) { // POST /addstudents returns Forbidden due to invalid session.
                alert("Session has expired. Will redirect to login page.");
                window.location.replace("/backdoor");
            }
        });
    });

    $('#btn-update-student').click(function(e) {
        console.log("UPDATE STUDENT");
        e.preventDefault();

        let name = $("#name").val();
        let lastName = $("#lastName").val();
        let date2 = $("#date").val();
        let uid = $("#userId").val();
        var date = new Date(date2).toISOString().slice(0, 10);;
        let expiration2 = new Date(expiration).toISOString().slice(0, 10);
        var status = 1;

        console.log({ name: name, last_name: lastName, started_date: date ,membership_type : membership, membership_end_date : expiration, id :uid});
        $.ajax({
            url: '/updatestudent',
            method: 'PUT',
            // [req.body.name, req.body.las_name, req.body.start_time, membership_type, membership_end_date];
            data: { name: name, last_name: lastName, started_date: date, membership_type : membership, membership_end_date : expiration2,  id :uid}
        }).then(function(message){
            //$('#message').text(message);
            console.log(message);
            //getCats();
            
        });
    });

});