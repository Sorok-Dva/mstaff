$(document).ready(() => {
  let contract = offerContract;
  let oDate = offerDate;
  let oJobDate = offerJobDate;

  oDate = moment(oDate).format('D MMMM YYYY');
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

  $('#offerDate').text('Offre publiée le '.concat(oDate));
  $('#offerContract').text(contract.concat(' à partir du ').concat(oJobDate));
});