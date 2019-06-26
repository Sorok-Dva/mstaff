function savePostDescription(){
  offer.postDescription_section.presentation = $('#postPresentation').trumbowyg('html');
  offer.postDescription_section.team = $('#postTeam').val();
  offer.postDescription_section.uphill = $('#postUphill').val();
  offer.postDescription_section.backing = $('#postBacking').val();
  offer.postDescription_section.external = $('#postExternal').val();
  offer.postDescription_section.internal = $('#postInternal').trumbowyg('html');
  offer.postDescription_section.internService = $('#postInternService').val();

  $('.postDescriptionSection').hide();
  load_postDescriptionSection();
}

function cancelPostDescription(){
  $('.postDescriptionSection').hide();
}

function clearPostDescription(){
  document.getElementById("postDescriptionForm").reset();
  $('#postPresentation').trumbowyg('empty');
  $('#postInternal').trumbowyg('empty');
}