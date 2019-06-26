function saveDetails(){
  offer.details_section.schedule = $('#detailsSchedule').val();
  offer.details_section.roll = $('#detailsRoll').val();
  offer.details_section.quota = $('#detailsQuota').val();
  offer.details_section.strain = $('#detailsStrain').val();
  offer.details_section.access = $('#detailsAccess').val();
  offer.details_section.housing = $('#detailsHousing').prop('checked');
  offer.details_section.remuneration = $('#detailsRemuneration').val();
  offer.details_section.risk = $('#detailsRisk').val();

  $('.detailsSection').hide();
  load_detailsSection();
}

function cancelDetails(){
  $('.detailsSection').hide();
}

function clearDetails(){
  document.getElementById("detailsForm").reset();
}