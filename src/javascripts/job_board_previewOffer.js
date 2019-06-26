function loadPreviewOfferDate(){
  let oDate = datas.createdAt;
  oDate = moment(oDate).format('D MMMM YYYY');
  $('#offerDate').text('Offre publiée le '.concat(oDate));

}

function loadPreviewOfferContract(){
  let contract = datas.nature_section.contract_type;
  let oJobDate = datas.nature_section.start;

  oJobDate = isEmpty(datas.nature_section.start) ? '' : moment(oJobDate).format('D MMMM YYYY');
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
  let diploma = datas.prerequisites_section.diploma;
  let knowledge = datas.prerequisites_section.knowledge
  let skill = datas.prerequisites_section.skill;

  if (!isEmpty(diploma) || !isEmpty(knowledge) || !isEmpty(skill)){
    let contentDiploma = `<p class="font-source">${diploma}</p>`;
    let contentKnowledge = `<p class="font-source">${knowledge}</p>`;
    let contentSkill = `<p class="font-source">${skill}</p>`;

    let title = `<h4 class="light-grey mb-3">PREREQUIS</h4>`;
    let div = `<div class="mb-5">${title}${contentDiploma}${contentKnowledge}${contentSkill}</div>`;

    $('#previewMain').append(div);
  }
}

$(document).ready(() => {
  loadPreviewOfferDate();
  loadPreviewOfferContract();
  loadPrerequisites();
});