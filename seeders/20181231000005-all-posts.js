'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let posts = [
      "Cadre responsable de secteurs de soins et d'activités paramédicales", 'Aide soignant - ASD', 'Auxiliaire de Puériculture', 'Infirmier Puériculteur',
      "Cadre responsable de secteurs de soins et d'activités paramédicales chargé de missions transversales", 'Sage Femme', 'Cancérologue', 'Assistant de régulation médicale',
      'Ergothérapeute', 'Nutritionniste', 'Masseur-kinésithérapeute', 'Psychomotricien', 'Cadre socio-éducatif', 'Radiophysicien en radiothérapie', 'Diététicien',
      "Infirmier de Bloc Opératoire Diplômé d'État -IBODE", "Infirmier Anesthésiste Diplômé d'Etat - IADE", 'Accueil-Standardiste', 'Acheteur', 'Addictologue',
      'Adjoint au chef de service', 'Agent de soins', 'Agent des services logistiques', "Agent d'accueil", 'Agent de biberonnerie', 'Agent de bio-nettoyage',
      'Agent de gestion administrative', 'Agent de maintenance générale des bâtiments', "Agent de restauration et/ou d'hôtellerie", 'Agent de service mortuaire',
      'Agent de stérilisation', 'Agent en secteur médico-technique', 'Agent petite enfance', 'Aide médico-psychologique', 'Allergologue', 'Ambulancier', 'Anatomopathologiste',
      'Andrologue', 'Anesthésiste / Réanimateur', 'Angiologue', 'Animateur socio - éducatif', 'Architecte/Urbaniste du SI', 'Archiviste', 'Agent des services hospitaliers',
      'Assistant des services économiques', 'Assistant de communication', 'Assistant de recherche clinique', 'Assistant social des personnels', 'Assistant social des usagers',
      'Assistant(e) administrative', 'Assistant(e) qualité', 'Assistant(e) de direction', 'Assistant(e) social(e)', 'Attaché(e) de recherche clinique (ARC)', 'Attaché(e) de direction',
      'Automaticien de maintenance', 'Auxiliaire de puériculture en crèche', 'Auxiliaire socio-éducatif-sportif', 'Brancardier', 'Cadre administratif', "Cadre de l'enseignement de santé",
      'Cadre de santé', 'Cadre Infirmier', 'Cadre administratif de pôle', "Cadre d'unité de soins et d'activités paramédicales",
      "Cadre d'unité de soins et d'activités paramédicales chargé de missions transversales", 'Cadre paramédical de pôle', 'Cardiologue', 'Chargé de rendez vous en santé',
      'Chargé de valorisation de la recherche', 'Chargé des applications informatiques', 'Chargé des relations sociales', 'Chargé du développement des ressources humaines',
      'Chargé(e) de mission', 'Chef de bloc', 'Chef de bureau', 'Chef de service administratif', 'Chef de projet informatique', 'Chirurgien de la face et du cou',
      'Chirurgien en orthopédie et traumatologie', 'Chirurgien général', 'Chirurgien infantile', 'Chirurgien maxillo-facial et stomatologie',
      'Chirurgien plastique, reconstructrice, esthétique', 'Chirurgien thoracique et cardio-vasculaire', 'Chirurgien urologue', "Infirmier Diplômé d'Etat - IDE", 'Chirurgien vasculaire',
      'Chirurgien viscéral', 'Comptable', "Conducteur de travaux tous corps d'état", "Conducteur d'opérations tous corps d'état", 'Conseiller en économie sociale et familiale',
      'Conseiller en organisation', 'Conseiller hôtelier', 'Contrôleur de gestion', 'Coordinateur de parcours en santé', 'Coordinateur qualité/gestion des risques', 'Cuisinier-commis de cuisine',
      'Dermatologue', 'Directeur Etablissement', 'Directeur Etablissement adjoint', 'Directeur des soins infirmiers', 'Directeur de site - projets',
      'Directeur des investissements et de la maintenance', 'Directeur des ressources humaines', 'Directeur des services économiques', 'Directeur administratif et financier',
      "Directeur des systèmes d'information et de l'organisation", 'Directeur comptable', 'Directeur des services juridiques', 'Éducateur spécialisé', 'Électricien / Électromécanicien',
      'Encadrant Accueil - Standard', 'Encadrant archives', 'Encadrant de la sécurité des personnes et des biens', 'Encadrant gestion des ressources humaines',
      'Encadrant installations et maintenance équipements sanitaires et thermiques', 'Encadrant logistique', "Encadrant maintenance corps d'état secondaires",
      'Encadrant poste de travail / Support', 'Encadrant production culinaire / alimentaire', 'Encadrant réseau / Télécom', 'Encadrant sécurité incendie', 'Encadrant socio éducatif',
      'Encadrant transport', 'Endocrinologue', 'Enseignant spécialisé', "Enseignant d'activité physique et sportive", 'Expert en produits de santé', 'Facturier(ère)', 'Formateur IFSI',
      'Formateur des professionnels de santé - mission formation initiale', 'Gastro-entérologue', 'Gériatre', 'Gestionnaire économe', 'Gestionnaire accidents du travail / maladie professionnelle',
      'Gestionnaire administratif', 'Gestionnaire admissions frais de séjour traitement externe', 'Gestionnaire comptable et achat', 'Gestionnaire de lits', 'Gestionnaire de stocks / Magasinier',
      'Gestionnaire des achats', 'Gestionnaire des ressources humaines', 'Gestionnaire des retraites et des AT', 'Gestionnaire des travaux', 'Gestionnaire du temps de travail',
      'Gestionnaire finances', 'Gestionnaire paie / carrière', 'Gestionnaire régie', 'Gestionnaire retraite', 'Gynécologue médical', 'Gynécologue obstétrique', 'Hématologue', 'Hygiéniste',
      'Infectiologue', 'Infirmier en recherche clinique', 'Infirmière puéricultrice', 'Informaticien', 'Ingénieur biomédical', 'Ingénieur qualité', 'Ingénieur de recherche hospitalier',
      "Intégrateur d'applications", 'Interniste', 'Intervenant / support informatique utilisateurs', 'Intervenant informatique utilisateurs / Support applicatif', 'Juriste',
      'Manipulateur en électro-radiologie médicale', 'Manipulateur en électro-radiologie médicale - Spécialiste en radioprotection', 'Médecin biologiste', 'Médecin chef de service',
      "Médecin chef d'établissement", 'Médecin conseil', 'Médecin coordonnateur', "Médecin d'aide sociale", 'Médecin de collecte', 'Médecin de la douleur', 'Médecin de PMI',
      'Médecin de réanimation médicale', 'Médecin de santé publique et médecine sociale', 'Médecin DIM', "Médecin du département de l'information médicale (DIM)", 'Médecin du sport',
      'Médecin du travail', 'Médecin généraliste', 'Médecin hygiéniste', 'Médecin légiste', 'Médecin nucléaire', 'Médecin Pharmacologue', 'Médecin rééducateur', 'Médecin salarié',
      'Médecin scolaire', 'Médecin urgentiste', 'Médecin du travail', 'Menuisier - agenceur', 'Métallier - serrurier', "Moniteur d'atelier", 'Moniteur - Educateur',
      'Monteur en installations et maintenance des installations sanitaires et thermiques', 'Néonatologue', 'Néphrologue', 'Neurochirurgien', 'Neurologue', 'Nutritionniste', 'Oncologue',
      'Ophtalmologue', 'Orthophoniste', 'Orthoptiste', 'Ouvrier des services logistiques', 'Panseuse', 'Pédiatre', 'Pédicure podologue', 'Pédopsychiatre', 'Pharmacien', 'Plombier', 'Pneumologue',
      'Préparateur en pharmacie', 'Préparateur en pharmacie - chef de groupe', 'Programmiste', 'Psychiatre', 'Psychologue', 'Psychomotricien', 'Radiologue', 'Rédacteur',
      'Responsable administratif', 'Responsable assurance qualité', "Responsable d'accueil de communication", 'Responsable du secrétariat médical', 'Responsable informatique et télécom',
      'Responsable logistique', 'Responsable maintenance sécurité', 'Responsable médico-technique', 'Responsable rééducateur', 'Responsable admissions / frais de séjour / traitement externe',
      'Responsable archives', 'Responsable blanchisserie', 'Responsable budgétaire et financier', 'Responsable de crèche', 'Responsable de gestion administrative',
      "Responsable de la maintenance tous corps d'état", 'Responsable des marchés publics', 'Responsable des ressources humaines médicales', 'Responsable des services techniques',
      'Responsable restauration', 'Responsable socio éducatif', 'Rhumatologue', 'Secrétaire médical', 'Secrétaire de Direction', 'Stomatologue', 'Surveillante', 'Technicien biomédical',
      'Technicien de laboratoire médical', 'Technicien de maintenance des équipements biomédicaux', "Technicien d'études cliniques", 'Technicien réseau / Télécom', 'Thermicien / chauffagiste',
      "Technicien d'information médicale (TIM)", "Pharmacien remplaçant d'officine", 'Pharmacien hospitalier', 'Agent de service hospitalier - ASH - ASQH',
      'Technicien de laboratoire biologie et biochimie', 'Frigoriste / climatien(ne)', 'Epidémiologiste responsable du réseau toxico-vigilance', 'Data Manager / Statisticien(ne)',
      'Maître(sse) de Maison', 'AVJiste / Avéjiste', 'Éducateur Scolaire Spécialisé', 'Chauffeur ambulancier', 'Animatrice et agent d’office', 'Educateur de Jeunes Enfants',
      'Directeur adjoint de crèche', 'Directeur de crèche', 'manutentionnaire pharmaceutique', 'Sophrologue', 'Naturopathe', 'Chiropracteur', 'Osthéopathe', 'Conseiller Médical',
      'Responsable qualité / gestion des risques', 'Assistant / assistante dentaire', 'Dentiste', 'Chirurgien dentiste', 'Orthodontiste', 'Prothésiste dentaire', 'Secrétaire dentaire',
      'Ouvrier polyvalent', 'Manipulateur en radiologie - MER - radiothérapie', 'Socio-esthéticienne', 'Assistant de vie aux familles (ADVF) - Auxiliaire de vie sociale (AVS)',
      "Infirmier Diplômé d'Etat Libéral (IDEL)", 'Cadre de rééducation', 'Neuropsychologue', 'Art-thérapeute', 'Enseignant Activité Physique Adapté (APA)', 'Cadre logistique', 'Gouvernante',
      'Serveur (euse)', 'Second de cuisine', 'Plongeur', 'Linger(e)', 'Chirurgien Oto-rhino-laryngologie (ORL)', 'Intervenant / Formateur spécialisé santé sur les fonctions supports',
      'Chargé(e) des applications informatiques', 'Chef(fe) de projet informatique', 'Architecte / Urbaniste du SI', 'Expert(e) technique (réseau, système, BDD,...)',
      "Responsable sécurité des systèmes d'information (RSSI)", 'Exploitant(e) technique (réseau, système, BDD, téléphonie, visio)', 'Intervenant(e) / Support Informatique utilisateurs'];
    let records = [];

    posts.forEach((post) => {
      records.push({
        name: post
      });
    });

    return queryInterface.bulkInsert('Posts', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
