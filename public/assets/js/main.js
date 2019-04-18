$(document).ready(function()
{
    console.log('READY IN MAIN');
    getInstructors();
    $('#date').datepicker();
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
        }).then(function(result){
            // for (var i in schedule) {
            //     var p = $('<li>');
            //     p.text(`id: ${cats[i].id}, cat name: ${cats[i].cat_name}`);
            //     var a = $('<a>');
            //     a.text('delete');
            //     a.attr('href', '/cats-delete?cat_id='+cats[i].id)
            //     p.append(a);
            //     $('div').append(p);
            // }

            var $dropdown = $("#instructor");
            $.each(result, function() {
            $dropdown.append($("<option />").val(this.id).text(this.name));
            });

            console.log(schedule);
        });
    }


    $('#btn-add-schedule').click(function(e) {
        e.preventDefault();
        var className = "Aerial2";
        var start = "2019-04-18 09:30:00";
        var end ="2019-04-18 10:30:00";
        var instructor = 1;
        var status = 1;
        console.log("la data aqui" +JSON.stringify( { class_name: className, start_time : start, end_time : end, instructor_id : instructor, status :  status }));
        $.ajax({
            url: '/schedule',
            method: 'POST',
            data: { class_name: className, start_time: start, end_time: end, instructor_id: instructor, status: status }
        }).then(function(message){
            //$('#message').text(message);
            console.log(message);
            //getCats();
        });
    });

});