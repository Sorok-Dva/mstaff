function saveNature(){
  offer.createdAt = $('#natureDate').val().replace(/-/g, '/');
  offer.name = $('#natureTitle').val();
  offer.nature_section.jobSheet = $('#natureJobSheet').trumbowyg('html');
  offer.nature_section.contract_type = $('#contract_type').val();
  offer.nature_section.start = $('#start').val().replace(/-/g, '/');
  offer.nature_section.contractDuration = $('#natureContractDuration').val();
  offer.nature_section.grade = $('#natureGrade').val();
  offer.nature_section.category = $('#natureCategory').val();
  $('.natureSection').hide();
  load_natureSection();
}

function cancelNature(){
  $('.natureSection').hide();
}

function clearNature(){
  document.getElementById("natureForm").reset();
  $('#contract_type').val(null).trigger('change');
  $('#natureJobSheet').trumbowyg('empty');
}

$(document).ready(() => {
  $('#contract_type').select2();
});