'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let Knowledges = [
      "Mesurer les paramètres: pesée, température, fréquence respiratoire, TA, pls", "Identifier les anomalies des paramètres: pesée, température, fréquence respiratoire, TA, pls",
      "Identifier les signes de douleur", "Repérer les effets indésirables des antalgiques", "Connaitre les différentes techniques de prévention de l'escarre",
      "Connaître et réaliser la préparation de l'opéré", "Savoir réaliser l'ablation de fils, surjet", "Surveiller et procéder à l'ablation des agraffes",
      "Savoir surveiller et réaliser l'ablation de redons", "Savoir poser et surveiller un KT périphérique", "Savoir poser /retirer une sonde à demeure",
      "Savoir réaliser une transfusion et en connaître les surveillances", "Savoir faire un ECG", "Savoir réaliser un pansement de plaie chirurgicale", "Savoir réaliser un pansement VAC",
      "Savoir réaliser un pansement compressif", "Savoir prendre en charge une stomie", "Appliquer les bonnes pratiques pour l’administration de médicaments/alimentation par GPE",
      "Savoir réaliser les soins locaux d’une GPE", "Savoir mobiliser les lames", "Savoir réaliser la surveillance du Thrill", "Savoir réaliser la surveillance de la fistule",
      "Savoir réaliser un pansement VVC", "Savoir poser un scope", "Savoir identifier les anomalies de tracé", "Réaliser le bilan hydrique et calorique", "Savoir préparer et programmer une PCA",
      "Savoir aider à la pose de VVC", "Poser une SNG et en connaître les surveillances", "Savoir réaliser un lavage vesical", "Savoir mettre en place une oxygénothérapie murale",
      "Savoir surveiller un patient sous oxygene", "Savoir surveiller un patient porteur d'un KT ARTERIEL", "Savoir prendre en charge un KT artériel",
      "Savoir assister le médecin lors de la pose d'un drain thoracique", "Savoir surveiller un drain thoracique", "Savoir assister le médecin lors de la réalisation d'une ponction pleurale",
      "Savoir assister le médecin lors de la pose d'une VVC", "Savoir installer/retirer une ventilation artificielle (Pression positive,ventilation contrôlée)",
      "Savoir PEC un patient sous ventilation artificielle (Pression positive,ventilation contrôlée)", "Savoir monter le circuit du respirateur", "Savoir PEC un patient intubé", "Savoir réaliser des GDS",
      "Surveiller le KT de naropeine", "Savoir réaliser un premier levé en collaboration avec les kinésithérapeutes", "Appliquer les bonnes pratiques de l’administration d’alimentation et de médicaments par SNG",
      "Surveiller une aspiration digestive", "Surveiller les drains de kehr", "Surveillance mastectomie (hématome)", "Savoir réaliser un sondage intermittent",
      "Savoir surveiller un patient porteur d'un holter ECG/TA", "Savoir gérer les flux de patients en ambulatoire", "Savoir réaliser une thrombolyse", "Savoir poser un holter ECG",
      "Savoir réaliser un pansement de pace maker", "Aider à la pose du Fémostop et réaliser la surveillance", "Savoir surveiller le pansement de la contre pulsion aortique",
      "Savoir gérer les pansements TERUMO", "Poser et retirer une VNI", "Poser et retirer une aiguille de Huber", "Connaître et réaliser le pansement d’un portacath",
      "Connaître et réaliser le pansement d’un piccline", "Connaître les conduites à tenir en cas d' extravasation", "Savoir monter une aspiration murale",
      "Savoir prendre en charge une trachéotomie(pansement et soins locaux)", "Appliquer les bonnes pratiques de l’administration de chimiothérapies (hygiène, double contrôle, identito-vigilance, validation en temps réel)",
      "Savoir réaliser un pansement simple", "Savoir réaliser un pansement d’escarre", "Identifier les anomalies : urines, selles, muqueuses, téguments.",
      "Préparer et poser une perfusion IV ou sous-cutanée", "Identifier le type de douleur", "Savoir utiliser les différentes échelles de la douleur",
      "Savoir mettre en place un TENS", "Savoir poser un plâtre", "Savoir poser une résine", "Savoir réaliser un strapping", "Savoir installer un respirateur",
      "Savoir mener un interrogatoire pré-opératoire selon les recommandations de la SFAR", "Définir avec le MAR le protocole d'anesthésie",
      "Surveiller un patient en respectant les recommandations de la SFAR", "Savoir ouvrir une salle en respectant les recommandations de la SFAR",
      "Savoir ouvrir la salle de césarienne en respectant les recommandations de la SFAR", "Savoir organiser les soins en collaboration avec l’ASD/IADE/MAR/IBODE /chirurgiens",
      "Connaitre et savoir utiliser les techniques d'AIVOC", "Etre capable d'assurer une intervention dans sa globalité (préparation, réalisation) en chirurgie digestive",
      "Etre capable d'assurer une intervention dans sa globalité (préparation, réalisation) en chirurgie urologique",
      "Etre capable d'assurer une intervention dans sa globalité (préparation, réalisation) en chirurgie gynécologique et obstétricale",
      "Etre capable d'assurer une intervention dans sa globalité (préparation, réalisation) en chirurgie orthopédique",
      "Etre capable d'assurer une intervention dans sa globalité (préparation, réalisation) en chirurgie vasculaire",
      "Etre capable d'assurer une intervention dans sa globalité (préparation, réalisation) en endoscopie",
      "Etre capable d'instrumenter et d'aider le chirurgien en chirurgie digestive", "Etre capable d'instrumenter et d'aider le chirurgien en chirurgie urologique",
      "Etre capable d'instrumenter et d'aider le chirurgien en chirurgie gynécologique et obstétricale", "Etre capable d'instrumenter et d'aider le chirurgien en chirurgie orthopédique",
      "Etre capable d'instrumenter et d'aider le chirurgien en chirurgie vasculaire", "Etre capable d'instrumenter et d'aider le chirurgien en endoscopie", "" +
      "Etre titulaire de la formation radioprotection du patient", "Mesurer les paramètres: température, fréquence respiratoire, TA, pls, SPO2, curarisation, RCF.",
      "Identifier les anomalies des paramètres: température, fréquence respiratoire, TA, pls,SPO2,curarisation",
      "Contrôle du fonctionnement des moniteurs,système d'aspiration trachéale,test des respirateurs,défibrillateur", "Savoir surveiller un KT radial",
      "Savoir surveiller un lavage vésical", "Savoir réaliser le peau à peau", "Apporter son aide pour la toilette, l'habillage d'un bébé, soins du visage", "Réaliser les soins au cordon",
      "Savoir mettre l'enfant au sein", "Savoir évaluer la succion nutritive", "Savoir réaliser un bilan sanguin, (GDS, Guthrie)", "Savoir poser /retirer un sac collecteur à urines",
      "Mettre en place l'alimentation entérale et sa surveillance", "Mesurer les paramètres de l'accouchée: sein, involution utérine, lochies,périnée, Homans,miction, transit, hémorroïdes",
      "Savoir réaliser l'examen clinique du NNé au moment de la naissance", "Assurer le suivi de l'allaitement maternel/artificiel", "Savoir surveiller un KT péridurale", "Savoir retirer un KT péridurale",
      "Savoir aider à la pose d'une péridurale", "Savoir réaliser les premier gestes d'urgence vitale maman", "Savoir réaliser la prise en charge de l'HPP",
      "Surveillance globe utérin, pertes sanguines, examen des seins, du périné, membres inférieurs", "Réaliser les toilettes, aide à la toilette, habillage", "Réaliser des soins de bouche non médicaux",
      "Installer le patient dans une position en rapport avec sa pathologie ou son handicap en fonction de la prescription", "Préparer le patient pour des pansements",
      "Préparer le patient pour des examens invasifs", "Préparer le patient pour une intervention.", "Aider à la prise de médicaments sous forme non injectable (faire prendre et vérifier la prise).",
      "Poser des bas de contention", "Nettoyer, désinfecter avec les produits appropriés tout le materiel et le mobilier de la chambre", "Ranger et remettre en état, organiser l’espace", "Refaire les lits",
      "Laver, décontaminer, nettoyer, désinfecter certains matériels de soin.", "Entretenir les chariots propres et sales, les chaises roulantes et brancards.",
      "Contrôler et conditionner le matériel à stériliser ou à désinfecter.", "Contrôler et ranger le matériel stérilisé.",
      "Identifier et appliquer les règles de sécurité et de prévention des risques, notamment ceux liés l’utilisation du matériel médical", "Appliquer les règles d’ergonomie et de manutention.",
      "Connaître le circuit et l’évacuation des déchets (DASRI, DAOM, container aiguilles)", "Connaître le circuit du tri du linge (propre, sale, linge contaminé)",
      "Installer et préparer la personne pour le repas", "Observer l’état des pansements et des drains", "Apporter une aide partielle ou totale à la prise de repas et à l’hydratation régulière",
      "Poser le bassin et l’urinal", "Savoir réaliser les premiers gestes d'urgence vitale bébé", "Connaître et appliquer les précautions standards",
      "Connaître et appliquer les précautions complémentaires d’hygiène et l’isolement protecteur", "Connaître et appliquer les mesures de prévention et de dépistage de l’EPC",
      "Savoir réaliser une aspiration trachéale", "Vérifier les dispositifs d’administration d’oxygène",
      "Observer le bon fonctionnement de dispositifs de drainage et de perfusion, des aspirateurs, des seringues...", "Savoir réaliser les premiers gestes d'urgence vitale",
      "Savoir pratiquer la réaction de polymérisation en chaîne", "Savoir pratiquer le clonage moléculaire"
    ];
    let records = [];

    Knowledges.forEach((knowledge) => {
      records.push({
        name: knowledge
      });
    });

    return queryInterface.bulkInsert('Knowledges', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Knowledges', null, {});
  }
};
