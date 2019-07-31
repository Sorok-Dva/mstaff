let file = null;
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

  if (files.length > 1) {
    output(`<strong>Vous ne pouvez uploader qu'une vidéo.</strong>`);
  } else {
    parseFile(files[0]);
  }
};

let output = (msg) => $('#messages').html(msg);

let parseFile = (f) => {
  file = f;
  output('<strong>' + encodeURI(file.name) + '</strong>');

  let imageName = file.name;
  let $source = $('#videoSrc');

  let isGood = (/\.(?=mp4)/gi).test(imageName);
  if (isGood) {
    $('#start').hide();
    $('#notvideo').hide();
    $('#response').show();
    $('#video-preview').show();
    $source[0].src = URL.createObjectURL(file);
    $source.parent()[0].load();
    $source.attr('data-type', 'preview');

    $('#file-progress').attr('max', file.size);
  }
  else {
    output(`<strong>Mauvais format. Formats autorisé : mp4</strong>`);
    $('#start').show();
    $('#notvideo').show();
    $('#response').hide();
    $('#video-preview').hide();
    document.getElementById('file-upload-form').reset();
  }
};

let updateFileProgress = (e) => {
  if (e.lengthComputable)  {
    e.lengthComputable ? $('#file-progress').attr('value', e.loaded) : null;
  }
};

function uploadFile(f) {
  file = f;
  let xhr = new XMLHttpRequest(),
    fileInput = document.getElementById('class-roster-file'),
    pBar = document.getElementById('file-progress'),
    fileSizeLimit = 10240; // In MB
  if (xhr.upload) {
    // Check if file is less than x MB
    if (file.size <= fileSizeLimit * 10240 * 1024) {
      // Progress bar
      pBar.style.display = 'inline';
      xhr.upload.addEventListener('progress', updateFileProgress, false);

      // File received / failed
      xhr.onreadystatechange = function (e) {
        $('#file-progress').attr('class', `progress ${(xhr.status === 200 ? 'success' : 'failure')}`);

        if (xhr.readyState === 4 && xhr.status === 200) {
          $('#removeVideo').show();
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Vidéo de profil sauvegardée :',
            message: `Votre vidéo de présentation a correctement été ajoutée à votre profil.`
          });
        }
      };

      // Start upload
      xhr.open('POST', document.getElementById('file-upload-form').action, true);
      xhr.setRequestHeader('x-csrf-token', $('meta[name="csrf-token"]').attr('content'));
      xhr.setRequestHeader('X-File-Name', file.name);
      xhr.setRequestHeader('X-File-Size', file.size);
      let formdata = new FormData();
      formdata.append('file', file);
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

  videoPreview.addEventListener('loadedmetadata', () => {
    if ($('#videoSrc').attr('data-type') !== 'preview') return false;
    let duration = $('#videoSrc').parent()[0].duration.toFixed(2);
    if (duration <= 600) {
      uploadFile(file);
    } else {
      output(`<strong>Vidéo trop longue. Durée maximale autorisée : 10 minutes.</strong>`);
      $('#start').show();
      $('#response').hide();
      $('#video-preview').hide();
      document.getElementById('file-upload-form').reset();
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Impossible d\'enregistrer cette vidéo :',
        message: `La durée de votre vidéo est plus grand que la limite autorisée : 10 minutes.`
      });
    }
  });

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