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