let videoUpload = () => {
  let Init = () => {
    let fileSelect = document.getElementById('file-upload'),
      fileDrag = document.getElementById('file-drag');

    fileSelect.addEventListener('change', fileSelectHandler, false);

    let xhr = new XMLHttpRequest();
    if (xhr.upload) {
      fileDrag.addEventListener('dragover', fileDragHover, false);
      fileDrag.addEventListener('dragleave', fileDragHover, false);
      fileDrag.addEventListener('drop', fileSelectHandler, false);
    }
  };

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

    if (files.length > 1) {
      output(`<strong>Vous ne pouvez uploader qu'une vidéo.</strong>`);
    } else {
      parseFile(files[0]);
    }
  };

  let output = (msg) => $('#messages').html(msg);

  let parseFile = (file) => {
    output('<strong>' + encodeURI(file.name) + '</strong>');

    let imageName = file.name;
    let $source = $('#videoSrc');

    let isGood = (/\.(?=mp4|avi|wmv|mov|wmf)/gi).test(imageName);
    if (isGood) {
      $('#start').hide();
      $('#notvideo').hide();
      $('#response').show();
      $('#video-preview').show();
      // Video Preview
      $source[0].src = URL.createObjectURL(file);
      $source.parent()[0].load();
      $('#file-progress').attr('max', file.size);
      uploadFile(file);
    }
    else {
      $('#start').show();
      $('#notvideo').show();
      $('#response').hide();
      $('#video-preview').hide();
      document.getElementById("file-upload-form").reset();
    }
  };

  let updateFileProgress = (e) => {
    if (e.lengthComputable)  {
      console.log(`load set to ${e.loaded}`);
      (e.lengthComputable) ? $('#file-progress').attr('value', e.loaded) : null;

    }
  };

  function uploadFile(file) {

    let xhr = new XMLHttpRequest(),
      fileInput = document.getElementById('class-roster-file'),
      pBar = document.getElementById('file-progress'),
      fileSizeLimit = 10240; // In MB
    console.log(xhr);
    if (xhr.upload) {
      console.log('xhr.upload');
      // Check if file is less than x MB
      if (file.size <= fileSizeLimit * 10240 * 1024) {
        // Progress bar
        pBar.style.display = 'inline';
        xhr.upload.addEventListener('progress', updateFileProgress, false);

        // File received / failed
        xhr.onreadystatechange = function(e) {
          $('#file-progress').attr('class', `progress ${(xhr.status === 200 ? "success" : "failure")}`);

          if (xhr.readyState === 4) {
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
        xhr.setRequestHeader('x-csrf-token', $('#csrfToken').val());
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
    Init();
  } else {
    document.getElementById('file-drag').style.display = 'none';
  }
};
videoUpload();