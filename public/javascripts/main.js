let activeBtnLoader;

jQuery.each([ 'put', 'patch', 'delete' ], function( i, method ) {
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
      headers: data.headers,
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

let loadTemplate = (url, data, callback) => {
  if (data.partials) {
    for (let i = 0; i < data.partials.length; i++) {
      $.ajax({url: `/static/views/partials/${data.partials[i]}.hbs`, cache: true, success: function(source) {
        Handlebars.registerPartial(`${data.partials[i]}`, source);
      }});
    }
  }
  if (data.modal) {
    $.ajax({url: `/static/views/modals/partials/${data.modal}.hbs`, cache: true, success: function(source) {
        Handlebars.registerPartial(`${data.modal}`, source);
      }});
  }
  Handlebars.registerHelper('log', function () {
    console.log(['Values:'].concat(
      Array.prototype.slice.call(arguments, 0, -1)
    ));
  });

  Handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  Handlebars.registerHelper('repeat', function (n, block) {
    let accum = '';
    for(let i = 0; i < n; ++i)
      accum += block.fn(i);
    return accum;
  });

  Handlebars.registerHelper('partial', function (name) {
    return name;
  });
  $.ajax({url, cache: true, success: function(source) {
      let template = Handlebars.compile(source);
      return callback(template(data));
    }});
};

let createModal = (opts, callback) => {
  $(`#${opts.id}`).remove();
  loadTemplate('/static/views/modals/main.hbs', opts, (html) => {
    $('body').append(html);
    $(`#${opts.id}`).modal();
    return callback();
  });
};

let nextTab = elem => $(elem).next().find('a.tabWizard[data-toggle="tab"]').click();
let prevTab = elem => $(elem).prev().find('a.tabWizard[data-toggle="tab"]').click();

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

  $(".stop-step").click(function (e) {
    history.back()
  });
});