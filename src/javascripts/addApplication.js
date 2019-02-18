let map, marker, cityCircle, markers = [], filter, pos = { lat: 0, lng: 0, rayon: 5 }, selectedAll = false,
  allEs = [], application = {};
let kmArray = [1, 2, 5, 10, 15, 20, 30, 50, 70, 100];
let slider = document.getElementById('radius');

// Step #1
$('#step1 input[type="checkbox"]').change(function () {
  let checked = $(this).attr('name');
  let step = $(this).parent().closest('.sub-step').closest('.tab-pane').attr('id');
  let subStep = $(this).parent().closest('.sub-step').attr('id');

  if (this.checked) {
    $(`#${subStep}`).find(':input').not(`[name=${checked}]`).prop('checked', false);
    switch (checked) {
      case 'cdi-cdd':
        application.contractType = {name: checked, value: 'CDI / CDD'};
        delete application.availability;
        delete application.selectedES;
        $('#activityType').show();
        $('#timeType').show();
        break;
      case 'vacation':
        application.contractType = { name: checked, value: 'VACATION' };
        delete application.activityType;
        delete application.timeType;
        delete application.selectedES;
        resetContract(checked);
        break;
      case 'internship':
        application.contractType = { name: checked, value: 'STAGE' };
        delete application.activityType;
        delete application.timeType;
        delete application.availability;
        delete application.selectedES;
        resetContract(checked);
        break;
      case 'full_time':
        application.activityType = { name: checked, value: 'TEMPS PLEIN' } ;
        break;
      case 'part_time':
        application.activityType = { name: checked, value: 'TEMPS PARTIEL' } ;
        break;
      case 'daytime':
        application.timeType = { name: checked, value: 'fa-sun-o' };
        break;
      case 'nighttime':
        application.timeType = { name: checked, value: 'fa-moon-o' };
        break;
    }
  } else {
    switch (subStep) {
      case 'contracts':
        delete application.contractType;
        delete application.activityType;
        delete application.timeType;
        break;
    }
    if (checked === 'cdi-cdd') {
      $(`#${subStep}`).find(':input').prop('checked', false);
      $('#activityType').hide();
      $('#timeType').hide();
    }
    if (checked === 'vacation') {
      $(`#${subStep}`).find(':input').prop('checked', false);
    }

  }
});

let verifyStep = (step, element) => {
  let stop = false;
  switch (step) {
    // ----------------------------------------- Case 1 ----------------------------------------- //
    case 1:
      if (!('contractType' in application)) {
        notification({
          icon: 'exclamation',
          type: 'danger',
          title: 'Informations manquantes :',
          message: `Merci de choisir un type de contrat.`
        });
        stop = true;
      } else {
        if (application.contractType.name === 'cdi-cdd' && (!('activityType' in application) || !('timeType' in application))) {
          notification({
            icon: 'exclamation',
            type: 'danger',
            title: 'Informations manquantes :',
            message: `Merci d'indiquer le type d'activité et votre aménagement horaire.`
          });
          stop = true;
        }
        if (application.contractType.name === 'cdi-cdd' || application.contractType.name === 'vacation'){
          element = element.next();
          application.selectedES = [];
        }
        if (application.contractType.name === 'internship'){
          $('#internshipDate').show();
        } else {
          $('#internshipDate').hide();
        }
      }
      if (!('postType' in application) || application.postType.length === 0) {
        notification({
          icon: 'exclamation',
          type: 'danger',
          title: 'Informations manquantes :',
          message: `Merci de choisir au moins un type de poste.`
        });
        stop = true;
      }
      if (stop) return false;
      element.next().removeClass('disabled');
      nextTab(element);
      break;
    // ----------------------------------------- Case 2 ----------------------------------------- //
    case 2:
      if (application.contractType.name === 'internship') {
        if (!('start' in application) || !('end' in application)){
          notification({
            icon: 'exclamation',
            type: 'danger',
            title: 'Informations manquantes :',
            message: `Merci de choisir vos dates.`
          });
          stop = true;
        }
      }
      if (stop) return false;
      application.selectedES = [];

      //Reset backStep
      $(`#esList i.unselectEs`).hide();
      $(`#esList i.selectEs`).show();
      $('#es_selected').empty();
      $('#selectedEsCount').html(0);


      element.next().removeClass('disabled');
      nextTab(element);
      break;
    // ----------------------------------------- Case 3 ----------------------------------------- //
    case 3:

      if (!('selectedES' in application) || application.selectedES.length < 1) {
        notification({
          icon: 'exclamation',
          type: 'danger',
          title: 'Erreur :',
          message: `Veuillez sélectionner au moins un établissement.`
        });
        stop = true;
      }
      if (stop) return false;

      $('#recapContractType').find('h3').html(application.contractType.value);
      if (application.contractType.name === 'cdi-cdd') {
        $('#recapActivityType').show().find('h3').html(application.activityType.value);
        $('#recapHourType').show().find('i').attr('class', `fa ${application.timeType.value} fa-3x`);
        $('#availability').parent().hide();
      } else if (application.contractType.name === 'vacation') {
        $('#recapActivityType').hide().find('h3').html('');
        $('#recapHourType').hide();
        $('#availability').empty();
      } else {
        $('#recapActivityType').hide().find('h3').html('');
        $('#recapHourType').hide();
      }
      $('#finalESList').empty();
      $('#es_selected > div[data-type="es"]').each((i, e) => {
        let name = $(e).find('h5 > span').text();
        let type = $(e).attr('data-es_type');
        let town = $(e).find('h6').text();
        $('#finalESList').append(`<tr><td>${name}</td><td>${type}</td><td>${town}</td></tr>`)
      });
      element.next().removeClass('disabled');
      nextTab(element);
      application.valid = true;
      break;
  }
};
$('#radius').on('click', 'li', function () {
  $('#radius-slider .slider').val($(this).attr('data-step'));
  highlightLabel(slider.noUiSlider.get());
});

