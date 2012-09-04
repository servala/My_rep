   var swim_block_timer = 0;
    function b_swimAnimate() {
        $('.b-swim').stop(true).animate({top: $(window).scrollTop()});
    }
    $(window).scroll(function() {
        if (swim_block_timer){
            clearTimeout( swim_block_timer );
        }
        swim_block_timer = setTimeout( b_swimAnimate, 100 );
    });
