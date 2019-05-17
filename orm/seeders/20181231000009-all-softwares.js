'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let softwares = [
      'Pharma', 'Futura Smart Design', 'Hemadialyse HR', 'Dopa-Soins', 'PE360s', 'Sharegate', 'Sige-Dme', 'SI Lap', 'Millennium', "MyVisit'", 'Titan', 'NETSoins',
      'Expert Sante', 'Onco', 'Atalante-PMSI', 'Emed 5', 'Hopital Manager', 'aXigate NX', 'OX Mediboard', 'Erp Sano', 'HEO (Horizon Expert Orders)', 'MedWare', 'Hémodial',
      'Orbis Medication', 'Dopati', 'Cegi Santé Dossier Patient', 'IdeoMed', 'M-CrossWay', 'ePrescription', 'DxCare', "Hôpti'soins", 'Cloé', 'Dispen', 'Epione', 'Sillage', 'Osoft-LAP-Hospit',
      'Alert', 'Api_Prescription', 'Diamm', 'Cora Dpi', 'Medial', 'Grimoires', 'Cariatides', 'Polydis', 'PE360r', 'Medical Objects', 'Actipidos Nursepad', 'PlusLit', 'OmniPro', 'TrackareT', 'Logipren-SFN',
      'CliMCO Santé', 'ResUrgences', 'Reeducation', 'Cortexte', 'Cristal-Net Opium V5', 'Metavision', 'Hemaweb', 'Aura LAP'
    ];
    let records = [];

    softwares.forEach((soft) => {
      records.push({
        name: soft
      });
    });

    return queryInterface.bulkInsert('Softwares', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Softwares', null, {});
  }
};
