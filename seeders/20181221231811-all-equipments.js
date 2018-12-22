'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let Equipments = [
      'Savoir utiliser VAC', 'Savoir utiliser PICO', 'Savoir utiliser ECG', 'Savoir utiliser/contrôler un pousse-seringue', 'Savoir utiliser Bladder scan', "Utiliser le chariot d'urgence",
      'Savoir utiliser une pompe PCA', 'Savoir utiliser/contrôler une pompe d’alimentation entérale', 'Savoir utiliser/contrôler un scope', 'Savoir utiliser/contrôler un défibrillateur',
      'Savoir utiliser/contrôler un respirateur', 'Savoir utiliser appareil GDS (Gaz du Sang)', 'Savoir utiliser Hemocue', 'Savoir utiliser/contrôler un appareil ECG/holter',
      'Savoir utiliser/contrôler pansement compressif', 'Savoir prendre en charge un traitement par héparine', 'Savoir prendre en charge un traitement par AGRASTAT',
      'Savoir utiliser une pompe de chimiothérapie', 'Savoir utiliser une armoire à formol', 'Savoir utiliser un stérilisation à froid', "Savoir utiliser l'amplificateur de brillance",
      'Savoir utiliser TENS', 'Savoir utiliser QUTENZA', 'Savoir utiliser Cell saver', 'Savoir utiliser MASIMO', 'Savoir utiliser Un pousse-seringue AIVOC', 'Savoir utiliser un réchauffeur de solutés',
      'Savoir utiliser un kit KT artériel', 'Savoir utiliser curamètre', 'Savoir utiliser un fibroscope', 'Savoir utiliser un thermometre tympanique',
      'Savoir détecter les dysfonctionnements éventuels des équipements et matériels d’anesthésie et de réanimation',
      'Savoir mettre en œuvre des interventions correctives adaptées aux dysfonctionnements éventuels des équipements et matériels d’anesthésie et de réanimation',
      'Savoir anticiper l’approvisionnement du matériel d’urgence, des médicaments d’urgence'
    ];
    let records = [];

    Equipments.forEach((equipment) => {
      records.push({
        name: equipment
      });
    });

    return queryInterface.bulkInsert('Equipments', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Equipments', null, {});
  }
};
