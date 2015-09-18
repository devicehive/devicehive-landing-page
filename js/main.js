$(function(){
	// navigation
	$('.menuIco').click(function(){
		$('.menuOverlay').show();
	});
	$('.menuOverlay .close').click(function(){
		$('.menuOverlay').hide();
	});

	//fade in containers
	$(window).scroll( function(){
        $('.fadeInBlock').each( function(i){
            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            /* Adjust the "200" to either have a delay or that the content starts fading a bit before you reach it  */
            bottom_of_window = bottom_of_window + 350;
            if( bottom_of_window > bottom_of_object ){
                $(this).animate({'opacity':'1'},500);
            }
        });
    
    });

	/* tabs */
	$('.tabs li a:not(:first)').addClass('inactive');
	$('.tabCnt').hide();
	$('.tabCnt:first').show();

	$('.tabs li a').click(function(){
		var t = $(this).attr('id');
		if($(this).hasClass('inactive')){ //this is the start of our condition
			$('.tabs li a').addClass('inactive');
			$(this).removeClass('inactive');

			$('.tabCnt').hide();
			$('#'+ t + 'C').fadeIn('slow');
		}
	});

});