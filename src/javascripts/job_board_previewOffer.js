function loadPreviewOfferDate(){
  let oDate = datas.createdAt;
  oDate = moment(oDate).format('D MMMM YYYY');
  $('#offerDate').text('Offre publiée le '.concat(oDate));

}

function loadPreviewOfferContract(){
  let contract = datas.nature_section.contract_type;
  let oJobDate = datas.nature_section.start;

  oJobDate = moment(oJobDate).format('D MMMM YYYY');
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

function loadPreviewContent(){

}

$(document).ready(() => {
  loadPreviewOfferDate();
  loadPreviewOfferContract();
  loadPreviewContent();
});