$(document).ready(function() {

    // var visit_counter = $.cookie('_v_count');

    // if (visit_counter === '0') {
    //     $('#signUpModal').modal('show');
    // }

    // if (!isNaN(parseInt(visit_counter))) {
    //     visit_counter++;
    // }
    // else visit_counter = 0;

    // $.cookie('_v_count', visit_counter, { expires: 365});

    $('#menuContactUs').bind("click", function(e){
        $('.menuOverlay').hide();
        $('#contactModal').modal('show');
     });

    $('#askHow').bind("click", function(e){
        $('.menuOverlay').hide();
        $('#contactModal').modal('show');
    });
});
