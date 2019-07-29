let table = $('#equipments-table');

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
        id: 'editEquipmentModal',
        title: 'Modifier une equipment',
        text: '<label for="equipmentValueEdit"> Nom de la compétence </label><input class="form-control" type="text" id="equipmentValueEdit">',
        actions: ['<button type="button" class="btn btn-default" id="btnEditEquipment"> Modifier la compétence</button>']
      }, () => {
        $('button#btnEditEquipment').click(function () {
          if ($('input#equipmentValueEdit').val() != '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let promptInput = $('input#equipmentValueEdit').val();
            $.put(`/api/back-office/references/equipments/${row.id}`, {
              promptInput,
              _csrf
            }, () => {
              let id = $(e.currentTarget).closest('tr').attr('data-id');
              $('#editEquipmentModal').modal('hide');
              $(`tr[data-id="${id}"] td`).last().prev().text(promptInput);
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Compétence modifiée :',
                message: `La compétence selectionnée a bien été modifiée.`
              });
            });
          } else {
            if ($('input#equipmentValueEdit').val() === '') {
              $('input#equipmentValueEdit').addClass('error');
              setTimeout(function () {
                $('input#equipmentValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row) => {
      createModal({
        id: 'removeEquipmentModal',
        title: 'Supprimer une compétence',
        text: 'Êtes-vous sûr de vouloir supprimer cette compétence?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveEquipment" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveEquipment').click(function () {
          $.delete(`/api/back-office/references/equipments/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Compétence supprimée :',
              message: `La compétence selectionnée a bien été supprimée.`
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

function showEquipmentModal() {
  createModal({
    id: 'addEquipmentModal',
    title: 'Ajouter une compétence',
    text: '<label for="equipmentValue"> Nom de la compétence </label><input class="form-control" type="text" id="equipmentValue">',
    actions: ['<button type="button" class="btn btn-default" id="validateEquipment"> Ajouter une compétence</button>']
  }, () => {
    $('button#validateEquipment').click(function () {
      if ($('input#equipmentValue').val() !== '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#equipmentValue').val();
        $.post(`/api/back-office/references/equipments/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Compétence existante:',
              message: `Cette compétence existe déjà.`
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
              title: 'Compétence créée :',
              message: `La compétence a bien été crée.`
            });
          }
        });
        $('#addEquipmentModal').modal('hide');
      } else {
        if ($('input#equipmentValue').val() === '') {
          $('input#equipmentValue').addClass('error');
          setTimeout(function () {
            $('input#equipmentValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}