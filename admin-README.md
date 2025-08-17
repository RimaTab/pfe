# Tableau de bord d'administration

Ce répertoire contient le code source du tableau de bord d'administration de l'application. Il est construit avec Next.js, React et Material-UI.

## Fonctionnalités

- Authentification sécurisée
- Tableau de bord avec statistiques
- Gestion des utilisateurs
- Gestion du contenu (articles, recettes, programmes)
- Interface réactive (mobile, tablette, bureau)
- Thème personnalisable

## Structure des dossiers

```
admin/
├── components/         # Composants réutilisables
│   └── admin/          # Composants spécifiques à l'administration
├── pages/              # Pages de l'administration
│   ├── admin/          # Routes protégées
│   │   ├── index.js    # Tableau de bord
│   │   └── ...         # Autres pages admin
│   └── admin/login.js  # Page de connexion
├── config/             # Fichiers de configuration
├── theme.js            # Configuration du thème Material-UI
└── utils/              # Utilitaires
```

## Configuration requise

- Node.js 14+ et npm 6+
- React 17+
- Next.js 12+

## Installation

1. Installer les dépendances :

```bash
npm install
# ou
yarn install
```

2. Démarrer le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

3. Accéder à l'administration :

Ouvrez [http://localhost:3000/admin](http://localhost:3000/admin) dans votre navigateur.

## Identifiants par défaut

- **Nom d'utilisateur** : admin
- **Mot de passe** : admin123

> **Important** : Changez ces identifiants en production !

## Personnalisation

### Thème

Modifiez le fichier `theme.js` pour personnaliser les couleurs, la typographie et d'autres aspects de l'interface utilisateur.

### Navigation

Modifiez le fichier `config/adminNavigation.js` pour ajouter ou modifier les éléments du menu de navigation.

## Sécurité

- Toutes les routes sous `/admin/*` sont protégées et nécessitent une authentification
- Les mots de passe sont hachés avant d'être stockés en base de données
- Protection contre les attaques CSRF
- Gestion des sessions sécurisées

## Déploiement

### Production

1. Construire l'application :

```bash
npm run build
# ou
yarn build
```

2. Démarrer le serveur de production :

```bash
npm start
# ou
yarn start
```

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_secure_password
JWT_SECRET=your_jwt_secret_key_here
```

## Développement

### Lancer les tests

```bash
npm test
# ou
yarn test
```

### Vérification du code

```bash
npm run lint
# ou
yarn lint
```

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
