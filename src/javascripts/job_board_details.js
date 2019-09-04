function saveDetails(){
  if (!_.isNil($('#detailsSchedule').val())) offer.details_section.schedule = $('#detailsSchedule').val();
  if (!_.isNil($('#detailsRoll').val())) offer.details_section.roll = $('#detailsRoll').val();
  if (!_.isNil($('#detailsQuota').val())) offer.details_section.quota = $('#detailsQuota').val();
  if (!_.isNil($('#detailsStrain').val())) offer.details_section.strain = $('#detailsStrain').val();
  if (!_.isNil($('#detailsAccess').val())) offer.details_section.access = $('#detailsAccess').val();
  if (!_.isNil($('#detailsRemuneration').val())) offer.details_section.remuneration = $('#detailsRemuneration').val();
  if (!_.isNil($('#detailsRisk').val())) offer.details_section.risk = $('#detailsRisk').val();
  offer.details_section.housing = $('#detailsHousing').prop('checked');

  $('.detailsSection').hide();
  load_detailsSection();
}

function cancelDetails(){
  $('.detailsSection').hide();
}

function clearDetails(){
  document.getElementById("detailsForm").reset();
}