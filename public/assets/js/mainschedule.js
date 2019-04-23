$(document).ready(function()
{
    var date;
    var start;
    var end;
    var instructor;
    var validated;

    var $className = $("#clase");
    var $instructorSelect= $("#instructor");
    var $dateSelect = $("#date");
    var $statTime = $("#start_time");
    var $endTime = $("#end_time");
    var uid = $("#hdnUid").val();
    var isEdit = $("#isEdit").val();
    var $hdnStart = $("#hdnStart");
    var $hdnEnd = $("#hdnEnd");
    var $hdnInstructor = $("#hdnInstructorId");
    $instructorSelect.append('<option value="" selected="selected">Instructor</option>');
    var message = "";

    getInstructors();
    $dateSelect.datepicker();

    function validateData(){
        validated = true;
        if(!$className.val()){
            validated = false;
            message += "Por favor ingrese el nombre\n";
        } else if(!$statTime.children("option:selected").val()) {
            validated = false;
            message += "Seleccione hora de inicio\n";
        } else if(!$endTime.children("option:selected").val()) {
            validated = false;
            message += "Seleccione hora de fin\n";
        } else if(!$instructorSelect.children("option:selected").val()) {
            validated = false;
            message += "Seleccione un instructor\n";
        } else if(!$dateSelect.val()){
            validated = false;
            message += "Por favor ingrese el nombre\n";
        }
    }

    $dateSelect.change(function() {
        //date = $(this).val();
        var convertedDate = new Date( $(this).val());
        date = convertedDate.toISOString().substring(0, 10);
        console.log(date);
    });

    $instructorSelect.change(function() {
        instructor = $(this).val();
    }); 

    $statTime.change(function() {
        start = $(this).children("option:selected").val();
    });

    $endTime.change(function() {
        end = $(this).children("option:selected").val();
    });

    $(".expand-collapse").click(function () {

        $header = $(this);
        //getting the next element
        $content = $header.next();
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(500, function () {
            //execute this after slideToggle is done
            //change text of header based on visibility of content div
            $header.html(function () {
                //change text based on condition
                return $content.is(":visible") ? "<h1><span>-</span></h1>" : "<h1><span>+</span></h1>";

            });
        });
    
    });

    function getInstructors() {
        $.ajax({
            url: '/getinstructors',
            method: 'GET'
        }).then(function(result) {
            $.each(result, function() {
                var instructor_id = $('#hdnInstructorId').val();
                $instructorSelect.append(`<option value="${this.id}" ${instructor_id==this.id ? 'selected' : ''}>${this.name}</option>`);
            });
        });
    }

    if(isEdit === "true"){
        selectDropdowns();
    }

    function selectDropdowns(){
        $('#start_time option').each(function(){
            let hdnStart = $hdnStart.val().substring(0,5);
            if (this.value == hdnStart) {
                $(this).attr('selected', true);
            }
        });

        $('#end_time option').each(function(){
            let hdnEnd = $hdnEnd.val().substring(0,5);
            if (this.value == hdnEnd) {
                $(this).attr('selected', true);
            }
        });

        $('#instructor option').each(function(){
            let hdnInstructor = $hdnInstructor.val();
            console.log(hdnInstructor);
            if (this.value == hdnInstructor) {
                $(this).attr('selected', true);
            }
        });
    }

    function clearAll(){

    }

    $('#btn-add-schedule').click(function(e) {
        e.preventDefault();

        validateData();
        if(!validated){
            $('#message').text(message);
            return;
        }

        let sched = { class_name: $className.val(), date:date, start: start + ":00" , end : end + ":00", instructor_id: instructor}

        $.ajax({
            url: '/schedule',
            method: 'POST',
            data: sched,
        }).then(function(message){
            window.location.replace("/mainschedule"); // redirect to schedules main page (listing)
        });
    });

    $('#btn-update-schedule').click(function(e) {
        e.preventDefault();

        if(!validated){
            $('#message').text(message);
            return;
        }

        let sched = { class_name: $className.val(), date:date, start: start + ":00" , end : end  + ":00", instructor_id: instructor, id:uid}
        console.log(sched);

        $.ajax({
            url: '/updateschedule',
            method: 'PUT',
            data: sched,
        }).then(function(message){
            window.location.replace("/mainschedule"); // redirect to schedules main page (listing)
        });
    });
});