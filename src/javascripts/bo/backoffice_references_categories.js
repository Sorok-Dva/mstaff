let table = $('#categories-table');

function operateFormatter() {
  return [
    '<div class="table-icons">',
    '<a title="Editer" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
    '<i class="ti-pencil-alt"></i>',
    '</a>',
    '<a title="Supprimer" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
    '<i class="ti-close"></i>',
    '</a>',
    '</div>',
  ].join('');
}

function showCategoryModal() {
  createModal({
    id: 'addCategoryModal',
    title: 'Ajouter une catégorie',
    text: `<label for="categoryValue"> Nom de la catégorie Mstaff </label><input class="form-control" type="text" id="categoryValue">`,
    actions: [`<button type="button" class="btn btn-default" id="validateCategory"> Ajouter une catégorie Mstaff </button>`],
  }, () => {
    $('button#validateCategory').click(function () {
      if ($('input#categoryValue').val() != '') {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#categoryValue').val();
        $.post(`/api/back-office/references/categories/`, {
          promptInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Catégorie existante: ',
              message: `Cette catégorie existe déjà.`,
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
              title: 'Catégorie créée: ',
              message: `Une nouvelle catégorie vient d'être crée`,
            });
          }
        });
        $('#addCategoryModal').modal('hide');
      } else {
        if ($('input#categoryValue').val() == '') {
          $('input#categoryValue').addClass('error');
          setTimeout(function () {
            $('input#categoryValue').removeClass('error');
          }, 750)
        }
      }
    })
  })
}

$(document).ready(() => {
  window.operateEvents = {
    'click .edit': (e, value, row) => {
      createModal({
        id: 'editCategoryModal',
        title: 'Modifier une categorie',
        text: `<label for="categoryValueEdit"> Nom de la catégorie </label><input class="form-control" type="text" id="categoryValueEdit" value="${row.name}">`,
        actions: [`<button type="button" class="btn btn-default" id="btnEditCategory"> Modifier la catégorie</button>`],
      }, () => {
        $('button#btnEditCategory').click(function () {
          if ($('input#categoryValueEdit').val() != '') {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let promptInput = $('input#categoryValueEdit').val();
            $.put(`/api/back-office/references/categories/${row.id}`, {
              promptInput,
              _csrf
            }, () => {
              let id = $(e.currentTarget).closest('tr').attr('data-id');
              $('#editCategoryModal').modal('hide');
              $(`tr[data-id="${id}"] td`).last().prev().text(promptInput);
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Catégorie modifiée: ',
                message: `Le nom de la catégorie a bien été modifiée.`
              });
            });
          } else {
            if ($('input#categoryValueEdit').val() == '') {
              $('input#categoryValueEdit').addClass('error');
              setTimeout(function () {
                $('input#categoryValueEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row) => {
      createModal({
        id: 'removeCategoryModal',
        title: 'Supprimer une catégorie',
        text: 'Êtes-vous sûr de vouloir supprimer cette catégorie?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemoveCategory" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ],
      }, () => {

        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemoveCategory').click(function () {
          $.delete(`/api/back-office/references/categories/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Catégorie supprimée:',
              message: `La catégorie selectionnée a bien été supprimée.`
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

  $('[rel="tooltip"]').tooltip();

  $(window).resize(() => {
    table.bootstrapTable('resetView');
  });
});