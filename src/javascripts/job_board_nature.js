function saveNature(){
  offerData.nature_section.natureDate = $('#natureDate').val();
  offerData.nature_section.natureTitle = $('#natureTitle').val();
  offerData.nature_section.natureJobSheet = $('#natureJobSheet').val();
  offerData.nature_section.natureContractType = $('#natureContractType').val();
  offerData.nature_section.natureJobStartDate = $('#natureJobStartDate').val();
  offerData.nature_section.natureContractDuration = $('#natureContractDuration').val();
  offerData.nature_section.natureGrade = $('#natureGrade').val();
  offerData.nature_section.natureCategory = $('#natureCategory').val();
  $('.natureSection').remove();
  load_natureSection();
}

function cancelNature(){
  $('.natureSection').remove();
}

function clearNature(){
  document.getElementById("natureForm").reset();
}

function loadNature(){
  $('#natureDate').val(moment(offerData.nature_section.natureDate).format('YYYY-MM-DD'));
  $('#natureTitle').val(offerData.nature_section.natureTitle);
  $('#natureJobSheet').val(offerData.nature_section.natureJobSheet);
  $('#natureContractType').val(offerData.nature_section.natureContractType);
  $('#natureJobStartDate').val(moment(offerData.nature_section.natureJobStartDate).format('YYYY-MM-DD'));
  $('#natureContractDuration').val(offerData.nature_section.natureContractDuration);
  $('#natureGrade').val(offerData.nature_section.natureGrade);
  $('#natureCategory').val(offerData.nature_section.natureCategory);
}

$(document).ready(() => {
  loadNature();
});