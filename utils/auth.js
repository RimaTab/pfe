/**
 * Utilitaire pour gérer l'authentification
 */

// Clés de stockage local
const AUTH_TOKEN_KEY = 'adminToken';
const USER_DATA_KEY = 'adminUser';

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Connecte l'utilisateur
 * @param {string} token - JWT token
 * @param {object} userData - Données utilisateur
 */
export const login = (token, userData) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * Déconnecte l'utilisateur
 */
export const logout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Récupère le token d'authentification
 * @returns {string|null}
 */
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Récupère les données de l'utilisateur connecté
 * @returns {object|null}
 */
export const getUserData = () => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param {string} role - Rôle à vérifier
 * @returns {boolean}
 */
export const hasRole = (role) => {
  const userData = getUserData();
  return userData?.role === role;
};

/**
 * Vérifie si l'utilisateur a l'un des rôles spécifiés
 * @param {string[]} roles - Liste des rôles à vérifier
 * @returns {boolean}
 */
export const hasAnyRole = (roles) => {
  const userData = getUserData();
  return roles.includes(userData?.role);
};

/**
 * Vérifie si l'utilisateur est un administrateur
 * @returns {boolean}
 */
export const isAdmin = () => {
  return hasRole('admin');
};

/**
 * Vérifie si l'utilisateur est un éditeur
 * @returns {boolean}
 */
export const isEditor = () => {
  return hasRole('editor');
};

/**
 * Vérifie si l'utilisateur est un auteur
 * @returns {boolean}
 */
export const isAuthor = () => {
  return hasRole('author');
};

export default {
  isAuthenticated,
  login,
  logout,
  getToken,
  getUserData,
  hasRole,
  hasAnyRole,
  isAdmin,
  isEditor,
  isAuthor,
};
