function adjustLayout(options){

    $(document).ready(() => {

        _adjustLayout(options);

        $(window).resize(function(){
            _adjustLayout(options);
        });

    });

}

function _adjustLayout(options){
    if(!options.selector)
        throw Error();

    let height = window.innerHeight;
    if(options.hasPageHeader){
        height -= $('.page-header').outerHeight();
    }
    if(options.hasPageBanner){
        height -= $('.page-banner').outerHeight();
    }
    if(options.hasPageFooter){
        height -= $('.page-footer').outerHeight();
    }

    if(height <= 0) return;

    $(options.selector)
        .css({
            minHeight: height + 'px'
        });

}
