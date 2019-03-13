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
  ApplicationIsAddMode = false;
  rewritePosts();
  rewriteServices();
  rewriteSelectedES();
});