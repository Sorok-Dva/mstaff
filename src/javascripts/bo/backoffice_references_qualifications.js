let table = $('#qualifications-table');

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
        id: 'editQualificationModal',
        title: 'Modifier un diplôme complémentaire',
        text: '<label for="qualificationValueEdit"> Nom du diplôme complémentaire </label> <input class="form-control" type="text" id="qualificationValueEdit">',
        actions: ['<button type="button" class="btn btn-default" id="btnEditQualification"> Modifier le diplôme</button>']
      }, () => {
        $('button#btnEditQualification').click(function () {
          if ($('input#qualificationValueEdit').val() !== '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let promptInput = $('input#qualificationValueEdit').val();
            $.put(`/api/back-office/references/qualifications/${row.id}`, {
              promptInput,
              _csrf
            }, () => {
              let id = $(e.currentTarget).closest('tr').attr('data-id');
              $('#editQualificationModal').modal('hide');
              $(`tr[data-id="${id}"] td`).last().prev().text(promptInput);
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Diplôme modifié :',
                message: `Le diplôme a bien été supprimé.`
              });
            });
          } else {
            if ($('input#qualificationValueEdit').val() === '') {
              $('input#qualificationValueEdit').addClass('error');
              setTimeout(function () {
                $('input#qualificationValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row, index) => {
      createModal({
        id: 'removeQualificationModal',
        title: 'Supprimer un diplôme',
        text: ' Êtes-vous sûr de vouloir supprimer ce diplôme ?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveQualification" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveQualification').click(function () {
          $.delete(`/api/back-office/references/qualifications/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Diplôme supprimé :',
              message: `Le diplôme a bien été supprimé.`
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
    pageList: [10,25,50,100,200,500],
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

function showQualificationModal() {
  createModal({
    id: 'addQualificationModal',
    title: 'Ajouter un diplôme',
    text: '<label for="qualificationValue"> Nom du diplôme complémentaire </label><input class="form-control" type="text" id="qualificationValue">',
    actions: ['<button type="button" class="btn btn-default" id="validateQualification"> Ajouter un diplôme</button>']
  }, () => {
    $('button#validateQualification').click(function () {
      if ($('input#qualificationValue').val() !== '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#qualificationValue').val();
        $.post(`/api/back-office/references/qualifications/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Diplôme existant: ',
              message: `Ce diplôme existe déjà.`
            });
          }
          else {
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
              title: ' Diplôme créé :',
              message: `Le diplôme a bien été crée.`
            });
          }
        });
        $('#addQualificationModal').modal('hide');
      }
      else {
        if ($('input#qualificationValue').val() === '') {
          $('input#qualificationValue').addClass('error');
          setTimeout(function() {
            $('input#qualificationValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}