import { Container, Typography, Grid, Paper } from '@mui/material';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Tableau de bord
              </Typography>
              <Typography variant="body1">
                Bienvenue dans votre espace d'administration.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Vue d'ensemble
              </Typography>
              {/* Ajoutez ici vos statistiques ou indicateurs */}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
