/* ../../blocks/b-search/b-search.js: begin */ /**/
var search = {
    collection: [],
    get: function(){
        if( !this.collection.length ){
            var c = this.collection;
            $.each( data.years, function(y){
                $.each( this.months, function(m){
                    $.each( this.days, function(d){
                        $.each( this.lectures, function(i){
                            if( this.history !== 'cancel' ){
                                if(( d + '' ).length === 1 ) d = '0' + d;
                                if(( m + '' ).length === 1 ) m = '0' + m;
                                c.push([[ y, m, d , i].join( '-' ), this.time, this.caption, this.author.name, this.description].join( ' ' ));
                            }
                        });
                    });
                });
            });
        }
        return this.collection.sort( function( a, b ){
            return a < b ? 1 : -1;
        });
    },
    reset: function(){
        this.collection.length = 0;
    },
    unpack: function( s ){
        var a = s.split(' '), b = a[ 0 ].split( '-' );
        var s = s.substr( 19 );
        return {
            d: parseInt( b[ 2 ], 10 ),
            m: parseInt( b[ 1 ], 10 ),
            y: b[ 0 ],
            time: a[ 1 ],
            words: s
        }
    },
    findGreaterNow: function() {
        var d = new Date();
        var day = d.getDate();
        var m = d.getMonth();
        if(( day + '' ).length === 1 ) day = '0' + day;
        if(( m + '' ).length === 1 ) m = '0' + m;
        var sd = [ d.getFullYear(), m, day ].join('-');
        var c = this.get();
        for( var i = 0, l = c.length - 1; i < l; i++ ){
            if(c[ i ] < sd) break;
        }
        return c[ i - 1 ] || '';
    },
    findWord: function( word ){
        word = word.toLowerCase();
        var c = this.get(), a = [];
        for( var i = 0, l = c.length; i < l; i++ ){
            if( c[ i ].toLowerCase().indexOf( word ) !== -1 ){
                a.push( this.unpack( c[ i ]));
            }
        }
        return a;
    }
}
$('.b-search-form').submit(function() {
    var search_results = search.findWord( $(this).find( 'input[name=text]' ).val() );
    $( '.b-search-content' ).html( '' ).css( 'display', 'block');
    if( !search_results.length ){
        var div = $( '<div></div>' ).addClass( 'b-search-content-title' ).html( 'Нет результатов =(' )
        $( '.b-search-content' ).append( div ).fadeOut(2000);
    } else {
        try{
            drawSearchList( search_results );
        } catch(e){}
    }
    return false;
})
function drawSearchList( search_results ){
    var bsc = $( '.b-search-content' ).html( '' );
    $( '<div></div>' ).addClass( 'b-search-content-title' ).text( search_results.length + ' - вот сколько совпадений! ')
        .appendTo( bsc );
    $( '.e-day-list,.e-lector-list,.b-day,.b-lecture' ).html( '' );
    $.each( search_results, function(){
        var i, l, lectures = data.years[ this.y ].months[ this.m ].days[ this.d ].lectures;
        for( i = 0, l = lectures.length; i < l; i++ ){
            if( lectures[ i ].time === this.time && this.words.indexOf( lectures[ i ].caption ) !== -1) {
                break;
            }
        }
        var span = $( '<span></span>').addClass('link').html( lectures[ i ].caption ).data( 'dateLecture', {
            'parent_obj': [ new Date(this.y, this.m, this.d), lectures],
            'number': i
        });
        $('<div></div>').addClass( 'b-search-list-final' ).append( span ).appendTo( bsc )
    });
}
$('.b-search-content').on('click', '.link', function(){
    var dataLecture  = $.data( $(this).get(0), 'dateLecture' );
    drawContent( dataLecture.parent_obj);
    $('.b-page_main_tb_l .i-draw-list-block').eq( dataLecture.number ).click();
});
/* ../../blocks/b-search/b-search.js: end */ /**/

/* ../../blocks/i-draw-content/i-draw-content.js: begin */ /**/
$( document ).ready( function(){
    drawCalendar( cur_month, cur_year );
});

function toLS( data ){
    localStorage.calendar = JSON.stringify( data );
    search.reset();
}

function fromLS(){
    if ( !localStorage.calendar ){
        toLS( calendar );
    }
    return JSON.parse( localStorage.calendar );
}

var data = fromLS();
var lectures = data.years[2012].months[8].days;
var flag = true;