let resetContract = (checked) => {
  $('#step1').find(':input').not(`[name=${checked}]`).prop('checked', false);
  $('#activityType').hide();
  $('#timeType').hide();
};

let geoSuccess = (position) => {
  pos = { lat: position.coords.latitude, lng: position.coords.longitude, rayon: 5 };
  getEsList();
};

let mapInit = () => {
  if (document.getElementById('map')) {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: pos
    });
    marker = new google.maps.Marker({
      position: pos,
      map: map
    });
    cityCircle = new google.maps.Circle({
      strokeColor: '#337AB7',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#5BBBE5',
      fillOpacity: 0.35,
      map: map,
      center: pos,
      radius: pos.rayon*1000 || 10000
    });
  }
};

let addMarker = (es) => {
  let marker = new google.maps.Marker({
    map: map,
    position: { lat: es.lat, lng: es.lon },
    icon: {
      url: 'http://maps.gstatic.com/mapfiles/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    }
  });

  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function () {
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(es.name);
    infoWindow.open(map, marker);
  });
};

let removeAllMarker = () => {
  markers.forEach((marker, index) => {
    marker.setMap(null);
  });
};

let getEsList = () => {
  mapInit();
  let _csrf = $('#csrfToken').val();
  $('#esCount').empty();
  $('#esList').html('<div id="loader" class="col-md-12"></div>');
  $('#loader').show();
  $.post('/api/establishments/findByGeo', { rayon: pos.rayon, lat: pos.lat, lon: pos.lng, filter, _csrf }, (data) => {
    allEs = data;
    loadTemplate('/static/views/api/findByGeo.hbs', data, (html) => {
      $('#esList').html(html);
      $('.esCount').html(data.length);
      $('#loader').hide();
    });
  });
};

let highlightLabel = ($this) => {
  $('#radius-slider .slider-labels li').removeClass('slideActive');
  let index = parseInt($this);
  let selector = '#radius-slider .slider-labels li:nth-child(' + index + ')';
  $(selector).addClass('slideActive');
};

let addEs = (data) => {
  let finess = parseInt(data.finess_et);
  if (application.selectedES.indexOf(finess) === -1) {
    $(`i.selectEs[data-id="${data.id}"]`).hide();
    $(`i.unselectEs[data-id="${data.id}"]`).show();
    application.selectedES.push(finess);
    $('#selectedEsCount').html(application.selectedES.length);
    $('#es_selected').append($(`#es${data.id}`).clone().attr('class', 'col-md-3'));
  }
};

let removeEs = (data) => {
  let finess = parseInt(data.finess_et);
  let index = application.selectedES.indexOf(finess);
  if (index !== -1) {
    $(`i.unselectEs[data-id="${data.id}"]`).hide();
    $(`i.selectEs[data-id="${data.id}"]`).show();
    application.selectedES.splice(index, 1);
    $('#selectedEsCount').html(application.selectedES.length);
    $(`#es_selected > #es${data.id}`).remove();
  }
};

