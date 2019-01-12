let activeBtnLoader;

jQuery.each([ 'put', 'delete' ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

let notification = (opts) => {
  $.notify({
    // options
    icon: `fa fa-${opts.icon}`,
    title: `<b>${opts.title}</b>`,
    message: `${opts.message}`,
  },{
    type: `${opts.type}`,
    allow_dismiss: true,
    newest_on_top: true,
    showProgressbar: true,
    placement: {
      from: 'bottom',
      align: 'left'
    },
    offset: 20,
    spacing: 10,
    z_index: 1031,
    delay: opts.timer || 5000,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    }
  });
};

let errorsHandler = data => {
  let errors = data === undefined ? null : data;
  if (errors && errors.responseJSON && errors.responseJSON.errors) {
    errors.responseJSON.errors.forEach((e, i) => {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Champ invalide :',
        message: `${e.param}`
      });
    });
  } else {
    let message = (errors && errors.sequelizeError) ?
      `<b>${errors.sequelizeError.name}</b>: ${errors.sequelizeError.original.sqlMessage}`
      : errors;
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message
    });
  }
};

let nextTab = elem => $(elem).next().find('a[data-toggle="tab"]').click();
let prevTab = elem => $(elem).prev().find('a[data-toggle="tab"]').click();

$(document).ready(function() {
  $('body').prepend('<div id="dialog"></div>');
  $("#dialog").dialog({
    autoOpen: false,
    show: { effect: 'fade' },
    hide: { effect: 'fade' },
    modal: true,
    width: 650,
    position: { my: 'top', at: 'top+150' },
    close: (event, ui) => $('#wrap').show(),
    open: (event, ui) => {
      $('.ui-widget-overlay').bind('click', () => {
        $("#dialog").dialog('close');
      });
    }
  });

  $(document).on('click', '.btn-loader', (e) => {
    let $this = $(e.target);
    activeBtnLoader = $this;
    let loadingText = $this.attr('data-loading-text');
    if ($this.html() !== loadingText) {
      $this.data('original-text', $this.html());
      $this.html(loadingText);
    }
    setTimeout(function() {
      $this.html($this.data('original-text'));
    }, 10000);
  });

  //Initialize tooltips
  $('.nav-tabs > li a[title]').tooltip();

  //Wizard
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    let $target = $(e.target);
    if ($target.parent().hasClass('disabled')) {
      return false;
    }
  });

  $(".next-step").click(function (e) {
    let $active = $('.wizard .nav-tabs li.active');
    $active.next().removeClass('disabled');
    nextTab($active);
  });

  $(".prev-step").click(function (e) {
    let $active = $('.wizard .nav-tabs li.active');
    prevTab($active);
  });
});