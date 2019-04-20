$(document).ready(function(){
    console.log("READY");

    var date;
    var membership;
    var expiration;

    var $membershipsSelect = $("#memberships");
    var $dateSelect = $("#date");
    var $expiration = $("#expiration");

    function getMemberships() {
        $.ajax({
            url: '/getmemberships',
            method: 'GET'
        }).then(function(result) {
            console.log(result);
            $.each(result, function() {
                //${instructor_id==this.id ? 'selected' : ''}
                $membershipsSelect.append(`<option value="${this.id}" >${this.description}</option>`);
            });
        });
    }
    
    getMemberships();
    $dateSelect.datepicker();
    $expiration.datepicker();

    $dateSelect.change(function() {
        date = $(this).val();
        console.log(date); 
    });

    $membershipsSelect.change(function() {
        membership = $(this).val();
        console.log(membership); 
    });

    $expiration.change(function() {
        expiration = $(this).val();
        console.log(date); 
    });

    $('#btn-add-student').click(function(e) {
        e.preventDefault();

        let name = $("#name").val();
        let lastName = $("#lastName").val();
        let date2 = new Date(date).toISOString().slice(0, 10);
        let expiration2 = new Date(expiration).toISOString().slice(0, 10);
        var status = 1;

        console.log({ name: name, last_name: lastName, start_time: date2,membership_type : membership, membership_end_date : expiration });
        $.ajax({
            url: '/addstudent',
            method: 'POST',
            // [req.body.name, req.body.las_name, req.body.start_time, membership_type, membership_end_date];
            data: { name: name, last_name: lastName, start_time: date2,membership_type : membership, membership_end_date : expiration2 }
        }).then(function(message){
            //$('#message').text(message);
            console.log(message);
            //getCats();
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
            data: { name: name, last_name: lastName, start_time: date2,membership_type : membership, membership_end_date : expiration2,  id :uid}
        }).then(function(message){
            //$('#message').text(message);
            console.log(message);
            //getCats();
            
        });
    });

});