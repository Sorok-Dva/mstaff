let table = $('#services-table');

function operateFormatter(value, row, index) {
  return [
    '<div class="table-icons">',
    '<a title="Edit" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
    '<i class="ti-pencil-alt"></i>',
    '</a>',
    '<a title="Remove" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
    '<i class="ti-close"></i>',
    '</a>',
    '</div>',
  ].join('');
}

$(document).ready(() => {
  window.operateEvents = {
    'click .edit': (e, value, row, index) => {
      createModal({
        id: 'editServiceModal',
        title: 'Modifier un service',
        text: '<label for="serviceValueEdit"> Nom du service </label><input class="form-control" type="text" id="serviceValueEdit">',
        actions: ['<button type="button" class="btn btn-default" id="btnEditService"> Modifier le service</button>']
      }, () => {
        $('button#btnEditService').click(function () {
          if ($('input#serviceValueEdit').val() != '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let promptInput = $('input#serviceValueEdit').val();
            $.put(`/api/back-office/references/services/${row.id}`, {
              promptInput,
              _csrf
            }, () => {
              let id = $(e.currentTarget).closest('tr').attr('data-id');
              $('#editServiceModal').modal('hide');
              $(`tr[data-id="${id}"] td`).last().prev().text(promptInput);
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Service modifié :',
                message: `Le service a bien été modifié.`
              });
            });
          } else {
            if ($('input#serviceValueEdit').val() == '') {
              $('input#serviceValueEdit').addClass('error');
              setTimeout(function () {
                $('input#serviceValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row, index) => {
      createModal({
        id: 'removeServiceModal',
        title: 'Supprimer un service',
        text: 'Êtes-vous sûr de vouloir supprimer ce service ?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveService" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveService').click(function () {
          $.delete(`/api/back-office/references/services/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Service supprimé :',
              message: `Le service a bien été supprimé.`
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

function showServiceModal() {
  createModal({
    id: 'addServiceModal',
    title: 'Ajouter un service',
    text: '<label for="serviceValue"> Nom du service </label><input class="form-control" type="text" id="serviceValue">',
    actions: ['<button type="button" class="btn btn-default" id="validateService"> Ajouter un service</button>']
  }, () => {
    $('button#validateService').click(function () {
      if ($('input#serviceValue').val() != '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#serviceValue').val();
        $.post(`/api/back-office/references/services/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Service existant :',
              message: `Ce service existe déjà.`
            });
          } else {
            table.bootstrapTable('insertRow', {
              index: 0,
              row: {
                id: response.reference.id,
                name: response.reference.name,
                actions: operateFormatter()
              }
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Service créé :',
              message: `Le service a bien été crée.`
            });
          }
        });
        $('#addServiceModal').modal('hide');
      } else {
        if ($('input#serviceValue').val() == '') {
          $('input#serviceValue').addClass('error');
          setTimeout(function () {
            $('input#serviceValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}