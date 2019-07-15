function  getAllServices()
{
  let availableServices = [];

    $.get(`/api/services/all`, function (data) {
      data.services.forEach(service => {
          availableServices.push(service.name);
      });
      $('#servicesSelect').empty().select2({
        data: availableServices.sort(),
        placeholder: "Service ?",
        minimumResultsForSearch: Infinity,
        multiple: "multiple",
      });
    });
  $.get(`pools/services/${pool}`, (res) => {
    res.service.forEach(service => {
      $(`#servicesSelect option[value="${service}"]`).prop('selected', true).trigger('change');
    });
  });
}

$('button#addServiceButton').click(function() {
  let data = $('#servicesSelect').select2('data');
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  let updatedServices = [];
  data.forEach(service => updatedServices.push(service.id));
  $.put(`pools/services/${pool}`, {_csrf, services: updatedServices}, (res) => {
    if(res === 'Services updated')
    {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Succès :',
        message: `Vous venez de mettre à jour les services souhaités.`
      });
    }
  });
});

$(document).ready(function() {
  getAllServices();
});