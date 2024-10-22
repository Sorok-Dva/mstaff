let activeBtnLoader;

jQuery.each([ 'put', 'patch', 'delete' ], (i, method) => {
  jQuery[ method ] = (url, data, callback, type) => {
    if (jQuery.isFunction(data)) {
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

let debug = (data) => {
  let debugEnable = $('meta[name="debug"]').attr('content');
  if (debugEnable === 'false') return false;
  console.time('debug finished in');
  console.log('%c [DEBUG] :', 'color: orange; font-weight: bold', data);
  console.trace('StackTrace');
  if (typeof data === 'object') console.table(data);
  console.timeEnd('debug finished in');
};

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
  debug(data);
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

let catchError = (xhr, status, error) => {
  debug({xhr, status, error});
  let title, message;
  switch (error) {
    case 'Bad Request':
      title = 'Mauvaise requête.';
      break;
    case 'Internal Server Error':
      title = 'Une erreur interne est survenue';
      if (xhr.responseJSON) {
        if (typeof xhr.responseJSON.message === 'object') {
          switch (xhr.responseJSON.message.name) {
            case 'SequelizeForeignKeyConstraintError':
              message = `ForeignKeyConstraintError: ${xhr.responseJSON.message.original.sqlMessage}`;
              break;
            default:
              message = xhr.responseJSON.message.sqlMessage;
          }
        } else if (typeof xhr.responseJSON.message === 'string') {
          message = xhr.responseJSON.message;
        }
      }
      break;
    case 'Forbidden':
      title = 'Accès non autorisé :';
      message = 'Vous n\'avez pas accès à cette page.';
      break;
    case 'Not Found':
      title = xhr.responseJSON ? xhr.responseJSON.message : 'Page introuvable';
      break;
    case 'Request Time-out':
      title = 'Requête expirée.';
      break;
    case 'Unauthorized':
      title = 'Accès non autorisé.';
      break;
    // First mstaff easter-egg, thanks RFC 2324 :D
    case 'I’m a teapot':
      title = 'Je suis une théière :D';
      break;
    case '':
      title = 'Connexion perdue :';
      message = 'La connexion entre votre ordinateur et Mstaff est actuallement impossible. Veuillez vérifier votre connexion ou réessayer dans quelques minutes.';
      break;
    default:
      title = xhr.responseJSON ? xhr.responseJSON.name : `Erreur inconnue (erreur HTTP ${error})`;
      message = xhr.responseJSON ? xhr.responseJSON.message : null;
  }
  if (!_.isNil(title)) {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title,
      message
    });
  }
};

let loadTemplate = (url, data, callback) => {
  if (data.partials) {
    for (let i = 0; i < data.partials.length; i++) {
      $.ajax({ url: `/views/partials/${data.partials[i]}.hbs`, cache: true, success: (source) => {
        Handlebars.registerPartial(`${data.partials[i]}`, source);
      }}).catch((xhr, status, error) => {
        $('#loadingModal').modal('hide');
        catchError(xhr, status, error)
      });
    }
  }
  $.ajax({ url, cache: true, success: (source) => {
    if (data.modal) {
      $.ajax({ url: `/views/modals/partials/${data.modal}.hbs`, cache: true, success: (modal) => {
        Handlebars.registerPartial(`${data.modal}`, modal);
        let template = Handlebars.compile(source);
          return callback(template(data));
      }}).catch((xhr, status, error) => {
        $('#loadingModal').modal('hide');
        catchError(xhr, status, error);
      });
    } else {
      let template = Handlebars.compile(source);
      return callback(template(data));
    }
  }}).catch((xhr, status, error) => {
    $('#loadingModal').modal('hide');
    catchError(xhr, status, error);
  });
};

let createModal = (opts, callback) => {
  $('#loadingModal').modal({
    backdrop: 'static',
    keyboard: false
  });
  if ($(`#${opts.id}`).length > 0) {
    $(`#${opts.id}`).modal('hide');
    $(`#${opts.id}`).remove();
  }
  loadTemplate('/views/modals/main.hbs', opts, (html) => {
    $('body').append(html);
    $('#loadingModal').modal('hide');
    if ('cantBeClose' in opts) {
      if (opts.cantBeClose) {
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

//Jquery AC Scroll
!function(t,e){"use strict";t.widget("ui.autocomplete",t.ui.autocomplete,{_resizeMenu:function(){var t,e,o,i;isNaN(this.options.maxShowItems)||(t=this.menu.element.scrollLeft(0).scrollTop(0).css({overflowX:"",overflowY:"",width:"",maxHeight:""}),e=t.children("li").css("whiteSpace","nowrap"),e.length>this.options.maxShowItems&&(o=t.prop("clientWidth"),t.css({overflowX:"hidden",overflowY:"auto",maxHeight:e.eq(0).outerHeight()*this.options.maxShowItems+1}),i=o-t.prop("clientWidth"),t.width("+="+i)),t.outerWidth(Math.max(t.outerWidth()+1,this.element.outerWidth())))}})}(jQuery);