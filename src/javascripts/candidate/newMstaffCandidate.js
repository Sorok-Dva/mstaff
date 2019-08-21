$(document).ready(() => {
  let ignoreNewMstaffModal = localStorage.getItem('ignoreNewMstaffModal') || 'false';
  if (ignoreNewMstaffModal === 'false') {
    createModal({
      id: 'newMstaffModal',
      modal: 'candidate/special/newMstaff',
      title: '<img src="/assets/images/LOGO_WEB_118_PX.png" alt="Mstaff" class="logo-default">',
      cantBeClose: true
    }, () => {
      $('#ignoreNewMstaffModal').click(function () {
        localStorage.setItem('ignoreNewMstaffModal', 'true');
      })
    });
  }
});