import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Accès refusé
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/admin')}
          sx={{ mt: 3 }}
        >
          Retour au tableau de bord
        </Button>
      </Box>
    </Container>
  );
}
