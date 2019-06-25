function saveDetails(){
  offer.details_section.schedule = $('#detailsSchedule').val();
  offer.details_section.roll = $('#detailsRoll').val();
  offer.details_section.quota = $('#detailsQuota').val();
  offer.details_section.strain = $('#detailsStrain').val();
  offer.details_section.access = $('#detailsAccess').val();
  offer.details_section.housing = $('#detailsHousing').prop('checked');
  offer.details_section.remuneration = $('#detailsRemuneration').val();
  offer.details_section.risk = $('#detailsRisk').val();

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
  $('#detailsSchedule').val(offer.details_section.schedule);
  $('#detailsRoll').val(offer.details_section.roll);
  $('#detailsQuota').val(offer.details_section.quota);
  $('#detailsStrain').val(offer.details_section.strain);
  $('#detailsAccess').val(offer.details_section.access);
  $('#detailsHousing').prop('checked', offer.details_section.housing);
  $('#detailsRemuneration').val(offer.details_section.remuneration);
  $('#detailsRisk').val(offer.details_section.risk);
}

$(document).ready(() => {
  loadDetails();
});