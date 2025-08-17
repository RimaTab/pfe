import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function AdminRoute({ children, requiredRole = 'admin' }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (status === 'authenticated') {
      // Vérifier le rôle de l'utilisateur
      if (session.user.role === requiredRole) {
        setIsAuthorized(true);
      } else {
        router.push('/admin/unauthorized');
      }
      setIsLoading(false);
    }
  }, [status, session, router, requiredRole]);

  if (status === 'loading' || isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}
