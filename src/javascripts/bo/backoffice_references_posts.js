let table = $('#posts-table');

operateFormatter = (value, row, index) => {
  return [
    '<div class="table-icons">',
    '<a title="Link" class="btn btn-simple btn-success btn-icon table-action link" href="javascript:void(0)">',
    '<i class="ti-link"></i>',
    '</a>',
    '<a title="Edit" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
    '<i class="ti-pencil-alt"></i>',
    '</a>',
    '<a title="Remove" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
    '<i class="ti-close"></i>',
    '</a>',

    '</div>',
  ].join('');
};

function notify(error){
  switch(error){
    case 'modified-post':
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Poste modifié.',
        message: ``
      });
      break;
    case 'deleted-post':
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Poste supprimé.',
        message: ``
      });
      break;
    case 'already-exist-post':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Ce poste existe déjà.',
        message: ``
      });
      break;
    case 'created-post':
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Poste créé.',
        message: ``
      });
      break;
    case 'error-update-category':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Une erreur est survenue lors de la modification de la catégorie.',
        message: ``
      });
  }
};

let showPostModal = () => {
  createModal({
    id: 'addPostModal',
    title: 'Ajouter un poste',
    modal: 'back-office/addPost',
    categories: '{{render.categories}}'
  }, () => {
    $('button#validatePost').click(function () {
      let promptInput = $('input#postValue').val();
      if (!$.isEmptyObject(promptInput)) {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $.post(`/api/back-office/references/posts/`, { promptInput, _csrf }, (response) => {
          if (response.status === 'Already exists') {
            notify('already-exist-post');
          } else {
            table.bootstrapTable('insertRow', {
              index: 0,
              row: {
                id: response.reference.id,
                name: response.reference.name,
                category: 'none',
                modifcategory: select,
                actions: '<td></td>'
              }
            });
            $(`tr[data-index="0"]`).attr("data-id", `${response.reference.id}`);
            notify('created-post');
          }
        });
        $('#addPostModal').modal('hide');
      } else {
        promptInput.addClass('error');
        setTimeout(function () {
          promptInput.removeClass('error');
        }, 750)
      }
    })
  })
};

let edit = (e, value, row, index) => {
  createModal({
    id: 'editPostModal',
    title: 'Modifier un poste',
    modal: 'back-office/editPost'
  }, () => {
    $('button#btnEditPost').click(function () {
      let promptInput = $('input#postValueEdit').val();
      if (!$.isEmptyObject(promptInput)) {
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        $.put(`/api/back-office/references/posts/${row.id}`, { promptInput, _csrf }, () => {
          let id = row.id;
          $('#editPostModal').modal('hide');
          $(`tr[data-id="${id}"] td:nth-child(3)`).text(promptInput);
          notify('modified-post');
        });
      } else {
        promptInput.addClass('error');
        setTimeout(function () {
          promptInput.removeClass('error');
        }, 750)
      }
    });
  });
};

let remove = (e, value, row, index) => {
  createModal({
    id: 'removePostModal',
    title: 'Etes vous sur de vouloir supprimer ce poste ?',
    actions: ['<button type="button" class="btn btn-danger" id="btnRemovePost">Oui</button>','<button type="button" class="btn btn-success" id="btnCancel" data-dismiss="modal">Annuler</button>'],
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
        $('#removePostModal').modal('hide');
        notify('deleted-post');
      });
    });
  });
};

let link = (e, value, row, index) => {
  let id = parseInt(row.id);
  let select = $(`tr[data-id="${id}"] select option:selected`);
  let category = parseInt(select.val());
  let category_name = select.text();
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  $.put(`/api/back-office/references/posts/${row.id}`, { category, _csrf }, (res) => {
    if (res.status === 'Modified'){
      $(`tr[data-id="${id}"] td:nth-child(4)`).text(category_name);
      notify('modified-post');
    } else notify('error-update-category');
  });
};

$(document).ready(() => {
  window.operateEvents = {
    'click .edit': edit,
    'click .remove': remove,
    'click .link': link
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

  $('input[name="btSelectItem"], input[name="btSelectAll"]').on('change', () => {
    let nbSelected = $('.selected').length;
    if (nbSelected > 1){
      $('.nbSelected').text(`Vous avez sélectionné ${nbSelected} postes`);
      $('.multipost').show();
    } else {
      $('.nbSelected').text('');
      $('.multipost').hide();
    }
  });

  $('#multiLink').on('click', () => {
    let category = parseInt($('.select-multiLink option:selected').val());
    let category_name = $('.select-multiLink option:selected').text();
    let selected = $('.selected');
    let keys = Object.keys(selected);
    let ids = [];
    let _csrf = $('meta[name="csrf-token"]').attr('content');

    keys.forEach( key => {
      if(!_.isNil(selected[key].dataset)){
        ids.push(parseInt(selected[key].dataset.id));
      }
    });

    $.put(`/api/back-office/references/posts/multiple/category`, { ids, category, _csrf }, (res) => {
      if (res.status === 'Modified'){
        ids.forEach(id => {
          $(`tr[data-id=${id}] td:nth-child(4)`).text(category_name);
        });
        notify('modified-post');
      } else notify('error-update-category');
    });

  });

});