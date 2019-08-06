let table = $('#groups-table');

operateFormatter = (value, row, index) => {
  return [
    '<div class="table-icons">',
    '<a title="Lier des utilisateurs" class="btn btn-simple btn-primary btn-icon table-action linkUsers" href="javascript:void(0)">',
    '<i class="ti-user"></i>',
    '</a>',
    '<a title="Lier des établissements" class="btn btn-simple btn-success btn-icon table-action link" href="javascript:void(0)">',
    '<i class="ti-rss-alt"></i>',
    '</a>',
    '<a title="Modifier le groupe" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
    '<i class="ti-pencil-alt"></i>',
    '</a>',
    '<a title="Supprimer le groupe" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
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
        modal: 'back-office/linkUsersGroup',
        size: 'modal-xl',
        style: 'width:60%',
        group: row
      });
    },
    'click .link': (e, value, row, index) => {
      createModal({
        id: 'linkGroupModal',
        title: 'Lier des établissements à ' + row.name,
        modal: 'back-office/linkGroup',
        group: row
      }, () => {
        $('button#validateLinkGroup').click(function () {
          if ($('select#establishmentsID').val() !== '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let selectInput = $('select#establishmentsID').val();
            $.put(`/api/back-office/linkES/${row.id}`, {
              selectInput,
              _csrf
            }, () => {
              $('#linkGroupModal').modal('hide');
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Etablissement(s) lié(s) :',
                message: 'Les établissements sélectionnés ont été ajoutés.'
              });
            });
          }
        })
      });
    },
    'click .edit': (e, value, row, index) => {
      let id = $(e.currentTarget).closest('tr').attr('data-id');
      createModal({
        id: 'editGroupModal',
        title: 'Modifier un groupe',
        modal: 'back-office/editGroup',
        group: {
          name: $(`tr[data-id="${id}"] td`).first().next().next().text(),
          logo: $(`tr[data-id="${id}"] td`).first().next().next().next().text(),
          banner: $(`tr[data-id="${id}"] td`).last().prev().prev().prev().text(),
          domain_name: $(`tr[data-id="${id}"] td`).last().prev().prev().text(),
          domain_enable: $(`tr[data-id="${id}"] td`).last().prev().text(),
        }
      }, () => {
        $('button#btnEditGroup').click(function () {
          if ($('input#groupValueEdit').val() !== '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let name = $('input#groupValueEdit').val();
            let logo = $('input#groupLogoEdit').val();
            let banner = $('input#groupBannerEdit').val();
            let domain_name = $('input#groupUrlEdit').val();
            let domain_enable = $('select#groupDomainEdit').val();
            $.put(`/api/back-office/groups/Groups/${row.id}`, {
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
              $('#editGroupModal').modal('hide');
              $(`tr[data-id="${id}"] td`).first().next().next().text(name);
              $(`tr[data-id="${id}"] td`).first().next().next().next().text(logo);
              $(`tr[data-id="${id}"] td`).last().prev().prev().prev().text(banner);
              $(`tr[data-id="${id}"] td`).last().prev().prev().text(domain_name);
              $(`tr[data-id="${id}"] td`).last().prev().text(domain_enable === '0' ? 'Inactif' : 'Actif');
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Groupe modifié :',
                message: 'Le groupe a bien été modifié.'
              });
            });
          } else {
            if ($('input#groupValueEdit').val() === '') {
              $('input#groupValueEdit').addClass('error');
              setTimeout(function () {
                $('input#groupValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row, index) => {
      createModal({
        id: 'removeGroupModal',
        title: 'Supprimer un groupe',
        text: 'Êtes-vous sûr de vouloir supprimer ce groupe ?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveGroup" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveGroup').click(function () {
          $.delete(`/api/back-office/groups/Groups/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Groupe supprimé :',
              message: `Le groupe a bien été supprimé.`
            });
          });
        });
      });
    }
  };

  table.bootstrapTable({
    toolbar: ".toolbar",
    search: true,

    showColumns: true,
    pagination: true,
    searchAlign: 'left',
    pageSize: 25,
    clickToSelect: true,
    pageList: [10, 25, 50, 100, 200, 500],
    formatRecordsPerPage: (pageNumber) => {
      return pageNumber + " rows visible";
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

let showGroupModal = () => {

  createModal({
    id: 'addGroupModal',
    title: 'Ajouter un groupe',
    text: '<label for="groupValue"> Nom du Groupe </label><input class="form-control" type="text" id="groupValue">',
    actions: ['<button type="button" class="btn btn-default" id="validateGroup"> Ajouter un groupe</button>']
  }, () => {
    $('button#validateGroup').click(function () {
      if ($('input#groupValue').val() !== '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#groupValue').val();
        $.post(`/api/back-office/groups/Groups/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Groupe existant :',
              message: `Ce groupe existe déjà.`
            });
          } else {
            table.bootstrapTable('insertRow', {
              index: 0,
              row: {
                id: response.group.id,
                name: response.group.name
              }
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Groupe créé :',
              message: `Le groupe a bien été crée.`,
              onClosed: location.reload()
            });
          }
        });
        $('#addGroupModal').modal('hide');
      } else {
        if ($('input#groupValue').val() == '') {
          $('input#groupValue').addClass('error');
          setTimeout(function () {
            $('input#groupValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}