var week_days = {
    1: [ 'пн','понедельник' ],
    2: [ 'вт','вторник' ],
    3: [ 'ср','среда' ],
    4: [ 'чт','четверг' ],
    5: [ 'пт','пятница' ],
    6: [ 'сб','суббота' ],
    7: [ 'вс', 'воскресенье']
},
    months = {
        0:  [ 'Январь','января' ],
        1:  [ 'Февраль','февраля' ],
        2:  [ 'Март','марта' ],
        3:  [ 'Апрель','апреля' ],
        4:  [ 'Май', 'мая' ],
        5:  [ 'Июнь','июня' ],
        6:  [ 'Июль','июля' ],
        7:  [ 'Август','августа' ],
        8:  [ 'Сентябрь','сентября' ],
        9:  [ 'Октябрь','октября' ],
        10: [ 'Ноябрь','ноября' ],
        11: [ 'Декабрь','декабря' ]
    },
    date_worker = {
        now: new Date(),
        get_first_day: function(m, y) {
            return new Date( y, m, 1 );
        },
        get_last_day: function(m, y) {
            var d = this.get_first_day( m + 1, y );
            d.setDate( 0 );
            return d;
        },
        get_week_day: function(date) {
            var day = date.getDay();
            return day === 0 ? 7 : day;
        },
        get_now_day: function(){
            return new Date(this.now);
        },
        is_current_month: function(m, y){
            return m === this.now.getMonth() && y === this.now.getFullYear();
        }
    },
    backup = '';

var cur_date = date_worker.get_now_day();
var cur_year = cur_date.getFullYear();
var cur_month = cur_date.getMonth();

function setMark( el, color ) {
    $( '<div></div>' ).addClass( 'mark' ).addClass( color ).appendTo( el );
    $( el ).css( 'cursor', 'pointer' );
}

function drawCalendar( m, y ) {
    var cur_start = date_worker.get_first_day( m, y );
    cur_month = cur_start.getMonth();
    cur_year = cur_start.getFullYear();
    var cur_end = date_worker.get_last_day( cur_month, cur_year );
    var cur_start_wday = date_worker.get_week_day( cur_start );
    var cur_end_wday = date_worker.get_week_day( cur_end );

    var is_show_date = date_worker.is_current_month( cur_month, cur_year );
    var show_date = cur_date.getDate();

    var cal = $( '.b-calendar' ).html('');
    var mon = $( '<div></div>' ).addClass( 'month' ).appendTo( cal );

    $( '<a></a>' ).attr('id', 'mon_p' ).text('->').appendTo( mon );
    $( '<a></a>' ).attr('id', 'mon_n' ).text('<-').appendTo( mon );
    $( '<span></span>' ).addClass( 'letter' ).text( months[ cur_month ][ 0 ].charAt(0)).appendTo( mon );
    $( '<span></span>' ).text( months[ cur_month ][ 0 ].substr( 1 ) + ' ' + cur_year ).appendTo( mon );
    // account free space
    for ( var i = 1 ; i < 8 ; i++ ){
        var div = $('<div></div>').addClass('week-day').text( week_days[ i ][ 0 ]);
        if ( i === 7 ){
            div.addClass( 'sunday' );
        }
        if( i > 5 ){
            div.addClass( 'red' );
        }
        mon.append( div );
    }
    for ( var i = 1 ; i < cur_start_wday ; i++ ){
        var div = $( '<div></div>' ).addClass( 'empty' );
        cal.append( div );
    }
    // account free space
    for( var i = 1, l = cur_end.getDate() ; i <= l ; i++ ){

        var mod7 = ( i - 1 + cur_start_wday ) % 7;
        var div = $( '<div></div>' ).attr( 'id', 'd_' + i + '_' + cur_month + '_' + cur_year ).text( i );
        if ( mod7 === 1 && ( i + 7 >= l )){
            div.addClass( 'angle' );
        } else if( mod7 === 0 ){
            div.addClass( 'sunday' );
            if ( i === l ){
                div.addClass( 'last' );
            }
        }

        if( is_show_date && i === show_date ){
            div.addClass( 'current' );
            if( flag ){
                var sd = search.findGreaterNow();
                if( !!sd ){
                    var d = search.unpack( sd );
                    if( !!d.d ){
                        drawContent([ new Date(d.y, d.m, d.d), data.years[ d.y ].months[ d.m ].days[ d.d ].lectures ]);
                    }
                } else {
                    drawContent( null )
                }
                flag =false;
            }
        }

        if( data.years && data.years[ y ] && data.years[ y ].months && data.years[ y ].months[ m ] && data.years[ y ].months[ m ].days[ i ]){
            var day = data.years[ y ].months[ m ].days[ i ];
            div.addClass( 'i-draw-content' );
            $( div ).data( 'dateLecture', [ new Date(y , m , i), day.lectures ]);
            setMark( $( div ).get(0), day.decoration );
        }
        cal.append( div );
    }

    for( var i = cur_end_wday + 1 ; i < 8; i++ ){
        var div = $( '<div></div>' ).addClass( 'empty' );
        if ( i === 7 ){
            div.addClass( 'last' ).addClass( 'sunday' );
        }
        cal.append( div );
    }
    $( '.b-list-lecture').html( ' ' );

    if( data.years && data.years[ y ] && data.years[ y ].months && data.years[ y ].months[ m ]){
        drawLectureList ( y, m )
    }else{
        $( '.b-list-lecture').html( ' Нет лекций ' );
    }
}

