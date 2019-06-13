let toAutocomplete = ['skills', 'equipments', 'softwares'];

toAutocomplete.forEach((ac) => {
  let list = [];
  let e = ac.substring(0, ac.length - 1);
  let eCapitalize = e.charAt(0).toUpperCase() + e.slice(1);

  $.get(`/api/${ac}/all`, (data) => $.map(data[`${ac}`], value => list.push(value.name)));

  $(`#${ac}`).autocomplete({
    source: list,
    maxShowItems: 10,
    minLength: 3,
    select: (event, ui) => {
      autocompleteTrigger({
        type: e, add: `addNew${eCapitalize}`, already: `${e}AlreadyInList`
      }, ui.item.label)
    },
    search: (event, ui) => {
      autocompleteTrigger({
        type: e, add: `addNew${eCapitalize}`, already: `${e}AlreadyInList`
      }, event.target.value)
    }
  });
  let messageSuccess, messageError, titleSuccess;
  $(`#addNew${eCapitalize}`).click(() => {
    let name = $(`#${ac}`).val();
    let _csrf = $('meta[name="csrf-token"]').attr('content');
    $.post(`/api/candidate/type/${e}/add`, { name, _csrf }, (data) => {
      switch (ac) {
        case 'skills':
          messageSuccess = `Cette compétence "${data.name}" vient d'être ajoutée à votre liste.`;
          titleSuccess = 'Compétence ajoutée avec succès :';
          break;
        case 'equipments':
          messageSuccess = `Ce matériel ou produit "${data.name}" vient d'être ajouté à votre liste.`;
          titleSuccess = 'Matériel / produit ajouté avec succès :';
          break;
        case 'softwares':
          messageSuccess = `Ce logiciel "${data.name}" vient d'être ajouté à votre liste.`;
          titleSuccess = 'Logiciel ajouté avec succès :';
          break;
      }
      if (data) {
        $(`#${ac}`).val('');
        notification({
          icon: 'check-circle',
          type: 'success',
          title: titleSuccess,
          message: messageSuccess
        });
        $(`#${ac}List`).append($('<tr>')
          .attr({ 'data-type': e, 'data-id': data.id })
          .append($('<td>').text(`${data.name}`))
          .append($('<td>').append($('<div>').attr({ class: 'rating-stars text-center' })
            .append($('<ul>').attr({
              class: 'stars',
              'data-type': e,
              'data-id': data.id
            })
              .append($('<li>').attr({ class: 'star', title: 'Fair', 'data-value': 1 }).html('<i class="fa fa-star"></i>'))
              .append($('<li>').attr({ class: 'star', title: 'Good', 'data-value': 2 }).html('<i class="fa fa-star"></i>'))
              .append($('<li>').attr({ class: 'star', title: 'Excellent', 'data-value': 3 }).html('<i class="fa fa-star"></i>')))
          ))
          .append($('<td>').append($('<button>').attr({
            class: 'btn btn-simple btn-outline-danger btn-icon remove',
            'data-type': e,
            'data-id': data.id
          }).html('<i class="fa fa-trash"></i>')))
        );
      }
    }).catch(error => {
      console.log(error);
      let errors = error.responseJSON;
      switch (ac) {
        case 'skills':
          messageError = `Cette compétence est déjà ajoutée à votre profil.`;
          break;
        case 'equipments':
          messageError = `Ce matériel ou produit est déjà ajouté à votre profil.`;
          break;
        case 'softwares':
          messageError = `Ce logiciel est déjà ajouté à votre profil.`;
          break;
      }
      if (error.error === 'Already exists') {
        notification({
          icon: 'exclamation',
          type: 'danger',
          title: 'Ajout impossible',
          message: messageError
        });
      } else return errorsHandler(errors || error);
    });
  });
});

$('body').on('click', '.remove', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  let type = $(event.target).attr('data-type') || $(event.target).parent().attr('data-type');
  createModal({ id: 'removeSkillModal', modal: 'candidate/removeSkill', title: 'Confirmation' }, () => {
    $('#btnRemoveSkill').attr('onclick', `removeSkill('${type}', ${id})`);
  })
});

let autocompleteTrigger = (elements, contain) => {
  if ($(`tr[data-type="${elements.type}"]>td:contains('${contain}')`).length > 0) {
    $(`#${elements.add}`).attr('disabled', 'disabled');
    $(`#${elements.already}`).show();
  } else {
    $(`#${elements.add}`).removeAttr('disabled');
    $(`#${elements.already}`).hide();
  }
};

let removeSkill = (type, id) => {
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  $.delete(`/api/candidate/type/${type}/${id}`, { _csrf }, (data) => {
    if (data.deleted) {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Compétence supprimée avec succès.',
        message: ``
      });
      $(`tr[data-type="${type}"][data-id="${id}"]`).remove();
    }
  }).catch(error => {
    error = error.responseJSON;
    if (error !== undefined && error.error === 'Not exists') {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Suppression impossible',
        message: `Cette compétence n'est pas liée à votre profil.`
      });
    } else return errorsHandler(error);
  });
};