function savePostDescription(){
  offerData.postDescription_section.postPresentation = $('#postPresentation').val();
  offerData.postDescription_section.postTeam = $('#postTeam').val();
  offerData.postDescription_section.postUphill = $('#postUphill').val();
  offerData.postDescription_section.postBacking = $('#postBacking').val();
  offerData.postDescription_section.postExternal = $('#postExternal').val();
  offerData.postDescription_section.postInternal = $('#postInternal').val();
  offerData.postDescription_section.postInternService = $('#postInternService').val();

  $('.postDescriptionSection').remove();
  load_postDescriptionSection();
}

function cancelPostDescription(){
  $('.postDescriptionSection').remove();
}

function clearPostDescription(){
  document.getElementById("postDescriptionForm").reset();
}

function loadPostDescription(){
  $('#postPresentation').val(offerData.postDescription_section.postPresentation);
  $('#postTeam').val(offerData.postDescription_section.postTeam);
  $('#postUphill').val(offerData.postDescription_section.postUphill);
  $('#postBacking').val(offerData.postDescription_section.postBacking);
  $('#postExternal').val(offerData.postDescription_section.postExternal);
  $('#postInternal').val(offerData.postDescription_section.postInternal);
  $('#postInternService').val(offerData.postDescription_section.postInternService);
}

$(document).ready(() => {
  loadPostDescription();
});