// right-list
function drawLectureList ( y, m ){
    $( '#print' ).show();
    $( '.b-search-content' ).html( '' )
    var blist = $( '.b-list-lecture')

    $.each( data.years[y].months[ m ].days, function( i ){
        var week_day = (new Date( y, m, i )).getDay() === 0 ? 7 : (new Date( y, m, i )).getDay();
        var title_text = i + ' ' + months[ m ][ 1 ] + ', ' + week_days[ week_day ][ 1 ];
        $( '<div></div>' )
            .addClass( 'b-list-lecture-title i-draw-content' )
            .text( title_text )
            .data( 'dateLecture', [ new Date( y , m , i ), data.years[y].months[ m ].days[i].lectures ])
            .appendTo( blist );
        var list = $( '<div></div>' ).addClass( 'b-list-lecture-list' ).appendTo( blist );
        $.each( this.lectures, function() {
            var in_list = $( '<p></p>' ).appendTo( list );
            if( !!this.history ){
                in_list.addClass( this.history );
            }
            var title_text
            switch( this.history  )
            {
                case 'red':
                    title_text = 'перенесено';
                    break;
                case 'cancel':
                    title_text = 'отменено';
                    break;
                default:
                    title_text = '';
            }
            $( '<span></span>').addClass( 'content' ).attr( 'title', title_text ).append( $( '<span></span>').text( this.caption ).addClass( !!this.description ? 'link' : '')).appendTo( in_list );
            $( '<span></span>' ).addClass( 'time' ).attr( 'title', title_text ).text( this.time ).appendTo( in_list );
        });
    });
}

function drawContent( dateLecture ){
    backup = dateLecture;
    if( !dateLecture ){
        $( '.b-day' ).html( 'Больше нет лекций' );
    }else{
        $( '.b-print' ).show();
        $( '.b-redactor-cancel' ).hide();
        $( '.b-search-content' ).html( '' );
        var date = dateLecture[ 0 ];
        var bdiv = $( '.b-day' ).html( '' )
        $( '.b-page-head' ).css( 'display' ,'none');

        var week_day = date.getDay();
        if( !week_day ) week_day =7;
        $( '<div></div>' ).addClass( 'b-day-title' )
            .append( $( '<span></span>' ).text( date.getDate() + ' ' + months[ date.getMonth()][ 1 ] + ' ' + date.getFullYear()))
            .append( week_days[ week_day ][ 1 ])
            .appendTo( bdiv );

        //lectures  we use for checked 'current'
        var list_lectures = $( '.e-day-list' ).html( '' );
        var list_lector = $( '.e-lector-list' ).html( '' );

        var id = ['l', date.getDate(), date.getMonth(), date.getFullYear()].join('_');
        $.each( dateLecture[ 1 ], function(){
            var p = $( '<p></p>' ).text( this.time ).addClass( this.history === 'cancel' ?'cancel':'').appendTo( list_lectures );
            $( '<span></span>' ).addClass( !!this.description ? 'link i-draw-list-block' : 'i-draw-list-block' ).text( this.caption ).data( 'lecture', this ).attr( 'id', id ).appendTo( p );
            var span = $( '<span></span>' ).addClass( !!this.author.link ? 'link' : '' ).text( this.author.name ).data( 'link' , this.author.link);
            $( '<p></p>' ).append( span ).appendTo( list_lector );
        });
        $( '.b-page-head' ).fadeIn(1000);
        $( '.b-lecture' ).html( '' );
    }
}

