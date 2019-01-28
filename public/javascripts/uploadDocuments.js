let file = null;
let fileDragHover = (e) => {
  let fileDrag = document.getElementById('file-drag');

  e.stopPropagation();
  e.preventDefault();
  fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
};

let fileSelectHandler = (e) => {
  // Fetch FileList object
  let files = e.target.files || e.dataTransfer.files;

  // Cancel event and hover styling
  fileDragHover(e);

  // process all File objects
  for (let i = 0, f; f = files[i]; i++) {
    parseFile(f);
  }
};

let output = (msg) => $('#messages').html(msg);

let parseFile = (f) => {
  file = f;
  output('<strong>' + encodeURI(file.name) + '</strong>');

  let imageName = file.name;

  let isGood = (/\.(?=pdf|docx|doc)/gi).test(imageName);
  if (isGood) {
    $('#start').hide();
    $('#notgoodfile').hide();
    $('#response').show();
    $('#documents-preview').show();
    $('#file-progress').attr('max', file.size);
    uploadFile(file);
  }
  else {
    output(`<strong>Mauvais format. Formats autorisé : pdf, doc ou docx</strong>`);
    $('#start').show();
    $('#notgoodfile').show();
    $('#response').hide();
    $('#documents-preview').hide();
    document.getElementById("file-upload-form").reset();
  }
};

let updateFileProgress = (e) => {
  if (e.lengthComputable)  {
    (e.lengthComputable) ? $('#file-progress').attr('value', e.loaded) : null;
  }
};

function uploadFile(f) {
  file = f;
  let xhr = new XMLHttpRequest(),
    fileInput = document.getElementById('class-roster-file'),
    pBar = document.getElementById('file-progress'),
    fileSizeLimit = 10240; // In MB
  if (xhr.upload) {
    if (file.size <= fileSizeLimit * 10240 * 1024) {
      pBar.style.display = 'inline';
      xhr.upload.addEventListener('progress', updateFileProgress, false);

      xhr.onreadystatechange = function(e) {
        $('#file-progress').attr('class', `progress ${(xhr.status === 200 ? "success" : "failure")}`);

        if (xhr.readyState === 4 && xhr.status === 200) {
          $('#removeVideo').show();
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Document sauvegardé :',
            message: `Votre document a correctement été sauvegarder sur nos serveurs.`
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
      xhr.setRequestHeader('x-csrf-token', $('#csrfToken').val());
      xhr.setRequestHeader('X-File-Name', file.name);
      xhr.setRequestHeader('X-File-Size', file.size);
      let formdata = new FormData();
      formdata.append('CV', file);
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
  $.post('/api/candidate/delete/video', {_csrf}, (data) => {
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