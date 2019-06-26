function saveNature(){
  if (!_.isNil($('#natureJobSheet').trumbowyg('html')))offer.nature_section.jobSheet = $('#natureJobSheet').trumbowyg('html');
  if (!_.isNil($('#contract_type').val()))offer.nature_section.contract_type = $('#contract_type').val();
  if (!_.isNil($('#start').val()))offer.nature_section.start = $('#start').val();
  if (!_.isNil($('#natureContractDuration').val()))offer.nature_section.contractDuration = $('#natureContractDuration').val();
  if (!_.isNil($('#natureGrade').val()))offer.nature_section.grade = $('#natureGrade').val();
  if (!_.isNil($('#natureCategory').val()))offer.nature_section.category = $('#natureCategory').val();
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