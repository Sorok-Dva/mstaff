let table = $('#posts-table');

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
        id: 'editPostModal',
        title: 'Modifier un poste',
        modal: 'back-office/editPost'
      }, () => {
        $('button#btnEditPost').click(function () {
          if (($('input#postValueEdit').val() != '') && ($('select#postCategoryEdit').val() != '')) {
            let _csrf = $('meta[name="csrf-token"]').attr('content');
            let promptInput = $('input#postValueEdit').val();
            let categoryInput = $('select#postCategoryEdit').val();
            $.put(`/api/back-office/references/posts/${row.id}`, {
              promptInput,
              categoryInput,
              _csrf
            }, (response) => {
              let id = $(e.currentTarget).closest('tr').attr('data-id');
              $('#editPostModal').modal('hide');
              $(`tr[data-id="${id}"] td`).last().prev().prev().text(promptInput);
              $(`tr[data-id="${id}"] td`).last().prev().text(categoryInput);
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Poste modifié :',
                message: `Le poste a bien été modifié.`
              });
            });
          } else {
            if ($('input#postValueEdit').val() == '') {
              $('input#postValueEdit').addClass('error');
              setTimeout(function () {
                $('input#postValueEdit').removeClass('error');
              }, 750)
            }
            if ($('select#postCategoryEdit').val() == '') {
              $('select#postCategoryEdit').addClass('error');
              setTimeout(function () {
                $('select#postCategoryEdit').removeClass('error');
              }, 750)
            }
          }
        });
      });
    },
    'click .remove': (e, value, row) => {
      createModal({
        id: 'removePostModal',
        title: 'Supprimer un poste',
        text: 'Êtes-vous sûr de vouloir supprimer ce poste ?',
        actions: [
          '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
          '<button type="button" id="btnRemovePost" class="btn btn-danger" data-dismiss="modal">Oui</button>'
        ]
      }, () => {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $('button#btnRemovePost').click(function () {
          $.delete(`/api/back-office/references/posts/${row.id}`, {
            _csrf
          }, () => {
            table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Poste supprimé :',
              message: `Le poste a bien été supprimé.`
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
function showPostModal() {
  createModal({
    id: 'addPostModal',
    title: 'Ajouter un poste',
    modal: 'back-office/addPost',
    categories: '{{render.categories}}'
  }, () => {
    $('button#validatePost').click(function () {
      if (($('input#postValue').val() != '') && ($('select#postCategory').val() != '')) {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let promptInput = $('input#postValue').val();
        let categoryInput = $('select#postCategory').val();
        $.post(`/api/back-office/references/posts/`, {
          promptInput,
          categoryInput,
          _csrf
        }, (response) => {
          if (response.status === 'Already exists') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Poste existant :',
              message: `Ce poste existe déjà.`
            });
          } else {
            table.bootstrapTable('insertRow', {
              index: 0,
              row: {
                id: response.reference.id,
                name: response.reference.name,
                category: response.reference.categoriesPS_id,
                actions: operateFormatter()
              }
            });
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Poste créé :',
              message: `Le poste a bien été crée.`
            });
          }
        });
        $('#addPostModal').modal('hide');
      } else {
        if ($('input#postValue').val() == '') {
          $('input#postValue').addClass('error');
          setTimeout(function () {
            $('input#postValue').removeClass('error');
          }, 750)
        }
        if ($('select#postCategory').val() == '') {
          $('select#postCategory').addClass('error');
          setTimeout(function () {
            $('select#postCategory').removeClass('error');
          }, 750)
        }
      }
    })
  })
}