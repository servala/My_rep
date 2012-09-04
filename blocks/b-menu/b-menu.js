
    $( document ).ready(function() {
        $( '.b-task4 button').on({
            'click': function(){
                alert( eval($(this).html()) )
            }
        })
        $('.b-menu').on({
            'mouseover': function(e){
                $(this).css('background', 'url(img/bkg_menu.gif) no-repeat');
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