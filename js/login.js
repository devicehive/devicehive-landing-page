$(document).ready(function() {
    if($.cookie('visitor-passport') !== 'visitors-passport'){
        $.cookie('visitor-passport','visitors-passport', { expires: 365});
        var date = new Date;
        $('#signUpModal').modal('show');
    }

    /*$('#menuPlayground').bind("click", function(e){
        $('.menuOverlay').hide();
        $('.mainContent').toggleClass('hide');
        $('#loginModal').toggleClass('hide');
    });

    $('#loginBtn').bind("click", function(e){
        $('.mainContent').toggleClass('hide');
        $('#loginModal').toggleClass('hide');
    });

    $('#signupBtn').bind("click", function(e){
        $('.mainContent').toggleClass('hide');
        $('#loginModal').toggleClass('hide');
    });*/

});
