import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  isAuthenticated as checkAuth,
  getUserData,
  logout as logoutUser,
  login as loginUser,
  hasRole,
  hasAnyRole,
} from '../utils/auth';

/**
 * Hook personnalisé pour gérer l'authentification
 * @returns {Object} - Méthodes et états d'authentification
 */
const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Fonction pour gérer la vérification d'authentification
  const checkAuthStatus = useCallback(() => {
    const authStatus = checkAuth();
    const userData = getUserData();
    
    setIsAuthenticated(authStatus);
    setUser(userData);
    setIsLoading(false);
    
    return { authStatus, userData };
  }, []);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    if (!router.isReady) return;
    
    const { authStatus } = checkAuthStatus();
    
    // Ne pas rediriger automatiquement depuis la page de login
    if (router.pathname === '/admin/login') {
      return;
    }
    
    // Rediriger vers la page de connexion si non authentifié
    if (!authStatus) {
      router.push('/admin/login');
      return;
    }
  }, [router.pathname, router.isReady, checkAuthStatus]);

  /**
   * Connecte l'utilisateur
   * @param {string} token - JWT token
   * @param {object} userData - Données utilisateur
   */
  const login = (token, userData) => {
    loginUser(token, userData);
    setIsAuthenticated(true);
    setUser(userData);
    router.push('/admin');
  };

  /**
   * Déconnecte l'utilisateur
   */
  const logout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/admin/login');
  };

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param {string} role - Rôle à vérifier
   * @returns {boolean}
   */
  const checkRole = (role) => {
    return hasRole(role);
  };

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   * @param {string[]} roles - Liste des rôles à vérifier
   * @returns {boolean}
   */
  const checkAnyRole = (roles) => {
    return hasAnyRole(roles);
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    login,
    logout,
    checkRole,
    checkAnyRole,
  };
};

export default useAuth;
