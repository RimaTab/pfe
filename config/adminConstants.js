const adminConstants = {
  // Rôles d'utilisateur
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    AUTHOR: 'author',
    CONTRIBUTOR: 'contributor',
    SUBSCRIBER: 'subscriber',
  },
  
  // Types de contenu
  CONTENT_TYPES: {
    POST: 'post',
    PAGE: 'page',
    RECIPE: 'recipe',
    PROGRAM: 'program',
    EXERCISE: 'exercise',
  },
  
  // Statuts de contenu
  STATUS: {
    PUBLISH: 'publish',
    DRAFT: 'draft',
    PENDING: 'pending',
    PRIVATE: 'private',
  },
  
  // Paramètres par défaut
  DEFAULTS: {
    PER_PAGE: 10,
    DATE_FORMAT: 'DD/MM/YYYY',
    DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
    TIME_FORMAT: 'HH:mm',
  },
  
  // Paramètres de l'application
  APP: {
    NAME: 'Tableau de bord Admin',
    VERSION: '1.0.0',
    DESCRIPTION: 'Tableau de bord d\'administration pour la gestion du site',
  },
};

export default adminConstants;