function drawLectureBody( data ){
    var blog_lecture = $( '.b-lecture' ).html( '' ).css( 'display', 'none');

    $( '<div></div>' ).addClass( 'b-lecture-title' ).addClass( data.history === 'cancel' ?'cancel':'').text( data.caption ).appendTo( blog_lecture );
    $( '<div></div>' ).addClass( 'b-lecture-autor' ).text( data.author.name ).appendTo( blog_lecture );
    $( '<div></div>' ).addClass( 'b-lecture-content' ).html( (!!data.description)?data.description:'' ).appendTo( blog_lecture );
    if( !!data.presentation ){
        $( '<div></div>' ).addClass( 'b-lecture-link' ).html('<a href="' + data.presentation + '" target="_blank">Презентация</a>').appendTo( blog_lecture )
    }
    if( !!data.video[ 0 ] ){
        $( '<div></div>' ).addClass( 'b-lecture-link' ).html('<a href="' + data.video[ 0 ] + '" target="_blank">Видео</a>').appendTo( blog_lecture )
    }
    if( !!data.video[ 1 ] ){
        $( '<div></div>' ).addClass( 'b-lecture-link' ).html('<a href="' + data.video[ 1 ] + '" target="_blank">Скачать видео</a>').appendTo( blog_lecture )
    }
    blog_lecture.fadeIn(1000);
}

//travel in calendar
$( '#mon_p' ).live( 'click', function(){
    drawCalendar( cur_month + 1, cur_year );
});
$( '#mon_n' ).live( 'click', function(){
    drawCalendar( cur_month - 1, cur_year );
});

//события
$('.b-page_main_tb_r').on('click', '.i-draw-content', function(){
    drawContent( $(this).data( 'dateLecture' ));
});
$('.b-page_main_tb_l').on('click', '.i-draw-list-block', function(){
    var d = $(this).data( 'lecture' )
    //if( d.history !== 'cancel' ){
    drawLectureBody( $(this).data( 'lecture' ));
    //}
});
$('.b-list-lecture').on('click', 'p', function(){
    $(this).parent().prev('.i-draw-content').click();
    $('.b-page_main_tb_l .i-draw-list-block').eq( $(this).parent().find('p').index(this)).click();
});
$('.e-lector-list').on('click', '.link', function(){
    window.open( $(this).data('link' ));
});
/* ../../blocks/i-draw-content/i-draw-content.js: end */ /**/

/* ../../blocks/b-redactor/b-redactor.js: begin */ /**/
$(document).ready(function(){
    $('.b-calendar').on({
        'contextmenu': function(e){
            e.preventDefault();
            var a = this.id.split( '_' );
            drawRedactor( a[ 1 ], a[ 2 ], a[ 3 ]);
            return false;
        },
        'selectstart': function(){
            return false;
        }
    }, 'div[id^="d_"]');
    $('.b-page_main_tb').on({
        'contextmenu': function(e){
            e.preventDefault();
            var a = this.id.split( '_' );
            drawRedactor( a[ 1 ], a[ 2 ], a[ 3 ], $(this).data( 'lecture' ));
            return false;
        },
        'selectstart': function(){
            return false;
        }
    }, '.i-draw-list-block');
});

