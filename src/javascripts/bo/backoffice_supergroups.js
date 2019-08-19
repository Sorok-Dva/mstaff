let table = $('#superGroups-table');

operateFormatter = (value, row, index) => {
  return [
    '<div class="table-icons">',
    '<a title="Lier des utilisateurs" class="btn btn-simple btn-primary btn-icon table-action linkUsers" href="javascript:void(0)">',
    '<i class="ti-user"></i>',
    '</a>',
    '<a title="Lier des groupes" class="btn btn-simple btn-success btn-icon table-action link" href="javascript:void(0)">',
    '<i class="ti-sharethis"></i>',
    '</a>',
    '<a title="Modifier le supergroupe" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
    '<i class="ti-pencil-alt"></i>',
    '</a>',
    '<a title="Supprimer le supergroupe" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
    '<i class="ti-close"></i>',
    '</a>',
    '</div>',
  ].join('');
};

$(document).ready(() => {
  window.operateEvents = {
    'click .linkUsers': (e, value, row, index) => {
      createModal({
        id: 'linkGroupModal',
        title: 'Ajouter / modifier utilisateurs liés à ' + row.name,
        modal: 'back-office/linkUsersSuperGroup',
        size: 'modal-xl',
        style: 'width:60%',
        group: row
      });
    },
    'click .link': (e, value, row, index) => {
      createModal({
        id: 'linkSuperGroupModal',
        title: 'Lier des groupes à ' + row.name,
        modal: 'back-office/linkSuperGroup',
        supergroup: row
      }, () => {
        $('button#validateLinkSuperGroup').click(function () {
          if ($('select#establishmentsID').val() !== '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let selectInput = $('select#groupsID').val();
            $.put(`/api/back-office/linkGroup/${row.id}`, {
              selectInput,
              _csrf
            }, () => {
              $('#linkSuperGroupModal').modal('hide');
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Groupe(s) lié(s) :',
                message: 'des groupes ont été liés au super groupe.'
              });
            });
          }
        })
      });
    },
    'click .edit': (e, value, row, index) => {
      let id = $(e.currentTarget).closest('tr').attr('data-id');
      createModal({
        id: 'editSuperGroupModal',
        title: 'Modifier un Super Groupe',
        modal: 'back-office/editSuperGroups',
        supergroup: {
          name: $(`tr[data-id="${id}"] td#sg-name`).text(),
          logo: $(`tr[data-id="${id}"] td#sg-logo`).text(),
          banner: $(`tr[data-id="${id}"] td#sg-banner`).text(),
          domain_name: $(`tr[data-id="${id}"] td#sg-domain`).text(),
          domain_enable: $(`tr[data-id="${id}"] td#sg-state`).text()
        }
      }, () => {
        $('button#btnEditSuperGroup').click(function () {
          if ($('input#superGroupValueEdit').val() !== '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let name = $('input#superGroupValueEdit').val();
            let logo = $('input#superGroupLogoEdit').val();
            let banner = $('input#superGroupBannerEdit').val();
            let domain_name = $('input#superGroupDomainNameEdit').val();
            let domain_enable = $('select#superGroupDomainEdit').val();
            $.put(`/api/back-office/groups/SuperGroups/${row.id}`, {
              name, logo, banner, domain_name, domain_enable, _csrf
            }, (data) => {
              if (data.error) {
                notification({
                  icon: 'exclamation',
                  type: 'danger',
                  title: 'Un problème est survenue :',
                  message: data.error
                });
              }
              $('#editSuperGroupModal').modal('hide');
              $(`tr[data-id="${id}"] td#sg-name`).text(name);
              $(`tr[data-id="${id}"] td#sg-logo`).text(logo);
              $(`tr[data-id="${id}"] td#sg-banner`).text(banner);
              $(`tr[data-id="${id}"] td#sg-domain`).text(domain_name);
              $(`tr[data-id="${id}"] td#sg-state`).text(domain_enable === '0' ? 'Inactif' : 'Actif');
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Super groupe modifié :',
                message: 'Le super groupe a bien été modifié.'
              });
            });
          } else {
            if ($('input#superGroupValueEdit').val() === '') {
              $('input#superGroupValueEdit').addClass('error');
              setTimeout(function () {
                $('input#superGroupValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row, index) => {
      createModal({
        id: 'removeSuperGroupModal',
        title: 'Supprimer un super groupe',
        text: 'Êtes-vous sûr de vouloir supprimer ce super groupe ?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveSuperGroup" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveSuperGroup').click(function () {
          $.delete(`/api/back-office/groups/SuperGroups/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Super groupe supprimé :',
              message: `Le super groupe a bien été supprimé.`
            });
          });
        });
      });
    }
  };

  table.bootstrapTable({
    toolbar: '.toolbar',
    search: true,

    showColumns: true,
    pagination: true,
    searchAlign: 'left',
    pageSize: 25,
    clickToSelect: true,
    pageList: [10, 25, 50, 100, 200, 500],
    formatRecordsPerPage: (pageNumber) => {
      return pageNumber + ' rows visible';
    },
    icons: {
      columns: 'fa fa-columns',
      detailOpen: 'fa fa-plus-circle',
      detailClose: 'ti-close'
    }
  });

  //activate the tooltips after the data table is initialized
  $('[rel="tooltip"]').tooltip();

  $(window).resize(() => {
    table.bootstrapTable('resetView');
  });
});
let showSuperGroupModal = () => {
  createModal({
    id: 'addSuperGroupModal',
    title: 'Ajouter un super groupe',
    text: '<label for="superGroupValue"> Nom du Super Groupe </label><input class="form-control" type="text" id="superGroupValue">',
    actions: ['<button type="button" class="btn btn-default" id="validateSuperGroup"> Ajouter un super groupe</button>']
  }, () => {
    $('button#validateSuperGroup').click(function () {
      if ($('input#superGroupValue').val() != '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#superGroupValue').val();
        $.post(`/api/back-office/groups/SuperGroups/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Super groupe existant :',
              message: `Ce super groupe existe déjà.`
            });
          } else {
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Super Groupe créé :',
              message: `Le super groupe a bien été crée.`,
              onClosed: location.reload()
            });
          }
        });
        $('#addSuperGroupModal').modal('hide');
      } else {
        if ($('input#superGroupValue').val() == '') {
          $('input#superGroupValue').addClass('error');
          setTimeout(function () {
            $('input#superGroupValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}