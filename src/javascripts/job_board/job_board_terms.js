function saveTerms(){
  offer.terms_sections.recruit = $('#termsRecruit').val();
  offer.terms_sections.mail = $('#termsMail').val();
  offer.terms_sections.contractual = $('#termsContractual').prop('checked');
  offer.terms_sections.military = $('#termsMilitary').prop('checked');

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
  $('#termsRecruit').val(offer.terms_sections.recruit);
  $('#termsMail').val(offer.terms_sections.mail);
  $('#termsContractual').prop('checked', offer.terms_sections.contractual);
  $('#termsMilitary').prop('checked', offer.terms_sections.military);
}

$(document).ready(() => {
  loadTerms();
});