function isChromeForIos(userAgent){
  return userAgent.indexOf('CriOS') > -1;
}

function isSafari(userAgent){
  return userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Chromium') > -1;
}

$(document).ready(() => {
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
  } else if (isChromeForIos(navigator.userAgent)) {
  } else if (isSafari(navigator.userAgent)) {
  } else if ((navigator.userAgent.indexOf('MSIE') !== -1) || (!!document.documentMode === true)) {
    createModal({
      id: 'alertBadNavigatorModal',
      title: 'Attention : navigateur obsolète détecté !',
      modal: 'badNavigator',
      cantBeClose: true,
      navigator: 'Internet Explorer'
    });
  } else {
    createModal({
      id: 'alertBadNavigatorModal',
      title: 'Attention : navigateur obsolète détecté !',
      modal: 'badNavigator',
      cantBeClose: true,
      navigator: 'Inconnu'
    });
  }
});