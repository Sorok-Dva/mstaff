function savePostDescription(){
  offer.postDescription_section.presentation = $('#postPresentation').trumbowyg('html');
  offer.postDescription_section.team = $('#postTeam').val();
  offer.postDescription_section.uphill = $('#postUphill').val();
  offer.postDescription_section.backing = $('#postBacking').val();
  offer.postDescription_section.external = $('#postExternal').val();
  offer.postDescription_section.internal = $('#postInternal').trumbowyg('html');
  offer.postDescription_section.internService = $('#postInternService').val();

  $('.postDescriptionSection').remove();
  load_postDescriptionSection();
}

function cancelPostDescription(){
  $('.postDescriptionSection').remove();
}

function clearPostDescription(){
  document.getElementById("postDescriptionForm").reset();
  $('#postPresentation').trumbowyg('empty');
  $('#postInternal').trumbowyg('empty');
}

function loadPostDescription(){
  $('#postPresentation').trumbowyg('html', offer.postDescription_section.presentation);
  $('#postTeam').val(offer.postDescription_section.team);
  $('#postUphill').val(offer.postDescription_section.uphill);
  $('#postBacking').val(offer.postDescription_section.backing);
  $('#postExternal').val(offer.postDescription_section.external);
  $('#postInternal').trumbowyg('html', offer.postDescription_section.internal);
  $('#postInternService').val(offer.postDescription_section.internService);
}

$(document).ready(() => {
  inittrumbowyg();
  loadPostDescription();
});