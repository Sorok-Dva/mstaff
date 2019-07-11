let helpMe = () => {
  createModal({
    id: 'helpModal',
    title: `Notices d'utilisation des pools`,
    modal: 'candidate/helpPool'
  }, () => {

  })
};
let serviceArray = [];
let servicesEdit = (selectedPool) => {
  createModal({
    id: 'serviceEditModal',
    title: `Ajouter un service`,
    modal: 'candidate/serviceAdd'
  }, () => {
    $('#addServiceButton').click(function () {
      if ($('#servicesSelect').val() !== '' && $('#experienceInput').val()) {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let pool = selectedPool.dataset.pool;
        let service =
          $.post(``)
      }
    })
  })
};
let editDisponibility = (selectedPool) => {
  createModal({
    id: 'serviceEditModal',
    title: `Choisir mes disponibilités`,
    modal: 'candidate/poolAvailability',
    size: 'modal-xl',
    pool: selectedPool.dataset.pool,
  }, () => {

  });
};

let seeMyServices = () => {
  $('#serviceEditModal').modal('hide');
  createModal({
    id: 'seeServicesModal',
    title: `Modifier les services désirés`,
    modal: 'candidate/serviceEdit'
  }, () => {

  })
};