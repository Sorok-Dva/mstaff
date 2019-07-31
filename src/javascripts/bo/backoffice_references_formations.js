let table = $('#formations-table');

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
    'click .edit': (e, value, row) => {
      createModal({
        id: 'editFormationModal',
        title: 'Modifier une formation',
        text: '<label for="formationValueEdit"> Nom de la formation </label><input class="form-control" type="text" id="formationValueEdit">',
        actions: ['<button type="button" class="btn btn-default" id="btnEditFormation"> Modifier la formation</button>']
      }, () => {
        $('button#btnEditFormation').click(function () {
          if ($('input#formationValueEdit').val() !== '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let promptInput = $('input#formationValueEdit').val();
            $.put(`/api/back-office/references/formations/${row.id}`, {
              promptInput,
              _csrf
            }, () => {
              let id = $(e.currentTarget).closest('tr').attr('data-id');
              $('#editFormationModal').modal('hide');
              $(`tr[data-id="${id}"] td`).last().prev().text(promptInput);
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Formation modifiée :',
                message: `La formation a bien été modifiée.`
              });
            });
          } else {
            if ($('input#formationValueEdit').val() === '') {
              $('input#formationValueEdit').addClass('error');
              setTimeout(function () {
                $('input#formationValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row) => {
      createModal({
        id: 'removeFormationModal',
        title: 'Supprimer une formation',
        text: 'Êtes-vous sûr de vouloir supprimer cette formation ?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveFormation" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveFormation').click(function () {
          $.delete(`/api/back-office/references/formations/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Formation supprimée :',
              message: `La formation a bien été supprimée.`
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

function showFormationModal() {
  createModal({
    id: 'addFormationModal',
    title: 'Ajouter une formation',
    text: '<label for="formationValue"> Nom de la formation </label><input class="form-control" type="text" id="formationValue">',
    actions: ['<button type="button" class="btn btn-default" id="validateFormation"> Ajouter une formation</button>']
  }, () => {
    $('button#validateFormation').click(function () {
      if ($('input#formationValue').val() !== '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#formationValue').val();
        $.post(`/api/back-office/references/formations/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Formation existante :',
              message: `Cette formation existe déjà.`
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
              title: 'Formation créée :',
              message: `La formation a bien été créée.`
            });
          }
        });
        $('#addFormationModal').modal('hide');
      } else {
        if ($('input#formationValue').val() === '') {
          $('input#formationValue').addClass('error');
          setTimeout(function () {
            $('input#formationValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}