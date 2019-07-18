$('#file-upload').on('change',function(){
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

$('button#upload-btn').click(function(){
  let file = $('#file-upload').prop('files')[0];
  if(file)
    uploadPlanning(file);
});

function  uploadPlanning(file)
{
  let xhr = new XMLHttpRequest(),
    pBar = document.getElementById(`file-progress`),
    fileSizeLimit = 10240,
    type = "POOL"; // In MB

  if (xhr.upload) {
    if (file.size <= fileSizeLimit * 10240 * 1024) {
      //pBar.style.display = 'inline';
      xhr.upload.addEventListener('progress', updateFileProgress, false);

      xhr.onreadystatechange = function (e) {
        $(`#file-progress`).attr('class', `progress ${(xhr.status === 200 ? 'success' : 'failure')}`);
        $('#start').show();
        if (xhr.readyState === 4 && xhr.status === 200) {
          let response = JSON.parse(xhr.response);
          if (response.id) {
            let url = `/document/view/${response.id}`;
            let rmBtn = ` - <button class="btn btn-simple btn-danger btn-icon remove" data-type="document" data-id="${response.id}"><i class="fa fa-trash"></i></button>`;
            notification({
              icon: 'check-circle',
              type: 'success',
              title: 'Document sauvegardé :',
              message: `Votre document a correctement été sauvegardé sur nos serveurs.`
            });
            $(`#${type}List ul`).append(`<li data-document-id="${response.id}" data-type="${type}"><a href="${url}" target="_blank">${response.name}</a>${rmBtn}</li>`);
            $(`#${type}Count`).html(parseInt($(`#${type}Count`).html()) + 1);
            $(`i[data-type="${type}"]`).attr('class', 'fal fa-check-circle fa-2x');
            setTimeout(() => {
              $(`#file-progress`).fadeOut().remove();
              $(`#title`).fadeOut().remove();
            }, 5000);
          }
        } else if (xhr.readyState === 4 && xhr.status === 400) {
          if (xhr.response === 'Document of same type with same name already exist.') {
            $(`#file-progress`).remove();
            $(`#title`).fadeOut().remove();
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
      formdata.append(type, file);
      xhr.send(formdata);
    } else {
      output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
    }
  }
}

function updateFileProgress (e) {
  if (e.lengthComputable)  {
    e.lengthComputable ? $(`#file-progress${e.target.i}`).attr('value', e.loaded) : null;
  }
}