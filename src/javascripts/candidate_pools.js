let helpMe = () => {
  createModal({
    id: 'helpModal',
    title: `Notices d'utilisation des pools`,
    modal: 'candidate/helpPool'
  }, () => {

  })
};

let servicesEdit = (selectedPool) => {
  createModal({
    id: 'serviceEditModal',
    title: `Ajouter un service`,
    modal: 'candidate/poolAddService',
    pool: selectedPool.dataset.pool,
  });
};

let editAvailibility = (selectedPool) => {
  createModal({
    id: 'serviceEditModal',
    title: `Choisir mes disponibilités`,
    modal: 'candidate/poolAvailability',
    size: 'modal-xl',
    pool: selectedPool.dataset.pool,
  });
};

let uploadFile = (selectedPool) => {
  createModal({
    id: 'poolUploadFile',
    title: `Ajouter mon planning de service`,
    modal: 'candidate/uploadServicePlanning',
    pool: selectedPool.dataset.pool,
  }, function() {
    $('h4#planningText').text(selectedPool.dataset.planning);
    if(selectedPool.dataset.planning) {
      $(`#planningAvailable`).show();
    } else {
      $(`#planningNotAvailable`).show();
    }
  });
};

let changeStatus = (toggle) => {
  let state = $(`#${toggle.id}`).prop("checked");
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  let id = toggle.dataset.id;

  $.put(`/pools/status/${id}`, { _csrf, state }, res => {
    if(res == "Availability status updated")
    {
      let message;
      if(state)
        message = "Votre profil est désormais visible pour l'établissement selectionné.";
        else
        message = "Votre profil désormais invisible pour l'établissement selectionné.";
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Disponibilité',
        message: `${message}`
      });
    }
  });
};