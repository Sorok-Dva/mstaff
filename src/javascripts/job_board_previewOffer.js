function loadPreviewOfferDate(){
  let oDate = offer.createdAt;
  oDate = moment(new Date(oDate)).format('D MMMM YYYY');
  $('#offerDate').text('Offre publiée le '.concat(oDate));

}

function loadPreviewOfferContract(){
  let contract = offer.nature_section.contract_type;
  let oJobDate = offer.nature_section.start;

  oJobDate = isEmpty(offer.nature_section.start) ? '' : moment(new Date(oJobDate)).format('D MMMM YYYY');
  switch (contract) {
    case 'cdi-cdd':
      contract = 'CDI';
      break;
    case 'vacation':
      contract = 'VACATION';
      break;
    case 'internship':
      contract = 'STAGE';
      break;
    default:
      contract = 'Contrat à définir';
  }
  $('#offerContract').text(contract.concat(' à partir du ').concat(oJobDate));
}

function loadPrerequisites(){
  let diploma = offer.prerequisites_section.diploma;
  let knowledge = offer.prerequisites_section.knowledge;
  let skill = offer.prerequisites_section.skill;

  if (!isEmpty(diploma) || !isEmpty(knowledge) || !isEmpty(skill)){
    let contentDiploma = `<p class="font-source">${diploma}</p>`;
    let contentKnowledge = `<p class="font-source">${knowledge}</p>`;
    let contentSkill = `<p class="font-source">${skill}</p>`;

    let title = `<h4 class="light-grey mb-3">PREREQUIS</h4>`;
    let div = `<div class="mb-5">${title}${contentDiploma}${contentKnowledge}${contentSkill}</div>`;

    $('#previewMain').append(div);
  }
}

function loadTerms(){
  let recruit = offer.terms_sections.recruit;
  let mail = offer.terms_sections.mail;
  let contractual = offer.terms_sections.contractual;
  let military = offer.terms_sections.military;

  if (!isEmpty(recruit) || !isEmpty(mail) || contractual || military){
    let contentRecruit = `<p class="font-source">${recruit}</p>`;
    let contentMail = `<p class="font-source">${mail}</p>`;
    let contentContractual = contractual ? `<p class="font-source">Ouvert aux contractuels</p>` : '';
    let contentMilitary = military ? `<p class="font-source">Ouvert aux militaires</p>` : '';

    let title = `<h4 class="light-grey mb-3">MODALITES DE CANDIDATURE</h4>`;
    let div = `<div class="mb-5">${title}${contentRecruit}${contentMail}${contentContractual}${contentMilitary}</div>`;

    $('#previewMain').append(div);

  }
}

$(document).ready(() => {
  loadPreviewOfferDate();
  loadPreviewOfferContract();
  loadPrerequisites();
  loadTerms();
});