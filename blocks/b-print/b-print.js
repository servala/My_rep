
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
               var for_print = $('<div ></div>').html( $( '.b-content').html() );
               $( 'head').html( ' <style type="text/css" >' +
                       'b, i{ display:block;} i{ font-size: 18px; margin: 15px 0 0 -20px; border-top: 1px dotted black;} ' +
                       'b{padding-top: 10px;} div{width: 800px; margin: 0 auto;}' +
                       '</style>' +
                       '<script type="text/javascript" src="http://code.jquery.com/jquery-1.8.1.js"><\/script> ' );
               $( 'body').html(  buttons );
               for_print.appendTo( 'body' );
           }
        });


