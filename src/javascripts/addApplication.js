let map, marker, cityCircle, markers = [], filter, pos = { lat: 0, lng: 0, rayon: 5 }, selectedAll = false,
  allEs = [], application = {};
let kmArray = [1, 2, 5, 10, 15, 20, 30, 50, 70, 100];
let slider = document.getElementById('radius');

// Step #1
$('#step1 input[type="checkbox"]').change(function () {
  let selected = $(this).attr('name');
  let resetAllCheckboxExcept = (name) => {
    $('#step1').find(':input').not(`[name=${name}]`).prop('checked', false);
    if (name !== 'cdi-cdd'){
      $('#activityType').hide();
      $('#timeType').hide();
      delete application.timeType;
    }
  };

  switch (selected) {
    case 'cdi-cdd':
      resetAllCheckboxExcept(selected);
      if (this.checked){
        $('#activityType').show();
        $('#timeType').show();
        application.contractType = {name: selected, value: 'CDI / CDD'};
        application.timeType = {};
      } else {
        $('#activityType').hide();
        $('#timeType').hide();
        delete application.contractType;
        delete application.timeType;
      }
      break;
    case 'vacation':
      resetAllCheckboxExcept(selected);
      if (this.checked){
        application.contractType = { name: selected, value: 'VACATION' };
        delete application.timeType;
      } else delete application.contractType;
      break;
    case 'internship':
      resetAllCheckboxExcept(selected);
      if (this.checked){
        application.contractType = { name: selected, value: 'STAGE' };
        delete application.timeType;
      } else delete application.contractType;
      break;
    case 'full_time':
      this.checked ? application.timeType.fullTime = { name: selected, value: 'TEMPS PLEIN' } : delete application.timeType.fullTime;
      break;
    case 'part_time':
      this.checked ? application.timeType.partTime = { name: selected, value: 'TEMPS PARTIEL' } : delete application.timeType.partTime;
      break;
    case 'daytime':
      this.checked ? application.timeType.dayTime = { name: selected, value: 'fa-sun' } : delete application.timeType.dayTime;
      break;
    case 'nighttime':
      this.checked ? application.timeType.nightTime = { name: selected, value: 'fa-moon' } : delete application.timeType.nightTime;
      break;
  }
});

let notify = (error) => {
  switch(error) {
    case 'noContractType':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir un type de contrat.`
      });
      break;
    case 'noTimeType':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer le type d'activité et votre aménagement horaire.`
      });
      break;
    case 'noActivityType':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer le type d'activité.`
      });
      break;
    case 'noScheduleType':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer votre aménagement horaire.`
      });
      break;
    case 'noPostType':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir au moins un type de poste.`
      });
      break;
    case 'noSelectedES':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Erreur :',
        message: `Veuillez sélectionner au moins un établissement.`
      });
      break;
    case 'missingDate':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir vos dates.`
      });
      break;
    case 'errorAddWish':
      notification(
        {
          icon: 'exclamation',
          type: 'danger',
          title: 'Une erreur est survenue :',
          message: `Impossible d'ajouter votre souhait, veuillez réessayer ou contacter notre assistance si le problème persiste.`
        }
      );
      break;
  }
  return true;
}

let verifyStep = (step) => {
  let error = false;
  switch (step) {
    // ----------------------------------------- Case 1 ----------------------------------------- //
    case 'step1':
      if (!('contractType' in application))
        error = notify('noContractType');
      else {
        if (application.contractType.name === 'cdi-cdd') {
          if (!('timeType' in application))
            error = notify('noTimeType');
          else {
            if (!('fullTime' in application.timeType) && !('partTime' in application.timeType))
              error = notify('noActivityType');
            if (!('dayTime' in application.timeType) && !('nightTime' in application.timeType))
              error = notify('noScheduleType');
          }
        }
      }
      if (!('postType' in application) || application.postType.length === 0)
        error = notify('noPostType');
      return error;
      break;
    // ----------------------------------------- Case 2 ----------------------------------------- //
    case 'step2':
      if (application.contractType.name === 'internship') {
        if (!('start' in application) || !('end' in application)){
          error = notify('missingDate');;
        }
      }
      return error;
      break;
    // ----------------------------------------- Case 3 ----------------------------------------- //
    case 'step3':
      if (!('selectedES' in application) || application.selectedES.length < 1)
        error = notify('noSelectedES');
      return error;
      break;
  }
};

