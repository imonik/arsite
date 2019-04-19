$(document).ready(function()
{
    var date;
    var start;
    var end;
    var instructor;


    var $instructorSelect= $("#instructor");
    var $dateSelect = $("#date");
    var $statTime = $("#start_time");
    var $endTime = $("#end_time");

    $dateSelect.change(function() {
        date = $(this).val();
        console.log(date); 
    });

    $instructorSelect.change(function() {
        instructor = $(this).val();
        console.log(instructor);
    }); 


    $statTime.change(function() {
        start = $(this).children("option:selected").val();
        console.log(start); 
    });

    $endTime.change(function() {
        end = $(this).children("option:selected").val();
        console.log(end);
    });

    getInstructors();
    $dateSelect.datepicker();


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
                var instructor_id = $('#hdn-instructor-id').val();
                $instructorSelect.append(`<option value="${this.id}" ${instructor_id==this.id ? 'selected' : ''}>${this.name}</option>`);
            });
        });
    }


    $('#btn-add-schedule').click(function(e) {
        e.preventDefault();

        let className = $("#clase").val();
        let date2 = new Date(date).toISOString().slice(0, 10);
        var status = 1;

        $.ajax({
            url: '/schedule',
            method: 'POST',
            data: { class_name: className, start_time: date2 + " " + start , end_time: date2 + " " + end, instructor_id: instructor, status: status }
        }).then(function(message){
            //$('#message').text(message);
            console.log(message);
            //getCats();
        });
    });

});