let selectAll = () => {
  selectedAll = !selectedAll;
  if (selectedAll === true) {
    $(`#esList i.selectEs`).hide();
    $(`#esList i.unselectEs`).show();
    $('#es_selected').append($(`#esList .es-card`).clone().attr('class', 'col-md-3'));
    allEs.map((es, i) => {
      application.selectedES.push(parseInt(es.finess_et))
    });
  } else {
    $(`#esList i.unselectEs`).hide();
    $(`#esList i.selectEs`).show();
    $(`#es_selected > .es-card`).remove();
    allEs.map((es, i) => {
      let index = application.selectedES.indexOf(parseInt(es.finess_et));
      if (index !== -1) application.selectedES.splice(index, 1);
    });
  }
  $('#selectedEsCount').html(application.selectedES.length);
};

let addWish = () => {
  if (application.valid) {
    let opts = {
      name: application.name,
      contractType: application.contractType.name,
      fullTime: (('activityType' in application) && application.activityType.name === 'full_time'),
      partTime: (('activityType' in application) && application.activityType.name === 'part_time'),
      dayTime: (('timeType' in application) && application.timeType.name === 'daytime'),
      nightTime: (('timeType' in application) && application.timeType.name === 'nighttime'),
      availability: application.availability,
      start: application.start,
      end: application.end,
      lat: pos.lat,
      lon: pos.lng,
      es: application.selectedES.toString(),
      es_count: application.selectedES.length,
      posts: application.postType,
      _csrf
    };
    $.post('/api/candidate/wish/add', opts, (data) => {
      if (data.wish) {
        $(location).attr('href', `/applications`);
      } else {
        notification(
          {
            icon: 'exclamation',
            type: 'danger',
            title: 'Une erreur est survenue :',
            message: `Impossible d'ajouter votre souhait, veuillez réessayer ou contacter notre assistance si le problème persiste.`
          }
        );
      }
    });
  } else {

  }
};

$("#radius").on("click", "li", function() {
  $('#radius-slider .slider').val($(this).attr('data-step'));
  highlightLabel(slider.noUiSlider.get());
});
noUiSlider.create(slider, {
  start: 3,
  step: 1,
  connect: 'lower',
  range: {
    'min': 1,
    'max': 10
  },
  serialization: {
    format: {
      decimals: 0
    }
  }
});
slider.noUiSlider.on('change', function (){
  pos.rayon = kmArray[parseInt(slider.noUiSlider.get()) - 1];
  highlightLabel(parseInt(slider.noUiSlider.get()));
  getEsList()
});
slider.noUiSlider.on('slide', function (){
  highlightLabel(parseInt(slider.noUiSlider.get()));
});

$(document).ready(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess);
  } else {
    alert('Geolocation is not supported by this browser.');
  }

  $('#selectPostType').select2();
  $('#geolocationFilter').select2({ dropdownAutoWidth: true });

  $('#selectPostType').on('change', e => {
    let postType = $('#selectPostType').select2('data');
    if (!application.postType)
      application.postType = [];
    postType.forEach((post) => {
      application.postType.push(post.text);
    })
  });
  $('#geolocationFilter').on('select2:select', e => {
    let data = $('#geolocationFilter').select2('data');
    filter = null;
    if (data.length > 0) {
      filter = [];
      data.forEach((e, i) => {
        filter.push(parseInt(e.id))
      });
    }
    return getEsList();
  }).on('select2:unselect', e => {
    let data = $('#geolocationFilter').select2('data');
    if (filter.length > 0) {
      filter = [];
      data.forEach((e, i) => {
        filter.push(parseInt(e.id))
      });
      return getEsList();
    }
  });

  $('.from').on('dp.change', (e) => {
    if (!e.date)
      delete application.start;
    else
      application.start = new Date(e.date);
  });

  $('.to').on('dp.change', (e) => {
    if (!e.date)
      delete application.end;
    else
      application.end = new Date(e.date);
  });

  $('.next-step').click(function (e) {
    let $active = $('.wizard .nav-tabs li.active');
    let datastep = $(this).attr('data-step');
    verifyStep(parseInt(datastep), $active);
  });

  $('.prev-step').click(function (e) {
    let $active = $('.wizard .nav-tabs li.active');
    let datastep = $('.wizard .nav-tabs li.active a').attr('aria-controls');

    if (datastep === 'step3' && application.contractType.name === 'cdi-cdd' || application.contractType.name === 'vacation')
        $active = $active.prev();
    prevTab($active);
  });

  $('li[role="presentation"]').click(function() {
    $(this).nextAll().removeClass('active').addClass('disabled');
  });
});
