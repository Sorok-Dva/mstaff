ApplicationIsAddMode = false;

let editWish = () => {
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
      services: application.serviceType,
      _csrf
    };
    $.put(`/api/candidate/wish/${application.wish[0].id}`, opts, (data) => {
      if (data.result === 'updated')
        $(location).attr('href', `/applications`);
      else
        notify('errorEditWish');
    });
  }
};

let rewriteContractType = () => {
  switch (application.wish[0].contract_type) {
    case 'cdi-cdd':
      application.contractType = {name: 'cdi-cdd', value: 'CDI / CDD'};
      application.timeType = {};
      application.wish[0].full_time ? application.timeType.fullTime = { name: 'full_time', value: 'TEMPS PLEIN' } : null;
      application.wish[0].part_time ? application.timeType.partTime = { name: 'part_time', value: 'TEMPS PARTIEL' } : null;
      application.wish[0].full_time ? application.timeType.dayTime = { name: 'daytime', value: 'fa-sun' } : null;
      application.wish[0].full_time ? application.timeType.nightTime = { name: 'nighttime', value: 'fa-moon' } : null;
      break;
    case 'vacation':
      application.contractType = {name: 'vacation', value: 'VACATION'};
      break;
    case 'internship':
      application.contractType = {name: 'internship', value: 'STAGE'};
      break;
  }
};

let rewritePosts = () => {
  let sPostType = $('#selectPostType');
  let post = sPostType.find(`option:contains(${application.postType})`).val();
  sPostType.val(post).trigger('change');
};

let rewriteServices = () => {
  let sServiceType = $('#selectServiceType');
  let selected = [];

  application.serviceType.forEach( service => {
    let data = $(`#selectServiceType option:contains(${service})`).val();
    selected.push(data);
  });
  sServiceType.val(selected).trigger('change');
  selected.forEach( item => {
    let data = $(`#selectServiceType [value="${item}"]`).text();
    application.serviceType.push(data);
  });
};

let rewriteDates = () => {
  application.start = application.wish[0].start;
  application.end = application.wish[0].end;

  $('.from').datetimepicker({
    format: 'DD/MM/YYYY',
    date: new Date(application.start)
  });
  $('.to').datetimepicker({
    format: 'DD/MM/YYYY',
    date: new Date(application.end)
  });
};

let rewriteSelectedES = () => {
  allEs = application.selectedES;

  let selectedEsCount =  $('#selectedEsCount');
  let list = application.selectedESInfo;

  selectedEsCount.html(application.selectedES.length);
  loadTemplate('/static/views/api/findByGeo.hbs', list, (html) => {
    $('#es_selected').html(html);
    if (!$.isEmptyObject(application.selectedESId)){
      application.selectedESId.forEach(id => {
        $(`#es_selected i.selectEs[data-id="${id}"]`).hide();
        $(`#es_selected i.unselectEs[data-id="${id}"]`).show();
      });
    }
  });
};

$(document).ready(() => {
  rewriteContractType();
  rewritePosts();
  rewriteServices(); // ICI SERVICES SE BARRE
  if (application.wish[0].contract_type === 'internship')
    rewriteDates();
  rewriteSelectedES();
});