let createRecap = () => {
  $('#recapContractType').find('h3').html(application.contractType.value);
  $('#recapActivityType').hide().find('h3').html('');
  $('#recapHourType').hide();
  $('#availability').parent().hide();
  if (application.contractType.name === 'cdi-cdd') {
      if('fullTime' in application.timeType)
        $('#recapActivityType h3').first().html(application.timeType.fullTime.value);
      if('partTime' in application.timeType)
        $('#recapActivityType h3').last().html(application.timeType.partTime.value);
      if('dayTime' in application.timeType)
        $('#recapHourType i').first().addClass(`fal ${application.timeType.dayTime.value} fa-5x`);
      if('nightTime' in application.timeType)
        $('#recapHourType i').last().addClass(`fal ${application.timeType.nightTime.value} fa-5x`);
    $('#recapActivityType').show();
    $('#recapHourType').show();
    $('#availability').parent().hide();
  } else $('#recapContractType').attr('class', 'col-md-12');
  if (application.contractType.name === 'internship') {
    $('#availability').parent().show();
  }
  $('#finalESList').empty();
  $('#es_selected > div[data-type="es"]').each((i, e) => {
    let name = $(e).find('h5 > span').text();
    let type = $(e).attr('data-es_type');
    let town = $(e).find('h6').text();
    $('#finalESList').append(`<tr><td>${name}</td><td>${type}</td><td>${town}</td></tr>`)
  });
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

let highlightLabel = ($this) => {
  $('#radius-slider .slider-labels li').removeClass('slideActive');
  let index = parseInt($this);
  let selector = '#radius-slider .slider-labels li:nth-child(' + index + ')';
  $(selector).addClass('slideActive');
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

let resetSelectedES = () => {
  application.selectedES = [];
  $(`#esList i.unselectEs`).hide();
  $(`#esList i.selectEs`).show();
  $('#es_selected').empty();
  $('#selectedEsCount').html(0);

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
  application.selectedES = [];
  if (selectedAll === true) {
    $(`#esList i.selectEs`).hide();
    $(`#esList i.unselectEs`).show();
    $('#es_selected').append($(`#esList .es-card`).clone().attr('class', 'col-md-3'));
    allEs.map((es, i) => {
      application.selectedES.push(parseInt(es.finess_et))
    });
    $('#selectedEsCount').html(application.selectedES.length);
  } else resetSelectedES();
};

let addWish = () => {
  if (application.valid) {
    let opts = {
      name: application.name,
      contractType: application.contractType.name,
      fullTime: (('timeType' in application) && ('fullTime' in application.timeType)),
      partTime: (('timeType' in application) && ('partTime' in application.timeType)),
      dayTime: (('timeType' in application) && ('dayTime' in application.timeType)),
      nightTime: (('timeType' in application) && ('nightTime' in application.timeType)),
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
        notify('errorAddWish');
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
  $('#selectPostType').on('change', e => {
    let postType = $('#selectPostType').select2('data');
    if (!application.postType)
      application.postType = [];
    postType.forEach((post) => {
      application.postType.push(post.text);
    })
  });

  $('#geolocationFilter').select2({ dropdownAutoWidth: true });
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

  let goStep = (newstep, prevstep) => {
    let aria = $(`a.tabWizard[data-toggle="tab"][aria-controls="${newstep}"]`);
    let toDisable = $(`a.tabWizard[data-toggle="tab"][aria-controls="${prevstep}"]`);
    if (prevstep)
      toDisable.parent().addClass('disabled');
    aria.parent().removeClass('disabled');
    aria.click();
  };

  $('.next-step').click(function () {
    let datastep = $('div .tab-pane.active[role="tabpanel"]').attr('id');
    if (!verifyStep(datastep)){
      switch (datastep) {
        case 'step1':
          resetSelectedES();
          application.contractType.name === 'internship' ? goStep('step2') : goStep('step3');
          break;
        case 'step2':
          goStep('step3');
          break;
        case 'step3':
          createRecap();
          application.valid = true;
          goStep('complete');
          break;
      }
    }
  });

  $('.prev-step').click(function () {
    let datastep = $('div .tab-pane.active[role="tabpanel"]').attr('id');
    switch (datastep) {
      case 'step2':
        goStep('step1', datastep);
        break;
      case 'step3':
        application.contractType.name === 'internship' ? goStep('step2',datastep) : goStep('step1',datastep);
        break;
      case 'complete':
        goStep('step3',datastep);
        break;
    }
  });

  $('li[role="presentation"]').click(function() {
    $(this).nextAll().removeClass('active').addClass('disabled');
  });
});
