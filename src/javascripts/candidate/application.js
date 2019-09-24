let map, marker, cityCircle, markers = [], geocoder, autocomplete, filter = 3, pos = { lat: 0, lng: 0, rayon: 5 }, myPos,
  selectedAll = false, allEs = [], application = {};
let kmArray = [1, 2, 5, 10, 15, 20, 30, 50, 70, 100];
let slider = document.getElementById('radius');
let geoActivate = false;
let ApplicationIsAddMode = true;

// Step #1

function resetAllCheckboxExcept(name) {
  $('#step1 input').not(`[name=${name}]`).prop('checked', false);
}

function resetContractDurableTypeCheckboxExcept(name){
  $('#contractDurableType input').not(`[name=${name}]`).prop('checked', false);
  if (name !== 'CDI'){
    $('#activityType input').prop('checked', false);
    $('#timeType input').prop('checked', false);
  }
}

function resetContractPunctualTypeCheckboxExcept(name){
  $('#contractPunctualType input').not(`[name=${name}]`).prop('checked', false);
}

function showContractTypeDiv(selected, isChecked){
  let durable = $('#contractDurableType');
  let punctual = $('#contractPunctualType');
  let activityType = $('#activityType');
  let timeType = $('#timeType');

  durable.hide();
  punctual.hide();
  activityType.hide();
  timeType.hide();
  if (isChecked){
    switch (selected) {
      case 'durableContract':
        durable.show();
        break;
      case 'punctualContract':
        punctual.show();
        break;
    }
  }
}

$('#contractDurability input[type="checkbox"]').change(function() {
  let selected = $(this).attr('name');
  delete application.contractType;
  delete application.timeType;
  resetAllCheckboxExcept(selected);
  showContractTypeDiv(selected, this.checked);
  switch (selected) {
    case 'internship':
      delete application.timeType;
      if (this.checked) application.contractType = { name: selected, value: 'STAGE' };
      break;
  }
});

$('#contractDurableType input[type="checkbox"]').change(function() {
  let selected = $(this).attr('name');
  let activityType = $('#activityType');
  let timeType = $('#timeType');

  delete application.contractType;
  delete application.timeType;
  resetContractDurableTypeCheckboxExcept(selected);
  activityType.hide();
  timeType.hide();
  if (this.checked){
    switch (selected) {
      case 'CDI':
        activityType.show();
        timeType.show();;
        application.contractType = {name: selected, value: 'CDI'};
        application.timeType = {};
        break;
      case 'CP':
        application.contractType = { name: selected, value: 'Apprentissage / Contrat Pro' };
        break;
      case 'CL':
        application.contractType = { name: selected, value: 'Collaboration Libérale' };
        break;
      case 'AL':
        application.contractType = { name: selected, value: 'Installation / Association Libérale' };
        break;
      case 'RCL':
        application.contractType = { name: selected, value: 'Reprise Cabinet Libéral' };
        break;
    }
  }
});

$('#contractPunctualType input[type="checkbox"]').change(function() {
  let selected = $(this).attr('name');
  delete application.contractType;
  delete application.timeType;
  resetContractPunctualTypeCheckboxExcept(selected);
  if (this.checked){
    switch (selected) {
      case 'CDD':
        application.contractType = { name: selected, value: 'Missions / Vacations / CDD' };
        break;
      case 'RL':
          application.contractType = { name: selected, value: 'Remplacement Libéral' };
        break;
    }
  }
});


$('#activityType input[type="checkbox"]').change(function() {
  let selected = $(this).attr('name');
  switch (selected) {
    case 'full_time':
      this.checked ? application.timeType.fullTime = { name: selected, value: 'TEMPS PLEIN' } : delete application.timeType.fullTime;
      break;
    case 'part_time':
      this.checked ? application.timeType.partTime = { name: selected, value: 'TEMPS PARTIEL' } : delete application.timeType.partTime;
      break;
  }
});

