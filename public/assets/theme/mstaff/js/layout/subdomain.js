$(document).ready(() => {

    $('body').css({paddingTop: $('.page-header').outerHeight() + 'px'});

    $(window).resize(function(){
        $('body').css({paddingTop: $('.page-header').outerHeight() + 'px'});
    });

});