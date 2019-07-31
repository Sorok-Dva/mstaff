let table = $('#skills-table');

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
        id: 'editSkillModal',
        title: 'Modifier une compétence',
        text: '<label for="skillValueEdit"> Nom de la compétence </label><input class="form-control" type="text" id="skillValueEdit">',
        actions: ['<button type="button" class="btn btn-default" id="btnEditSkill"> Modifier la compétence</button>']
      }, () => {
        $('button#btnEditSkill').click(function () {
          if ($('input#skillValueEdit').val() !== '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let promptInput = $('input#skillValueEdit').val();
            $.put(`/api/back-office/references/skills/${row.id}`, {
              promptInput,
              _csrf
            }, () => {
              let id = $(e.currentTarget).closest('tr').attr('data-id');
              $('#editSkillModal').modal('hide');
              $(`tr[data-id="${id}"] td`).last().prev().text(promptInput);
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Compétence modifiée :',
                message: `La compétence a bien été modifiée.`
              });
            });
          } else {
            if ($('input#skillValueEdit').val() === '') {
              $('input#skillValueEdit').addClass('error');
              setTimeout(function () {
                $('input#skillValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row, index) => {
      createModal({
        id: 'removeSkillModal',
        title: 'Supprimer une compétence',
        text: 'Êtes-vous sûr de vouloir supprimer cette compétence ?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveSkill" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveSkill').click(function () {
          $.delete(`/api/back-office/references/skills/${row.id}`, {
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
              message: `La compétence a bien été supprimée.`
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

function showSkillModal() {
  createModal({
    id: 'addSkillModal',
    title: 'Ajouter une compétence',
    text: '<label for="skillValue"> Nom de la compétence </label><input class="form-control" type="text" id="skillValue">',
    actions: ['<button type="button" class="btn btn-default" id="validateSkill"> Ajouter une compétence</button>']
  }, () => {
    $('button#validateSkill').click(function () {
      if ($('input#skillValue').val() !== '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#skillValue').val();
        $.post(`/api/back-office/references/skills/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Compétence existante: ',
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
              message: `La compétence a été crée.`
            });
          }
        });
        $('#addSkillModal').modal('hide');
      } else {
        if ($('input#skillValue').val() === '') {
          $('input#skillValue').addClass('error');
          setTimeout(function () {
            $('input#skillValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}