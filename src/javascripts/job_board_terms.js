function saveTerms(){
  offerData.terms_sections.termsRecruit = $('#termsRecruit').val();
  offerData.terms_sections.termsMail = $('#termsMail').val();
  offerData.terms_sections.termsContractual = $('#termsContractual').prop('checked');
  offerData.terms_sections.termsMilitary = $('#termsMilitary').prop('checked');

  $('.termsSection').remove();
  load_termsSection();
}

function cancelTerms(){
  $('.termsSection').remove();
}

function clearTerms(){
  document.getElementById("termsForm").reset();
}

function loadTerms(){
  $('#termsRecruit').val(offerData.terms_sections.termsRecruit);
  $('#termsMail').val(offerData.terms_sections.termsMail);
  $('#termsContractual').prop('checked', offerData.terms_sections.termsContractual);
  $('#termsMilitary').prop('checked', offerData.terms_sections.termsMilitary);
}

$(document).ready(() => {
  loadTerms();
});