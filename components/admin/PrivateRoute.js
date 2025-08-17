import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 */
const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = async () => {
      // Si nous sommes déjà sur la page de login, on ne fait rien
      if (router.pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      try {
        // Vérifier si nous sommes côté client avant d'accéder à localStorage
        const isBrowser = typeof window !== 'undefined';
        
        if (isBrowser) {
          // Vérifier le token d'authentification dans localStorage
          const token = localStorage.getItem('adminToken');
          const isAuth = !!token; // Vérifier si le token existe
          
          if (!isAuth) {
            // Si non authentifié, rediriger vers la page de login
            await router.push('/admin/login');
          } else {
            // Si authentifié, autoriser l'accès
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
        // En cas d'erreur, rediriger vers la page de login
        await router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si sur la page de login, ne pas afficher le contenu protégé
  if (router.pathname === '/admin/login') {
    return null;
  }

  // Afficher le contenu protégé uniquement si authentifié
  return isAuthenticated ? children : null;
};

export default PrivateRoute;
