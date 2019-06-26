function saveNature(){
  offer.createdAt = $('#natureDate').val();
  offer.name = $('#natureTitle').val();
  offer.nature_section.jobSheet = $('#natureJobSheet').val();
  offer.nature_section.contract_type = $('#contract_type').val();
  offer.nature_section.start = $('#start').val();
  offer.nature_section.contractDuration = $('#natureContractDuration').val();
  offer.nature_section.grade = $('#natureGrade').val();
  offer.nature_section.category = $('#natureCategory').val();
  $('.natureSection').remove();
  load_natureSection();
}

function cancelNature(){
  $('.natureSection').remove();
}

function clearNature(){
  document.getElementById("natureForm").reset();
  $('#contract_type').val(null).trigger('change');
}

function loadNature(){
  $('#natureDate').val(moment(offer.createdAt).format('YYYY-MM-DD'));
  $('#natureTitle').val(offer.name);
  $('#natureJobSheet').val(offer.nature_section.jobSheet);
  $('#contract_type').val(offer.nature_section.contract_type);
  $('#start').val(moment(offer.nature_section.start).format('YYYY-MM-DD'));
  $('#natureContractDuration').val(offer.nature_section.contractDuration);
  $('#natureGrade').val(offer.nature_section.grade);
  $('#natureCategory').val(offer.nature_section.category);
}

$(document).ready(() => {
  loadNature();
  $('#contract_type').select2();
});