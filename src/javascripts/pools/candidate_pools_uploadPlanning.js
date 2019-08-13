$('#file-upload').on('change', function() {
  $('#response').html($(this).val().replace(/.*(\/|\\)/, ''));
  let file = $(this).prop('files')[0];
  const validType = ['application/pdf', 'image/jpeg', 'image/png'];
  if($.inArray(file.type, validType) < 0) {
    $('button#upload-btn').hide();
    $('#notgoodfile').show();
  } else {
    $('button#upload-btn').show();
    $('#notgoodfile').hide();
  }
});

function uploadButtonClick(id)
{
  let file = $('#file-upload').prop('files')[0];
  if(file)
    uploadPlanning(file, id);
}

function removeDocument(id)
{
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  $.delete(`/api/candidate/pool/document/${id}`, {_csrf}).then(res => {
    if(res === 'Document Supprimé.')
    {
      $(`i#servicePlanning[data-pool=${id}]`).attr("data-planning", "");
      $(`#planningAvailable`).hide();
      $(`#planningNotAvailable`).show();
    }
  });
}

function uploadPlanning(file, id)
{
  let xhr = new XMLHttpRequest(),
    fileSizeLimit = 10240; // In MB

  if (xhr.upload) {
    if (file.size <= fileSizeLimit * 10240 * 1024) {

      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          $(`i#servicePlanning[data-pool=${id}]`).attr("data-planning", file.name);
          $('h4#planningText').text(file.name);
          $(`#planningNotAvailable`).hide();
          $(`#planningAvailable`).show();
          $(`button#upload-btn`).hide();
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Document sauvegardé :',
            message: `Votre document a correctement été sauvegardé sur nos serveurs.`
          });
        } else if (xhr.readyState === 4 && xhr.status === 400) {
          if (xhr.response === 'Document of same type with same name already exist.') {
            notification({
              icon: 'exclamation',
              type: 'danger',
              title: 'Doublon détécté :',
              message: `Un document de même type portant le même nom existe déjà sur votre compte.`
            });
          }
        }
      };

      // Start upload
      xhr.open('POST', document.getElementById('file-upload-form').action, true);
      xhr.setRequestHeader('x-csrf-token', $('meta[name="csrf-token"]').attr('content'));
      xhr.setRequestHeader('X-File-Name', file.name);
      xhr.setRequestHeader('X-File-Size', file.size);
      let formdata = new FormData();
      formdata.append("POOL", file);
      xhr.send(formdata);
    } else {
      output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
    }
  }
}