ApplicationIsAddMode = false;

let editWish = () => {
  console.log('Edition d un souhait');
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
  sPostType.val(post).trigger('change.select2');
};

let rewriteServices = () => {
  let sServiceType = $('#selectServiceType');

  let selected = [];
  application.serviceType.forEach( service => {
    selected.push($(`#selectServiceType option:contains(${service})`).val());
  });
  sServiceType.val(selected).trigger('change');
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
  rewriteServices();
  rewriteSelectedES();

});