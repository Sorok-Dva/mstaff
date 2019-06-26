function savePostDescription(){
  if (!_.isNil($('#postPresentation').trumbowyg('html')))offer.postDescription_section.presentation = $('#postPresentation').trumbowyg('html');
  if (!_.isNil($('#postTeam').val()))offer.postDescription_section.team = $('#postTeam').val();
  if (!_.isNil($('#postUphill').val()))offer.postDescription_section.uphill = $('#postUphill').val();
  if (!_.isNil($('#postBacking').val()))offer.postDescription_section.backing = $('#postBacking').val();
  if (!_.isNil($('#postExternal').val()))offer.postDescription_section.external = $('#postExternal').val();
  if (!_.isNil($('#postInternal').trumbowyg('html')))offer.postDescription_section.internal = $('#postInternal').trumbowyg('html');
  if (!_.isNil($('#postInternService').val()))offer.postDescription_section.internService = $('#postInternService').val();

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