function drawRedactor( d, m, y, edit ){
    $('.b-redactor-cancel').show();
    $( '.b-search-content, .e-day-list, .e-lector-list, .b-lecture, .b-search-content' ).html( '' );
    $( '.b-print' ).hide();
    var bdiv = $( '.b-day' ).html( '' );

    $( '<div></div>' ).addClass( 'b-day-title' ).append($( '<span></span>' ).text([ d, months[ m ][ 1 ], y ].join( ' ' ))).appendTo( bdiv );
    var div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
    $( '<label for="hour">Время</label>' ).add( '<select id="hour"></select>' ).add( '<select id="min"></select>' ).appendTo( div );
    hourSelect = $('#hour');
    $.each([ '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], function(){
        $('<option></option>').text(this).attr('value',this).appendTo(hourSelect)
    });
    minSelect = $('#min');
    $.each([ '00', '15', '30', '45' ], function(){
        $('<option></option>').text(this).attr('value',this).appendTo(minSelect)
    });
    div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
    $( '<label for="caption">Лекция *</label>' ).add( '<input id="caption" />' ).appendTo( div );
    div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
    $( '<label for="ltype">Тип</label>' ).add( '<select id="ltype"></select>' ).appendTo( div );
    ltypeSelect = $('#ltype');
    $.each([ 'blue', 'orange', 'yellow' ], function(){
        $('<option></option>').text(this).attr('value',this).css('color', this).appendTo(ltypeSelect)
    });
    div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
    $( '<label for="description">О лекции</label>' ).add( '<textarea id="description"></textarea>' ).appendTo( div );
    div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
    $( '<label for="author">Лектор *</label>' ).add( '<input id="author" />' ).appendTo( div );
    div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
    $( '<label></label>' ).add('<input type="button" class="b-redactor-del" value="Поломать" />').add( '<input type="button" class="b-redactor-save" value="Созидать" />' ).appendTo( div );
    if( !!edit ){
        $( '.b-redactor-del' ).click( function(){
            deleteLecture( d, m, y, edit );
        });
        // full filds
        $( '#caption' ).val( edit.caption );
        $( '#ltype' ).val( edit.history );
        $( '#description' ).val( edit.description );
        $( '#author' ).val( edit.author.name );
    }
    else {
        $( '.b-redactor-del' ).prop( 'disabled', true ).css({
            'background': '-webkit-linear-gradient(top, silver, gray)',
            'color': 'gray'
        });
    }
    $( '.b-redactor-save' ).click( function(){
        if( verifyForm() ){
            alert( 'Заполните поля со *' );
        }
        else {
            storyLecture( d, m, y, edit );
        }
    });
}
function verifyForm(){
    return $('#caption').val() === '' || $( '#author' ).val() === '';
}
function deleteLecture( d, m, y, edit ){
    if( !edit ) return;
    edit.history = 'cancel';
    toLS( data );
    drawCalendar( m, y );
    drawContent([ new Date(y, m, d), data.years[ y ].months[ m ].days[ d ].lectures ]);
    drawLectureBody( edit );
    $( '#print' ).show();
}
function storyLecture( d, m, y, edit ){
    if( !edit ) {
        if( !data ){
            data = { 'years': {}};
        }
        if( !data.years[ y ]) {
            data.years[ y ] = { 'months': {}};
        }
        if( !data.years[ y ].months[ m ]){
            data.years[ y ].months[ m ] = { 'days': {}};
        }
        if( !data.years[ y ].months[ m ].days[ d ]){
            data.years[ y ].months[ m ].days[ d ] = { 'decoration': 'orange', 'lectures': []}
        }
        l = data.years[ y ].months[ m ].days[ d ].lectures;
        edit = l[ l.length ] = {};
    }
    edit.time = $('#hour').val() + ':' + $('#min').val();
    edit.caption = $( '#caption' ).val();
    if(!edit.author){
        edit.author = {};
    }
    if(!edit.video){
        edit.video = [ null,null ];
    }
    edit.author.name = $('#author').val();
    edit.description = $('#description').val();
    data.years[ y ].months[ m ].days[ d ].decoration = $('#ltype').val();
    data.years[ y ].months[ m ].days[ d ].lectures.sort(function(a,b){
        var at = a.time.split(':'), bt = b.time.split(':');
        return ( parseInt( at[ 0 ], 10 ) * 100 + parseInt( at[ 1 ], 10 )) - ( parseInt( bt[ 0 ], 10 ) * 100 + parseInt( bt[ 1 ], 10 ));
    });
    toLS( data );
    drawCalendar( m, y );
    drawContent([ new Date(y, m, d), data.years[ y ].months[ m ].days[ d ].lectures ]);
    drawLectureBody( edit );
    $( '#print' ).show();
}
$('.b-redactor-cancel').on( 'click', function(){
    drawContent( backup );
})

/* ../../blocks/b-redactor/b-redactor.js: end */ /**/

/* ../../blocks/b-print/b-print.js: begin */ /**/
$('.b-print').on('click', function(){
    frm = $('#print_frame').get(0).contentWindow;
    frm.document.body.innerHTML = '';

    var css_for_print = '<style>' +
        '.b-lecture-title{font-size: 20px; margin: 20px 0 10px 0}'+
        '.b-lecture-autor{margin-top: 3px;}'+
        '.b-lecture-content{ padding: 25px 10px 0 40px;}' +
        '.w320{ width: 320px;}.e-day-list{padding-left: 40px;}'+
        '.b-day-title{font-size: 12px; margin-botom:20px;}'+
        '.b-day-title span{ font-size: 20px;padding-right: 5px;}'+
        '</style>';

    $(frm.document.head).append( css_for_print );
    $( '.b-page_main_tb_l>*:not(.b-print,iframe)').clone().appendTo(frm.document.body);
    frm.print();
});
/* ../../blocks/b-print/b-print.js: end */ /**/

