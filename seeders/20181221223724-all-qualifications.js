'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let qualifications = [
      'DU démarche palliative et soins palliatifs terminaux pédiatriques et adultes', 'DU de Prise en Charge de la Douleur', 'DU Plaies et Cicatrisation',
      'DU Infirmier(ère) référent(e) et coordonateur(trice) en EHPAD et en SSIAD (DU IRCo)', "DU Prise en charge des situations d'urgences médico-chirurgicales",
      'DU Thérapeutiques d’urgence et pathologies chroniques', "DU Enseignements Théoriques et Pratiques des Méthodes d'Epuration Extra-Rénale"
    ];
    let records = [];

    qualifications.forEach((qualification) => {
      records.push({
        name: qualification
      });
    });

    return queryInterface.bulkInsert('Qualifications', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Qualifications', null, {});
  }
};
