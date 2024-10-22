function generateCalendarMonths (moment) {
  let result = {};
  let date = moment.format('MMMM YYYY').toUpperCase();
  result[date] = [];
  for (let i = 1; i <= moment.daysInMonth(); i++)
    result[date].push(moment.date(i).format('e'));
  return result;
}

function generateDatasCalendar (duration) {
  let result = [];
  for (let i = 0; i < duration; i++)
    result.push(generateCalendarMonths(moment().add(i, 'months')));
  return result;
}

function generateHTMLCalendar (datas) {
  let column = 0;
  let row = 0;
  let leftArrow = '<i id="toleft" class="fal fa-arrow-circle-left"></i>';
  let rightArrow = '<i id="toright" class="fal fa-arrow-circle-right"></i>';
  let sun = '<i style="color:rgb(102, 97, 91)" class="fal fa-sun fa-2x"></i>';
  let moon = '<i style="color:rgb(102, 97, 91)" class="fal fa-moon fa-2x"></i>';

  datas.forEach(obj => {
    Object.keys(obj).forEach(key => {
      let value = obj[key];

      $("#vacationDate").append(`<table data-key="${key}" style="display:none" class="text-center table col-12"></table>`);
      $(`table[data-key="${key}"]`).append(`<thead><tr><th>${leftArrow}</th><th class="text-center" colspan="5">${key}</th><th>${rightArrow}</th></tr><tr data-tr="${key}"></tr></thead>`);

      let days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      days.forEach(day => {
        $(`tr[data-tr="${key}"]`).append('<td>' + day + '</td>');
      });
      $(`table[data-key="${key}"]`).append(`<tbody data-tbody="${key}"></tbody>`);

      value.forEach((val, i, array) => {
        let count = array[0];
        if (column % 7 === 0){
          row++;
          $(`tbody[data-tbody="${key}"]`).append(`<tr data-week="${row}"></tr>`);
        }
        if (i === 0) {
          for (let j = 0; j < count; j++) {
            $(`tr[data-week="${row}"]`).append('<td></td>');
            column++;
          }
        }
        $(`tr[data-week="${row}"]`).append(`<td><div data-day="${i + 1}" class="col-md-12">${i + 1}</div><span>${sun}${moon}</span></td>`);
        column++;
        if (i === value.length - 1)
          column = 0;
      })

    });
  });
}

function loadPreviousDatas (id) {
  $.get(`/pools/availability/${id}`, (result) => {
    let db = result.availability;
    let keys = Object.keys(db);
    keys.forEach((key) => {
      if ($.isEmptyObject(data.availability[key]))
        data.availability[key] = {daytime : [], nighttime : []};

      let daytime = db[key].daytime;
      let nighttime = db[key].nighttime;
      if(daytime) {
        daytime.forEach(day => {
          $(`tbody[data-tbody="${key}"]`).find(`[data-day="${day}"]`).siblings('span').children('.fa-sun').css('color', 'rgb(255, 153,0)');
          data.availability[key].daytime.push(day);
        });
      }
      if(nighttime) {
        nighttime.forEach(day => {
          $(`tbody[data-tbody="${key}"]`).find(`[data-day="${day}"]`).siblings('span').children('.fa-moon').css('color', 'rgb(0, 102,255)');
          data.availability[key].nighttime.push(day);
        });
      }
    });
  });
}

function updateAvailability(id)
{
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  let availability = data.availability;
  if (Object.keys(availability).length) {
    $.put(`pools/availability/${id}`, { _csrf, availability }, (res) => {
      if(res === 'Availability planning updated')
      {
        notification({
          icon: 'check-circle',
          type: 'success',
          title: 'Succès :',
          message: `Vous venez de mettre à jour votre calendrier de disponibilité.`
        });
      }
    });
  } else {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Erreur :',
      message: `Le calendrier de disponibilités ne peut être vide.`
    });
  }
}

function choosedVacations (calendar) {
  $('#vacationDate table .fa-sun, .fa-moon').click(function(){
    let day = $(this).parent().siblings("div").attr('data-day');
    let month = $(this).parents("table").attr('data-key');
    let colorSun = 'rgb(255, 153,0)';
    let colorMoon = 'rgb(0, 102,255)';
    let colorBase = 'rgb(102, 97, 91)';

    if ($.isEmptyObject(calendar[month]))
      calendar[month] = {daytime : [], nighttime : []};

    if ($(this).hasClass('fa-sun')){
      if ($(this).css('color') ===  colorBase){
        $(this).css('color', colorSun);
        calendar[month].daytime.push(day);
      } else {
        $(this).css('color', colorBase);
        let index = calendar[month].daytime.indexOf(day);
        if (index !== -1)
          calendar[month].daytime.splice(index,1);
        if (calendar[month].daytime.length === 0 && calendar[month].nighttime.length === 0)
          delete(calendar[month]);
      }
    }

    if ($(this).hasClass('fa-moon')){
      if ($(this).css('color') ===  colorBase){
        $(this).css('color', colorMoon);
        calendar[month].nighttime.push(day);
      } else {
        $(this).css('color', colorBase);
        let index = calendar[month].nighttime.indexOf(day);
        if (index !== -1)
          calendar[month].nighttime.splice(index,1);
        if (calendar[month].daytime.length === 0 && calendar[month].nighttime.length === 0)
          delete(calendar[month]);
      }
    }
  });
};

function verifyAvailabilityInputs(){
  return Object.keys(data.availability).length ? true : notify('inputAvailability');
}

function notify(error){
  if (error === 'inputAvailability') {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Informations manquantes :',
      message: `Merci de choisir des dates de disponibilité.`
    });
  }
  return false;
}

function switchCalendar() {
  $('#vacationDate table').first().show();

  $('#vacationDate table #toright').click(function(){
    let attr = $(this).parents("table").attr('data-key');
    if ($(`table[data-key="${attr}"]` ).next().length){
      $(`table[data-key="${attr}"]` ).hide();
      $(`table[data-key="${attr}"]` ).next().show();
    }
  });
  $('#vacationDate table #toleft').click(function(){
    let attr = $(this).parents("table").attr('data-key');
    if ($(`table[data-key="${attr}"]` ).prev().length){
      $(`table[data-key="${attr}"]` ).hide();
      $(`table[data-key="${attr}"]` ).prev().show();
    }
  });
};

function resetCalendar()
{
  $('#vacationDate table').remove();
  generateHTMLCalendar(generateDatasCalendar(24));
  switchCalendar();
  choosedVacations(data.availability);
  $('table').css('table-layout', 'fixed');
}

generateHTMLCalendar(generateDatasCalendar(24));
switchCalendar();
choosedVacations(data.availability);
$('table').css('table-layout', 'fixed');