$('#timeType input[type="checkbox"]').change(function() {
  let selected = $(this).attr('name');
  switch (selected) {
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
    case 'wrongSequenceDate':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `La date de début doit être ultérieur à la date de fin.`
      });
      break;
    case 'wrongDate':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir des dates ultérieurs au jour actuel.`
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
    case 'errorEditWish':
      notification(
        {
          icon: 'exclamation',
          type: 'danger',
          title: 'Une erreur est survenue :',
          message: `Impossible de modifier votre souhait, veuillez réessayer ou contacter notre assistance si le problème persiste.`
        }
      );
      break;
    case 'noValueApplicationName':
      notification(
        {
          icon: 'exclamation',
          type: 'danger',
          title: 'Une erreur est survenue :',
          message: `Merci de saisir un nom composé d'au moins un caractères alphabétique ou numérique.`
        }
      );
    case 'noAddress':
      notification(
        {
          icon: 'exclamation',
          type: 'danger',
          title: 'Une erreur est survenue :',
          message: `Merci de saisir une adresse.`
        }
      );
      break;
    case 'noAllOverValue':
      notification(
        {
          icon: 'exclamation',
          type: 'danger',
          title: 'Une erreur est survenue :',
          message: `Merci de saisir une nom d'établissement, de ville ou un code postal.`
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
        if (!('start' in application) || !('end' in application))
          error = notify('missingDate');
        else if (moment(application.start).isBefore(moment()) || moment(application.end).isBefore(moment()))
          error = notify('wrongDate');
        else if (moment(application.start).isAfter(moment(application.end))){
          error = notify('wrongSequenceDate');
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

// ----------------------------------------- MAP ----------------------------------------- //

let mapInit = () => {
  return new Promise(
    resolve => {
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
        geocoder = new google.maps.Geocoder();
        autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchAddress'));

        autocomplete.setFields(['formatted_address']);
        autocomplete.addListener('place_changed', function() {
          application.searchAddress = autocomplete.getPlace();
        });
        resolve();
      }
    });
};

let displayMap = (currentMap, newpos) => {
  currentMap.setCenter(newpos);
  marker.setPosition(newpos);
  cityCircle.setCenter(newpos);
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

// ------------------------------------- GEOLOCATION ------------------------------------- //

let activateGeoLoc = () => {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { enableHighAccuracy: true});
};

let geoSuccess = (position) => {
  geoActivate = true;
  myPos = { lat: position.coords.latitude, lng: position.coords.longitude };
  generateAroundMe();
};

let geoError = (error) => {
  geoActivate = false;
  if (error.PERMISSION_DENIED){
    alert('Geolocation permission is actually denied or not supported by your browser.');
  }
};

let geocodeAddress = (geoCoder, currentMap) => {
  return new Promise(
    resolve => {
      geoCoder.geocode({'address': application.searchAddress}, function(results, status) {
        if (status === 'OK') {
          pos.lat = results[0].geometry.location.lat();
          pos.lng = results[0].geometry.location.lng();
          displayMap(currentMap, { lat:pos.lat, lng:pos.lng });
          resolve();
        }
      })
    },
    reject => {
      alert('Geocode was not successful for the following reason: ' + status);
      reject();
    });
};

// --------------------------------------- ES LIST --------------------------------------- //

let loadResult = (list) => {
  loadTemplate('/views/api/findByGeo.hbs', list, (html) => {
    $('#esList').html(html);
    $('.esCount').html(list.length);
    $('#loader').hide();
    if (!$.isEmptyObject(application.selectedESId)){
      application.selectedESId.forEach(id => {
        $(`#esList i.selectEs[data-id="${id}"]`).hide();
        $(`#esList i.unselectEs[data-id="${id}"]`).show();
      });
    }
  });
};

let getEsList = (query) => {
  let _csrf = $('meta[name="csrf-token"]').attr('content');

  if (query.type === 'aroundMe'){
    let p = query.position;
    return new Promise(resolve => {
      $.post('/api/establishments/findByGeo', { rayon: p['rayon'], lat: p['lat'],lon: p['lon'], filterQuery:filter, _csrf }).then(
        data => resolve(data)
      );
    });
  }
  else if (query.type === 'byAddress') {
    let p = query.position;
    return new Promise(resolve => {
      $.post('/api/establishments/findByGeo', { rayon: p['rayon'], lat: p['lat'],lon: p['lon'], filterQuery:filter, _csrf }).then(
        data => resolve(data)
      );
    });
  }
  else if (query.type === 'allOver') {
    return new Promise(resolve => {
      $.get(`/api/establishments/findByCity/${query.data}`, _csrf).then(
        data => resolve(data)
      );
    });
  }
};

let resetSelectedES = () => {
  application.selectedES = [];
  application.selectedESId = [];
  $(`#esList i.unselectEs`).hide();
  $(`#esList i.selectEs`).show();
  $('#es_selected').empty();
  $('#selectedEsCount').html(0);

};

let addEs = (data) => {
  let finess = parseInt(data.finess_et);
  let esId = parseInt(data.id);

  if (application.selectedES.indexOf(finess) === -1) {
    $(`i.selectEs[data-id="${data.id}"]`).hide();
    $(`i.unselectEs[data-id="${data.id}"]`).show();
    application.selectedES.push(finess);
    application.selectedESId.push(esId);
    $('#selectedEsCount').html(application.selectedES.length);
    $('#es_selected').append($(`#es${data.id}`).clone().attr('class', 'col-12 col-lg-5 d-inline-block'));
  }
};

let removeEs = (data) => {
  let finess = parseInt(data.finess_et);
  let index = application.selectedES.indexOf(finess);
  if (index !== -1) {
    $(`i.unselectEs[data-id="${data.id}"]`).hide();
    $(`i.selectEs[data-id="${data.id}"]`).show();
    application.selectedES.splice(index, 1);
    application.selectedESId.splice(index, 1);
    $('#selectedEsCount').html(application.selectedES.length);
    $(`#es_selected > #es${data.id}`).remove();
  }
};

let selectAll = () => {
  selectedAll = !selectedAll;
  application.selectedES = [];
  application.selectedESId = [];
  if (selectedAll === true) {
    $(`#esList i.selectEs`).hide();
    $(`#esList i.unselectEs`).show();
    $('#es_selected').append($(`#esList .es-card`).clone().attr('class', 'col-12 col-lg-5'));
    allEs.map((es, i) => {
      application.selectedES.push(parseInt(es.finess_et))
      application.selectedESId.push(parseInt(es.id))
    });
    $('#selectedEsCount').html(application.selectedES.length);
  } else resetSelectedES();
};

let resetEsList = () => {
  $('#esList').empty();
  $('.esCount').empty();
};

let loading = () => {
  $('#esList').html('<div id="loader"></div>');
  $('#loader').show();
};

// ------------------------------- GENERATE SEARCH SCREEN ------------------------------- //

let generateAroundMe = () => {
  let query = { type: 'aroundMe', position: { rayon: pos.rayon, lat: myPos.lat, lon: myPos.lng, filter} };

  pos = { lat: myPos.lat, lng: myPos.lng, rayon: pos.rayon };
  displayMap(map, pos);
  loading();
  getEsList(query).then( data => {
    allEs = data;
    loadResult(data);
  });
};

let generateByAddress = () => {
  let addressValue = $('#searchAddress').val();

  if(!$.isEmptyObject(addressValue)) {
    application.searchAddress = addressValue;
    loading();
    geocodeAddress(geocoder, map).then(() => {
      let query = { type: 'byAddress', position: { rayon: pos.rayon, lat: pos.lat, lon: pos.lng, filter} };
      getEsList(query).then( data => {
        allEs = data;
        loadResult(data);
      });
    });
  } else notify('noAddress');
};

let generateAllOver = () => {
  let value = $('#searchCity').val();
  if (!$.isEmptyObject(value)){
    let query = { type: 'allOver', data: value };
    loading();
    getEsList(query).then( data => {
      allEs = data;
      loadResult(data);
    });
  } else notify('noAllOverValue');
};

let displaySelection = () => {

  let myAddressInput = $('#myAddress');
  let myMap = $('.map');
  let resultList = $('.resultList');

  $('#tabsStep3').click( function(e) {

    resetEsList();
    myMap.show();
    myAddressInput.hide();
    resultList.removeClass('col-md-12').addClass('col-md-7');

    switch (e.target.id) {
      case 'searchAroundMe':
        generateAroundMe();
        break;
      case 'searchByAddress':
        myAddressInput.show();
        if (!$.isEmptyObject(application.searchAddress)){
          generateByAddress();
        }
        break;
      case 'searchAllOver':
        myMap.hide();
        resultList.removeClass('col-md-7').addClass('col-md-12');
        break;
    }
  })
};

let activatePerfectScrollbar = () => {
  if (!$('html').hasClass('perfect-scrollbar-on'))
    $('html').addClass('perfect-scrollbar-on');
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
  let activeId = $('#tabsStep3 li a.active').attr('id');
  pos.rayon = kmArray[parseInt(slider.noUiSlider.get()) - 1];
  cityCircle.setRadius(pos.rayon * 1000);
  highlightLabel(parseInt(slider.noUiSlider.get()));
  if (activeId === 'searchAroundMe')
    generateAroundMe();
  else if (activeId === 'searchByAddress' && !$.isEmptyObject(application.searchAddress))
    generateByAddress();
});
slider.noUiSlider.on('slide', function (){
  highlightLabel(parseInt(slider.noUiSlider.get()));
});

// ------------------------------------- FINAL STEP ------------------------------------- //

let createRecap = () => {
  $('#recapContractType').find('h3').html(application.contractType.value);
  $('#recapActivityType').hide().find('h3').html('');
  $('#recapHourType').hide();
  $('#availability').parent().hide();
  if (application.contractType.name === 'CDI') {
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
    let start = moment(application.start).format("DD MMMM YYYY");
    let end = moment(application.end).format("DD MMMM YYYY");
    $('#availability h3').html(`${start} - ${end}`);
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

let addWishName = () => {
  createModal({
    id: 'addApplicationNameModal',
    title: 'Nommez votre candidature',
    text: ' <input id="wishName" type="text">',
    actions: [
      '<button type="button" class="btn btn-danger" data-dismiss="modal">Annuler</button>',
      '<button type="button" id="btnSaveWish" class="btn btn-success">Sauvegarder</button>'
    ]
  }, () => {
    let regex = new RegExp('[\\w]', 'i');
    let value;

    if (!ApplicationIsAddMode && application.name)
      $('#wishName').val(application.name)

    $('#btnSaveWish').click(() => {
      value = $('#wishName').val();
      if (!$.isEmptyObject(value) && regex.test(value)) {
        value = value.trim();
        application.name = `${value}`;
        $('#addApplicationNameModal').modal('hide');
        if (ApplicationIsAddMode)
          addWish();
        else
          editWish();
      } else notify('noValueApplicationName');
    });
  });
};

$(document).ready(function () {

  mapInit().then( () => {
    activateGeoLoc();
    displaySelection();
  });

  let selectPostType = $('#selectPostType');
  let selectServiceType = $('#selectServiceType');
  let allServiceType = $('#selectServiceType option');
  let geoLocFilter = $('#geolocationFilter');
  let searchAddress = $('#searchAddress');
  let searchCity = $('#searchCity');
  const keyEnter = 13;

  if (ApplicationIsAddMode){
    $('#contractDurableType').hide();
    $('#contractPunctualType').hide();
  }
  selectPostType.select2();
  selectServiceType.selectpicker();
  allServiceType.prop('disabled', true);
  allServiceType.hide();
  geoLocFilter.selectpicker();
  searchAddress.keydown( (e) => {
    if (e.which === keyEnter)
      generateByAddress();
  });
  searchCity.keydown( (e) => {
    if (e.which === keyEnter)
      generateAllOver();
  });

  selectPostType.on('change', () => {
    let postType = selectPostType.select2('data');
    let selectedCategories = selectPostType.find(':selected').attr('data-categorie');
    selectServiceType.val(null).trigger('change');



    let goodServices = $(`#selectServiceType [data-categorie="${selectedCategories}"]`);
    if (selectedCategories === '3'){
      goodServices = $(`#selectServiceType [data-categorie="3"],[data-categorie="2"]`);
    }
    let wrongServices = $('#selectServiceType option:disabled');
    wrongServices.prop('disabled', false);
    allServiceType.hide();

    application.postType = [];
    postType.forEach((post) => {
      application.postType.push(post.text);
    });
    if (postType.length > 0){
      goodServices.prop('disabled', false);
      goodServices.show();
      selectServiceType.prop('disabled', false);
      selectServiceType.selectpicker('refresh');
      if (ApplicationIsAddMode)
        application.serviceType = [];
    }

    if (selectedCategories === '5'){
      const id = $(`#selectServiceType option[data-text='Services Libéraux']`).val();
      selectServiceType.val(id).trigger('change');
      selectServiceType.prop('disabled', true);
      selectServiceType.selectpicker('refresh');
    }
    if (selectedCategories === '4'){
      const id = $(`#selectServiceType option[data-text='Services généraux']`).val();
      selectServiceType.val(id).trigger('change');
      selectServiceType.prop('disabled', true);
      selectServiceType.selectpicker('refresh');
    }
  });
  selectServiceType.on('change', () => {
    let serviceType = selectServiceType.selectpicker('val');
    application.serviceType = [];
    serviceType.forEach((value) => {
      let data = $(`#selectServiceType [value="${value}"]`).text();
      application.serviceType.push(data);
    });
  });

  geoLocFilter.on('change', () => {
    let activeId = $('#tabsStep3 li a.active').attr('id');

    filter = parseInt(geoLocFilter.selectpicker('val'));
    if (activeId === 'searchAroundMe')
      return generateAroundMe();
    else if (activeId === 'searchByAddress' && !$.isEmptyObject(application.searchAddress))
      generateByAddress();
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
      activatePerfectScrollbar();
      switch (datastep) {
        case 'step1':
          ApplicationIsAddMode ? resetSelectedES() : null;
          if (application.contractType.name === 'internship')
            goStep('step2')
          else {
            goStep('step3');
            $('html').removeClass('perfect-scrollbar-on');
          }
          break;
        case 'step2':
          goStep('step3');
          $('html').removeClass('perfect-scrollbar-on');
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
    activatePerfectScrollbar();
    switch (datastep) {
      case 'step2':
        goStep('step1', datastep);
        break;
      case 'step3':
        application.contractType.name === 'internship' ? goStep('step2',datastep) : goStep('step1',datastep);
        break;
      case 'complete':
        goStep('step3',datastep);
        $('html').removeClass('perfect-scrollbar-on');
        break;
    }
  });

  $('li[role="presentation"]').click(function() {
    $(this).nextAll().removeClass('active').addClass('disabled');
  });
});