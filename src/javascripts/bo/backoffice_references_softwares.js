let table = $('#softwares-table');

function operateFormatter() {
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
        id: 'editSoftwareModal',
        title: 'Modifier un logiciel',
        text: '<label for="softwareValueEdit"> Nom du logiciel </label><input class="form-control" type="text" id="softwareValueEdit">',
        actions: ['<button type="button" class="btn btn-default" id="btnEditSoftware"> Modifier le logiciel</button>']
      }, () => {
        $('button#btnEditSoftware').click(function () {
          if ($('input#softwareValueEdit').val() !== '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let promptInput = $('input#softwareValueEdit').val();
            $.put(`/api/back-office/references/softwares/${row.id}`, {
              promptInput,
              _csrf
            }, () => {
              let id = $(e.currentTarget).closest('tr').attr('data-id');
              $('#editSoftwareModal').modal('hide');
              $(`tr[data-id="${id}"] td`).last().prev().text(promptInput);
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Logiciel modifié :',
                message: `Le Logiciel a été modifié.`
              });
            });
          } else {
            if ($('input#softwareValueEdit').val() === '') {
              $('input#softwareValueEdit').addClass('error');
              setTimeout(function () {
                $('input#softwareValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row, index) => {
      createModal({
        id: 'removeSoftwareModal',
        title: 'Supprimer un logiciel',
        text: 'Êtes-vous sûr de vouloir supprimer ce logiciel ?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveSoftware" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveSoftware').click(function () {
          $.delete(`/api/back-office/references/softwares/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Logiciel supprimé :',
              message: `Le logiciel a été supprimé.`
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

function showSoftwareModal() {
  createModal({
    id: 'addSoftwareModal',
    title: 'Ajouter un logiciel',
    text: '<label for="softwareValue"> Nom du logiciel </label><input class="form-control" type="text" id="softwareValue">',
    actions: ['<button type="button" class="btn btn-default" id="validateSoftware"> Ajouter un logiciel</button>']
  }, () => {
    $('button#validateSoftware').click(function () {
      if ($('input#softwareValue').val() !== '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#softwareValue').val();
        $.post(`/api/back-office/references/softwares/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Logiciel existant :',
              message: `Ce logiciel existe déjà.`
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
              title: 'Logiciel créé :',
              message: `Le logiciel a été ajouté.`
            });
          }
        });
        $('#addSoftwareModal').modal('hide');
      } else {
        if ($('input#softwareValue').val() === '') {
          $('input#softwareValue').addClass('error');
          setTimeout(function () {
            $('input#softwareValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}