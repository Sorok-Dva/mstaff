let activeBtnLoader;

jQuery.each( [ "put", "delete" ], function( i, method ) {
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
    newest_on_top: false,
    showProgressbar: false,
    placement: {
      from: 'bottom',
      align: 'left'
    },
    offset: 20,
    spacing: 10,
    z_index: 1031,
    delay: 2500,
    timer: 10000,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    }
  });
};

let errorsHandler = errors => {
  errors = errors === undefined ? null : errors.responseJSON;
  if (errors && errors.errors) {
    errors.errors.forEach((e, i) => {
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
      : `Erreur inconnue.`;
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message
    });
  }
};

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
