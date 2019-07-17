function isChromeForIos(userAgent){
  return userAgent.indexOf('CriOS') > -1;
}

function isSafari(userAgent){
  return userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Chromium') > -1;
}

function noIE(){
  if ( confirm( "Votre navigateur est obsolète, merci d'utiliser un navigateur récent (Google Chrome, Mozilla Firefox, Opera, ..." ) ) {
    $(location).attr('href', 'https://www.google.com/intl/fr_fr/chrome/');
  } else {
    $(location).attr('href', 'https://www.google.com/intl/fr_fr/chrome/');
  }
}

$(document).ready(function() {
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
  } else if (isChromeForIos(navigator.userAgent)) {
  } else if (isSafari(navigator.userAgent)) {
  } else if ((navigator.userAgent.indexOf('Trident') !== -1) || (!!document.documentMode === true)) {
    noIE();
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