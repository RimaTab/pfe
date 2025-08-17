import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Avatar,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AdminLayout from '@/components/admin/AdminLayout';
import useAuth from '@/hooks/useAuth';

// Schéma de validation pour le formulaire de profil
const profileValidationSchema = Yup.object({
  firstName: Yup.string().required('Le prénom est requis'),
  lastName: Yup.string().required('Le nom est requis'),
  email: Yup.string().email('Adresse email invalide').required('L\'email est requis'),
  phone: Yup.string().matches(/^[0-9\s-]*$/, 'Numéro de téléphone invalide')
});

// Schéma de validation pour le formulaire de mot de passe
const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Le mot de passe actuel est requis'),
  newPassword: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .required('Le nouveau mot de passe est requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise')
});

// Données de démonstration pour l'utilisateur
const demoUser = {
  id: 1,
  firstName: 'Admin',
  lastName: 'Système',
  email: 'admin@example.com',
  phone: '0601020304',
  avatar: null, // Pas d'image d'avatar par défaut
  role: 'Administrateur',
  lastLogin: '2023-06-15T14:30:00Z',
  createdAt: '2023-01-01T00:00:00Z',
  isActive: true,
  isEmailVerified: true,
  isPhoneVerified: false
};

const ProfilePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuth();
  
  const [user, setUser] = useState(demoUser);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Charger les données de l'utilisateur
  useEffect(() => {
    if (isAuthenticated) {
      // Dans une application réelle, vous feriez un appel API ici
      // pour récupérer les données de l'utilisateur
      setUser(demoUser);
    }
  }, [isAuthenticated]);
  
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  
  const handleSaveProfile = async (values, { setSubmitting }) => {
    try {
      setIsSaving(true);
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'utilisateur
      setUser({
        ...user,
        ...values
      });
      
      setSnackbar({
        open: true,
        message: 'Profil mis à jour avec succès',
        severity: 'success'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de la mise à jour du profil',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
      setSubmitting(false);
    }
  };
  
  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsSaving(true);
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Mot de passe mis à jour avec succès',
        severity: 'success'
      });
      
      // Réinitialiser le formulaire
      resetForm();
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors du changement de mot de passe',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
      setSubmitting(false);
    }
  };
  
  const handleVerifyPhone = async () => {
    try {
      setIsSaving(true);
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser({
        ...user,
        isPhoneVerified: true
      });
      
      setSnackbar({
        open: true,
        message: 'Numéro de téléphone vérifié avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du numéro de téléphone:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de la vérification du numéro de téléphone',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Si l'utilisateur n'est pas authentifié, le composant PrivateRoute gérera la redirection
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <AdminLayout>
      <Head>
        <title>Profil - Tableau de bord</title>
      </Head>
      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: isMobile ? 2 : 0 }}>
            Mon profil
          </Typography>
          
          {!isEditing && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditProfile}
            >
              Modifier le profil
            </Button>
          )}
        </Box>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Avatar 
                    src={user.avatar}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      border: `4px solid ${theme.palette.background.paper}`,
                      boxShadow: theme.shadows[3],
                      bgcolor: 'primary.main',
                      fontSize: '3rem'
                    }}
                  >
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      color="primary"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        '&:hover': {
                          bgcolor: 'background.default'
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </Box>
                
                <Box sx={{ mt: 1, textAlign: 'center' }}>
                  <Typography variant="h6">
                    {`${user.firstName} ${user.lastName}`}
                  </Typography>
                </Box>
                
                <Chip 
                  label={user.role}
                  color="primary"
                  size="small"
                  sx={{ mt: 1, mb: 2 }}
                />
                
                <List dense sx={{ width: '100%' }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <EmailIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <ListItemText 
                        primary="Email" 
                        primaryTypographyProps={{ component: 'div' }}
                        secondary={
                          <span>{user.email}</span>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                      {user.isEmailVerified && (
                        <Chip 
                          icon={<CheckCircleIcon fontSize="small" />} 
                          label="Vérifié" 
                          size="small" 
                          color="success" 
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </Box>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                        <PhoneIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <ListItemText 
                        primary="Téléphone" 
                        primaryTypographyProps={{ component: 'div' }}
                        secondary={
                          <span>{user.phone || 'Non renseigné'}</span>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                      {user.phone && user.isPhoneVerified ? (
                        <Chip 
                          icon={<CheckCircleIcon fontSize="small" />} 
                          label="Vérifié" 
                          size="small" 
                          color="success" 
                          sx={{ ml: 1, height: 20 }}
                        />
                      ) : user.phone ? (
                        <Button 
                          size="small" 
                          color="primary" 
                          onClick={handleVerifyPhone}
                          disabled={isSaving}
                          sx={{ ml: 1, minWidth: 0, p: '2px 8px', fontSize: '0.7rem' }}
                        >
                          Vérifier
                        </Button>
                      ) : null}
                    </Box>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                        <EventIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Membre depuis" 
                      secondary={formatDate(user.createdAt)} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                        <SecurityIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Dernière connexion" 
                      secondary={formatDate(user.lastLogin)} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardHeader 
                title="Sécurité" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }}
                  validationSchema={passwordValidationSchema}
                  onSubmit={handleChangePassword}
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        label="Mot de passe actuel"
                        name="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={values.currentPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.currentPassword && Boolean(errors.currentPassword)}
                        helperText={touched.currentPassword && errors.currentPassword}
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Nouveau mot de passe"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.newPassword && Boolean(errors.newPassword)}
                        helperText={touched.newPassword && errors.newPassword}
                        margin="normal"
                        variant="outlined"
                      />
                      
                      <TextField
                        fullWidth
                        label="Confirmer le nouveau mot de passe"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        margin="normal"
                        variant="outlined"
                      />
                      
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={isSaving}
                      >
                        Changer le mot de passe
                      </Button>
                    </form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardHeader 
                title="Informations personnelles" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                {isEditing ? (
                  <Formik
                    initialValues={{
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      phone: user.phone || ''
                    }}
                    validationSchema={profileValidationSchema}
                    onSubmit={handleSaveProfile}
                  >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Prénom"
                              name="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.firstName && Boolean(errors.firstName)}
                              helperText={touched.firstName && errors.firstName}
                              margin="normal"
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Nom"
                              name="lastName"
                              value={values.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.lastName && Boolean(errors.lastName)}
                              helperText={touched.lastName && errors.lastName}
                              margin="normal"
                              variant="outlined"
                            />
                          </Grid>
                          
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="Adresse email"
                              name="email"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.email && Boolean(errors.email)}
                              helperText={touched.email && errors.email}
                              margin="normal"
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="Téléphone"
                              name="phone"
                              value={values.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.phone && Boolean(errors.phone)}
                              helperText={touched.phone && errors.phone}
                              margin="normal"
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid size={{ xs: 12 }} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                              disabled={isSaving}
                            >
                              Enregistrer les modifications
                            </Button>
                            
                            <Button
                              variant="outlined"
                              onClick={() => setIsEditing(false)}
                              disabled={isSaving}
                            >
                              Annuler
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    )}
                  </Formik>
                ) : (
                  <Box>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Nom complet
                      </Typography>
                      <Typography variant="body1" component="div" paragraph>
                        {`${user.firstName} ${user.lastName}`}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Adresse email
                      </Typography>
                      <Typography variant="body1" component="div" paragraph>
                        {user.email}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Téléphone
                      </Typography>
                      <Typography variant="body1" component="div" paragraph>
                        {user.phone || 'Non renseigné'}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Rôle
                      </Typography>
                      <Typography variant="body1" component="div" paragraph>
                        {user.role}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Membre depuis
                      </Typography>
                      <Typography variant="body1" component="div">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditProfile}
                      >
                        Modifier le profil
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardHeader 
                title="Activité récente" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <List>
                  <ListItem divider>
                    <ListItemText
                      primary="Connexion réussie"
                      secondary={`Dernière connexion le ${formatDate(user.lastLogin)}`}
                    />
                    <Chip 
                      label="Réussi" 
                      color="success" 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      primary="Mise à jour du profil"
                      secondary="15 juin 2023 à 10:30"
                    />
                    <Chip 
                      label="Terminé" 
                      color="info" 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Changement de mot de passe"
                      secondary="1 juin 2023 à 14:15"
                    />
                    <Chip 
                      label="Terminé" 
                      color="info" 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ProfilePage;
