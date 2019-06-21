function saveDetails(){
  offerData.details_section.detailsSchedule = $('#detailsSchedule').val();
  offerData.details_section.detailsRoll = $('#detailsRoll').val();
  offerData.details_section.detailsQuota = $('#detailsQuota').val();
  offerData.details_section.detailsStrain = $('#detailsStrain').val();
  offerData.details_section.detailsAccess = $('#detailsAccess').val();
  offerData.details_section.detailsHousing = $('#detailsHousing').prop('checked');
  offerData.details_section.detailsRemuneration = $('#detailsRemuneration').val();
  offerData.details_section.detailsRisk = $('#detailsRisk').val();

  $('.detailsSection').remove();
  load_detailsSection();
}

function cancelDetails(){
  $('.detailsSection').remove();
}

function clearDetails(){
  document.getElementById("detailsForm").reset();
}

function loadDetails(){
  $('#detailsSchedule').val(offerData.details_section.detailsSchedule);
  $('#detailsRoll').val(offerData.details_section.detailsRoll);
  $('#detailsQuota').val(offerData.details_section.detailsQuota);
  $('#detailsStrain').val(offerData.details_section.detailsStrain);
  $('#detailsAccess').val(offerData.details_section.detailsAccess);
  $('#detailsHousing').prop('checked', offerData.details_section.detailsHousing);
  $('#detailsRemuneration').val(offerData.details_section.detailsRemuneration);
  $('#detailsRisk').val(offerData.details_section.detailsRisk);
}

$(document).ready(() => {
  loadDetails();
});