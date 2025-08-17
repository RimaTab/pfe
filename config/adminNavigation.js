const adminNavigation = [
  {
    title: 'Tableau de bord',
    path: '/admin',
    icon: 'dashboard',
  },
  {
    title: 'Utilisateurs',
    path: '/admin/users',
    icon: 'people',
    items: [
      { title: 'Tous les utilisateurs', path: '/admin/users' },
      { title: 'Ajouter un utilisateur', path: '/admin/users/new' },
      { title: 'Groupes', path: '/admin/users/groups' },
    ],
  },
  {
    title: 'Recettes',
    path: '/admin/recipes',
    icon: 'restaurant',
    items: [
      { title: 'Toutes les recettes', path: '/admin/recipes' },
      { title: 'Ajouter une recette', path: '/admin/recipes/new' },
      { title: 'Catégories', path: '/admin/recipes/categories' },
    ],
  },
  {
    title: 'Programmes',
    path: '/admin/programs',
    icon: 'fitness_center',
    items: [
      { title: 'Tous les programmes', path: '/admin/programs' },
      { title: 'Créer un programme', path: '/admin/programs/new' },
      { title: 'Catégories', path: '/admin/programs/categories' },
    ],
  },
  {
    title: 'Blog',
    path: '/admin/blog',
    icon: 'article',
    items: [
      { title: 'Tous les articles', path: '/admin/blog' },
      { title: 'Nouvel article', path: '/admin/blog/new' },
      { title: 'Catégories', path: '/admin/blog/categories' },
      { title: 'Commentaires', path: '/admin/blog/comments' },
    ],
  },
  {
    title: 'Statistiques',
    path: '/admin/stats',
    icon: 'bar_chart',
  },
  {
    title: 'Paramètres',
    path: '/admin/settings',
    icon: 'settings',
    items: [
      { title: 'Général', path: '/admin/settings/general' },
      { title: 'Apparence', path: '/admin/settings/appearance' },
      { title: 'Médias', path: '/admin/settings/media' },
      { title: 'Sécurité', path: '/admin/settings/security' },
    ],
  },
];

export default adminNavigation;
