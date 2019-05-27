let file = null, pi = 0;
let fileDragHover = (e) => {
  let fileDrag = document.getElementById('file-drag');

  e.stopPropagation();
  e.preventDefault();
  fileDrag.className = e.type === 'dragover' ? 'hover' : 'modal-body file-upload';
};

let fileSelectHandler = (e) => {
  // Fetch FileList object
  let files = e.target.files || e.dataTransfer.files;

  // Cancel event and hover styling
  fileDragHover(e);

  // process all File objects
  for (let i = 0, f; f = files[i]; i++) {
    pi++;
    parseFile(f, pi);
  }
};

let output = (msg) => $('#messages').html(msg);

let parseFile = (f, i) => {
  file = f;
  let imageName = file.name;
  let isGood = (/\.(?=pdf|png|jpeg|jpg)/gi).test(imageName);

  if (isGood) {
    $('#response').append(`<div id="title${i}">${encodeURI(file.name)}</div><progress class="progress" id="file-progress${i}" value="0"></progress>`);

    $('#start').hide();
    $('#notgoodfile').hide();
    $('#response').show();
    $('#documents-preview').show();
    $('#file-progress').attr('max', file.size);
    uploadFile(file, i);
  }
  else {
    output(`<strong>Mauvais format. Formats autorisé : pdf, png ou pnj</strong>`);
    $('#start').show();
    $('#notgoodfile').show();
    $('#response').hide();
    $('#documents-preview').hide();
    document.getElementById('file-upload-form').reset();
  }
};

let updateFileProgress = (e) => {
  if (e.lengthComputable)  {
    e.lengthComputable ? $(`#file-progress${e.target.i}`).attr('value', e.loaded) : null;
  }
};

function uploadFile(f, i) {
  file = f;
  let xhr = new XMLHttpRequest(),
    pBar = document.getElementById(`file-progress${i}`),
    fileSizeLimit = 10240,
    type = $('#file-upload').attr('name'); // In MB
  if (xhr.upload) {
    if (file.size <= fileSizeLimit * 10240 * 1024) {
      pBar.style.display = 'inline';
      xhr.upload.addEventListener('progress', updateFileProgress, false);
      xhr.upload.i = i;

      xhr.onreadystatechange = function (e) {
        $(`#file-progress${i}`).attr('class', `progress ${(xhr.status === 200 ? 'success' : 'failure')}`);
        $('#start').show();
        if (xhr.readyState === 4 && xhr.status === 200) {
          let response = JSON.parse(xhr.response);
          if (response.id) {
            let url = `/static/uploads/candidates/documents/${response.filename}`;
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
              $(`#file-progress${i}`).fadeOut().remove();
              $(`#title${i}`).fadeOut().remove();
            }, 5000);
          }
        } else if (xhr.readyState === 4 && xhr.status === 400) {
          if (xhr.response === 'Document of same type with same name already exist.') {
            $(`#file-progress${i}`).remove();
            $(`#title${i}`).fadeOut().remove();
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

if (window.File && window.FileList && window.FileReader) {
  let fileSelect = document.getElementById('file-upload'),
    videoPreview = document.getElementById('video-preview'),
    fileDrag = document.getElementById('file-drag');

  fileSelect.addEventListener('change', fileSelectHandler, false);

  let xhr = new XMLHttpRequest();
  if (xhr.upload) {
    fileDrag.addEventListener('dragover', fileDragHover, false);
    fileDrag.addEventListener('dragleave', fileDragHover, false);
    fileDrag.addEventListener('drop', fileSelectHandler, false);
  }
} else {
  document.getElementById('file-drag').style.display = 'none';
}

$('#removeVideo').click(() => {
  $.post('/api/candidate/delete/video', { _csrf }, (data) => {
    let video = document.getElementById('video-preview');
    video.pause();
    $('#video-preview').removeAttr('src');
    if (data.result === 'done') {
      output('');
      $('#start').show();
      $('i.fa-video-camera').show();
      $('#response').hide();
      $('#removeVideo').hide();
      $('#video-preview').hide();
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Vidéo de profil supprimée :',
        message: `Votre vidéo de présentation a correctement été supprimée de votre profil.`
      });
    }
  })
});

$('i[data-action="addDoc"]').click(function () {
  let type = $(this).attr('data-type');
  let fileInput = $('#file-upload');
  let sendButton = $('#file-upload-btn');

  $('#response').empty().hide();
  fileInput.attr({ name: type });
  switch (type) {
    case 'DIP':
      sendButton.html('Selectionnez un ou plusieurs diplômes');
      break;
    case 'CNI':
      sendButton.html('Selectionnez votre pièce d\'identité');
      break;
    case 'VIT':
      sendButton.html('Selectionnez votre carte vitale ou attestation de santé');
      break;
    case 'RIB':
      sendButton.html('Selectionnez votre RIB');
      break;
    case 'OrNa':
      sendButton.html('Selectionnez votre Attestation d\'inscription à l\'Ordre National');
      break;
    case 'CV':
      sendButton.html('Selectionnez votre CV');
      break;
    case 'LM':
      sendButton.html('Selectionnez votre lettre de motivation');
      break;
    case 'ADELI':
      sendButton.html('Selectionnez votre justificatif de référencement ADELI');
      break;
  }
  $('form').show();
});