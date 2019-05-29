$(document).ready(() => {
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    createModal({
      id: 'alertBadNavigatorModal',
      title: 'Attention : navigateur obsolète détecté !',
      modal: 'badNavigator',
      cantBeClose: true,
      navigator: 'Safari'
    });
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