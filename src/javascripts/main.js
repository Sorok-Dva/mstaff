let activeBtnLoader;

jQuery.each([ 'put', 'patch', 'delete' ], function ( i, method ) {
  jQuery[ method ] = function ( url, data, callback, type ) {
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
      headers: data.headers,
      success: callback
    });
  };
});

let notification = (opts) => {
  $.notify({
    icon: `fal fa-${opts.icon}`,
    title: `<b>${opts.title}</b>`,
    message: `${opts.message || ''}`,
  }, {
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
    z_index: 9999999999,
    delay: opts.timer || 5000,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
    onClosed: opts.onClosed
  });
};

let errorsHandler = data => {
  if (_.isNil(data.responseJSON)) {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message: data.responseText
    });
  } else {
    let error = data === undefined ? null : data.responseJSON;
    if (error.errors) {
      error.errors.forEach((e, i) => {
        notification({
          icon: 'exclamation',
          type: 'danger',
          title: 'Champ invalide :',
          message: `${e.param}`
        });
      });
    } else {
      let message = error.sequelizeError ?
        `<b>${errors.sequelizeError.name}</b>: ${errors.sequelizeError.original.sqlMessage}`
        : error.message || error || 'Unknown Error';
      message = (typeof message === 'object') ? message.name : message;
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Une erreur est survenue :',
        message
      });
    }
  }
};

let loadTemplate = (url, data, callback) => {
  if (data.partials) {
    for (let i = 0; i < data.partials.length; i++) {
      $.ajax({ url: `/static/views/partials/${data.partials[i]}.hbs`, cache: true, success: function (source) {
        Handlebars.registerPartial(`${data.partials[i]}`, source);
      } });
    }
  }
  $.ajax({ url, cache: true, success: function (source) {
    if (data.modal) {
      $.ajax({ url: `/static/views/modals/partials/${data.modal}.hbs`, cache: true, success: function (modal) {
        Handlebars.registerPartial(`${data.modal}`, modal);
        let template = Handlebars.compile(source);
        return callback(template(data));
      } });
    } else {
      let template = Handlebars.compile(source);
      return callback(template(data));
    }
  } });
};

let createModal = (opts, callback) => {
  $(`#${opts.id}`).remove();
  loadTemplate('/static/views/modals/main.hbs', opts, (html) => {
    $('body').append(html);
    if ('canBeClose' in opts) {
      if (opts.canBeClose) {
        $(`#${opts.id}`).modal({
          backdrop: 'static',
          keyboard: false
        });
      } else $(`#${opts.id}`).modal();
    } else $(`#${opts.id}`).modal();
    if (callback) return callback();
  });
};

$(document).ready(function () {
  $('body').prepend('<div id="dialog"></div>');
  $('#dialog').dialog({
    autoOpen: false,
    show: { effect: 'fade' },
    hide: { effect: 'fade' },
    modal: true,
    width: 650,
    position: { my: 'top', at: 'top+150' },
    close: (event, ui) => $('#wrap').show(),
    open: (event, ui) => {
      $('.ui-widget-overlay').bind('click', () => {
        $('#dialog').dialog('close');
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
    setTimeout(function () {
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

  $('.stop-step').click(function (e) {
    history.back()
  });
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});