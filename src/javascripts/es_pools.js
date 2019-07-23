function createPool(data) {
  createModal({
    id: 'createPoolModal',
    modal: 'es/createPool',
    title: 'Créer un pool de remplaçants',
  }, () => {
    $('button#createPoolButton').click(function () {
      if ($('#personnelMails').val() !== '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let pool = $('#poolName').val();
        let referent = $('#referentName').val();
        let mails = $('#personnelMails').val();

        $.post(`/my-pool`, {
          _csrf,
          pool,
          referent,
          mails
        }, () => {
          location.reload();
        })
      } else {
        notification({
          icon: 'flag',
          type: 'warning',
          title: 'Informations manquantes :',
          message: `Vous devez entrer au moins une addresse e-mail.`
        });
      }
    });
  });
};

function poolUsersList(poolToEdit) {
  $.get(`pool/${poolToEdit.dataset.pool}/volunteers`, function (res) {
    let candidates = res.users;
    createModal({
      id:'displayPoolCandidates',
      modal: 'es/poolCandidates',
      title: 'Liste des volontaires du pool',
      pool: poolToEdit.dataset.pool,
      candidates: candidates,
      size: 'modal-xl',
    });
  });
};

function editPool(poolToEdit) {
  createModal({
    id: 'editPoolModal',
    modal: 'es/editPool',
    title: 'Modifier un pool de remplaçant',
    name: poolToEdit.dataset.name,
    referent: poolToEdit.dataset.referent
  }, () => {
    $('button#editPoolButton').click(function () {
      let _csrf = $('meta[name="csrf-token"]').attr('content');
      let name = $('#newPoolName').val();
      let referent = $('#newReferentName').val();
      let pool = poolToEdit.dataset.pool;
      $.put(`/my-pool`, {
        _csrf,
        pool,
        referent,
        name
      }, (response) => {
        if (response === 'Modifications done') {
          location.reload();
        }
      })
    });
    $('button#deletePoolButton').click(function () {
      $('#editPoolModal').modal('hide');
      createModal({
        id: 'removePoolModal',
        modal: 'es/removePool',
        title: 'Supprimer un pool de remplaçants'
      }, () => {
        $('#confirmRemoveButton').click(function () {
          let _csrf = $('meta[name="csrf-token"]').attr('content');
          let pool = poolToEdit.dataset.pool;
          $.delete(`/my-pool`, {
            _csrf,
            pool
          }, (response) => {
            if (response === 'Pool removed') {
              $('#removePoolModal').modal('hide');
              location.reload();
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Pool supprimé :',
                message: `Pool supprimé avec succès`
              });
            }
          })
        });
      });
    });
  });
};
function poolInvitation(selectedPool) {
  createModal({
    id: 'invitePoolModal',
    modal: 'es/poolInvitation',
    title: 'Inviter des soignants',
    pool_id: selectedPool.dataset.pool,
  }, () => {
    $('button#createPoolButton').click(function () {
      if ($('#newPersonnelMails').val() !== '') {
        let mails = $('#newPersonnelMails').val();
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let pool_id = selectedPool.dataset.pool;
        $.post(`/pool/${pool_id}/invites`, {
          _csrf,
          mails,
        }, (response) => {
          if (response === 'Invitations sent') {
            $('#invitePoolModal').modal('hide');
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Invitations pool :',
              message: `Invitation(s) au pool envoyée(s)`
            });
          }
        });
      }
    });
  })
};

function personnelStep() {
  if ($('#poolName').val() !== '' && $('#referentName').val() !== '')
  {
    $('#addPersonnelButton').toggle();
    $('#poolNameLabel').toggle();
    $('#referentNameLabel').toggle();
    $('#personnelMailsLabel').toggle();
    $('#esNameDiv').hide();
    $('#toggleDiv').hide();
    $('#referentName').toggle();
    $('#poolName').toggle();
    $('#createPoolButton').toggle();
    $('#personnelMails').multiple_emails({
      position: 'top',
      theme: 'bootstrap',
      checkDupEmail: true
    });
  } else {
    notification({
      icon: 'flag',
      type: 'warning',
      title: 'Informations manquantes :',
      message: `Vous devez entrer le nom de votre pool ainsi que le nom du référent.`
    });
  }
};

function displayCalendar(id)
{
  let userpool_id = Number(id.dataset.user);
  let username = id.dataset.name;
  $('#vacationDateDiv').show();
  $('#candidateName').text(username);
  $('#main').hide();
  data = { availability: {} };
  resetCalendar();
  loadPreviousDatas(userpool_id);
}

function backToMain()
{
  $('#vacationDateDiv').hide();
  $('#main').show();
}