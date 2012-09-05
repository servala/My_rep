/* ../../blocks/b-menu/b-menu.js: begin */ /**/

    $( document ).ready(function() {
        $( '.b-task4 button').on({
            'click': function(){
                alert( eval($(this).html()) )
            }
        })
        $('.b-menu').on({
            'mouseover': function(e){
                $(this).css('background', 'url(images/bkg_menu.gif) no-repeat');
            },
            'mouseout': function(e){
                $(this).css('background', '');
            },
            'mousemove': function(e){
                $( this ).css( 'background-position', '0 '+ parseInt(e.clientY/5)*5 + 'px')
                //console.log( e.clientY , e.offsetY)

            }
        });
        
        $ul = $('<ul></ul>').appendTo('.b-menu');

        var ufoClicked = false;
        $.each($( '.b-content i' ), function(){
          $('<li></li>').html( $(this).html() ).appendTo($ul).data('el', this).on({
            'mouseover': function(){
              $($(this).data( 'el')).click();
            },
            'mouseout': function(e){
                if (ufoClicked) {
                  ufoClicked = false;
                }
                else {
                  $($(this).data( 'el')).click();
                }
                  
            },
            'click': function(){
              ufoClicked = !ufoClicked;
            }
          });
        });
    });
/* ../../blocks/b-menu/b-menu.js: end */ /**/

/* ../../blocks/b-content/b-content.js: begin */ /**/
$('.e-content-item-bullet' ).on({
            'click': function(){
                var $t = $(this);
                if($t.parent().hasClass('act'))
                {
                    $t.parent().removeClass('act').find('.e-content-item-inner').slideUp('fast');
                }
                else
                {
                    $('.act').removeClass('act').find('.e-content-item-inner').slideUp("fast");
                    $t.parent().addClass( 'act' ).find('.e-content-item-inner').slideDown('fast');
                }
            }
    });
/* ../../blocks/b-content/b-content.js: end */ /**/

/* ../../blocks/b-swim/b-swim.js: begin */ /**/
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

/* ../../blocks/b-swim/b-swim.js: end */ /**/

/* ../../blocks/b-print/b-print.js: begin */ /**/

        function printPage(){
            $('#pr' ).hide();
        }

        $('.b-print button' ).on({
           'click':function(){
               $( 'span.for_print' ).hide();
               $( 'div.for_print' ).attr( 'style',' ')
               $( '.e-content-item-inner').css( 'display', 'block');
               var buttons = $('<div id="pr"><button onclick="$(\'#pr\' ).hide();window.print();$(\'#pr\' ).show();">Печатать</button>' +
                       '<button onclick="window.location.reload( true );" >Отменить</button></div>')
               var for_print = $('<div style="padding-bottom: 50px;"></div>').html( $( '.b-content').html() );
               $( 'head').html( ' <style type="text/css" >' +
                       'b, i{ display:block;} i{ font-size: 18px; margin: 15px 0 0 -20px; border-top: 1px dotted black;} ' +
                       'b{padding-top: 10px;} div{width: 800px; margin: 0 auto;}' +
                       '</style>' +
                       '<script type="text/javascript" src="http://code.jquery.com/jquery-1.8.1.js"><\/script> ' );
               $( 'body').html(  buttons );
               for_print.appendTo( 'body' );
           }
        });



/* ../../blocks/b-print/b-print.js: end */ /**/

