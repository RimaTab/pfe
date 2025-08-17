import { useState } from 'react';
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
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Save as SaveIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon
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
  avatar: '/static/images/avatars/avatar_1.png',
  role: 'Administrateur',
  lastLogin: '2023-06-15T14:30:00Z',
  createdAt: '2023-01-01T00:00:00Z',
  isActive: true,
  notifications: {
    email: true,
    push: true,
    newsletter: false
  },
  theme: 'light',
  language: 'fr',
  timezone: 'Europe/Paris'
};

// Options pour les sélecteurs
const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' }
];

const timezones = [
  'Europe/Paris',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo',
  'Australia/Sydney'
];

const themes = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'system', label: 'Système' }
];

// Composant pour l'onglet de profil
const ProfileTab = ({ user, onSave, isSaving }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileValidationSchema}
      onSubmit={onSave}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
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
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isSaving}
              >
                Enregistrer les modifications
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

// Composant pour l'onglet de sécurité
const SecurityTab = ({ onSave, isSaving }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }}
      validationSchema={passwordValidationSchema}
      onSubmit={onSave}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mot de passe actuel"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
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
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && Boolean(errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Confirmer le nouveau mot de passe"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isSaving}
              >
                Mettre à jour le mot de passe
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

// Composant pour l'onglet de préférences
const PreferencesTab = ({ user, onSave, isSaving }) => {
  const theme = useTheme();
  
  const initialValues = {
    language: user?.language || 'fr',
    theme: user?.theme || 'light',
    timezone: user?.timezone || 'Europe/Paris',
    notifications: {
      email: user?.notifications?.email || false,
      push: user?.notifications?.push || false,
      newsletter: user?.notifications?.newsletter || false
    }
  };
  
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setValues({
        ...values,
        notifications: {
          ...values.notifications,
          [notificationType]: checked
        }
      });
    } else {
      setValues({
        ...values,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(values);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="language-label">Langue</InputLabel>
            <Select
              labelId="language-label"
              id="language"
              name="language"
              value={values.language}
              onChange={handleChange}
              label="Langue"
              startAdornment={
                <InputAdornment position="start">
                  <LanguageIcon color="action" />
                </InputAdornment>
              }
            >
              {languages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="theme-label">Thème</InputLabel>
            <Select
              labelId="theme-label"
              id="theme"
              name="theme"
              value={values.theme}
              onChange={handleChange}
              label="Thème"
              startAdornment={
                <InputAdornment position="start">
                  <PaletteIcon color="action" />
                </InputAdornment>
              }
            >
              {themes.map((theme) => (
                <MenuItem key={theme.value} value={theme.value}>
                  {theme.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="timezone-label">Fuseau horaire</InputLabel>
            <Select
              labelId="timezone-label"
              id="timezone"
              name="timezone"
              value={values.timezone}
              onChange={handleChange}
              label="Fuseau horaire"
            >
              {timezones.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Notifications
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.notifications.email}
                    onChange={handleChange}
                    name="notifications.email"
                    color="primary"
                  />
                }
                label="Activer les notifications par email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={values.notifications.push}
                    onChange={handleChange}
                    name="notifications.push"
                    color="primary"
                  />
                }
                label="Activer les notifications push"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={values.notifications.newsletter}
                    onChange={handleChange}
                    name="notifications.newsletter"
                    color="primary"
                  />
                }
                label="S'abonner à la newsletter"
              />
            </FormGroup>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={isSaving}
          >
            Enregistrer les préférences
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

// Composant pour l'onglet de sécurité avancée
const AdvancedTab = ({ user }) => {
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Windows 10, Chrome', location: 'Paris, France', ip: '192.168.1.1', lastActive: 'À l\'instant', isCurrent: true },
    { id: 2, device: 'iPhone 13, Safari', location: 'Lyon, France', ip: '192.168.1.2', lastActive: 'Il y a 2 heures', isCurrent: false },
    { id: 3, device: 'MacBook Pro, Safari', location: 'Marseille, France', ip: '192.168.1.3', lastActive: 'Il y a 1 jour', isCurrent: false },
  ]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const handleTerminateSession = (sessionId) => {
    if (sessionId === 'all') {
      // Ne pas déconnecter la session actuelle
      setSessions(sessions.filter(session => session.isCurrent));
    } else {
      setSessions(sessions.filter(session => session.id !== sessionId));
    }
    setOpenDialog(false);
  };
  
  const handleOpenDialog = (session) => {
    setSelectedSession(session);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sessions actives
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Voici les appareils actuellement connectés à votre compte. Si vous ne reconnaissez pas une session, veuillez la terminer et changer votre mot de passe.
      </Typography>
      
      <Paper variant="outlined">
        <List>
          {sessions.map((session) => (
            <ListItem key={session.id} divider>
              <ListItemText
                primary={session.device}
                secondary={
                  <>
                    {session.location} • {session.ip} • {session.lastActive}
                    {session.isCurrent && (
                      <Typography component="span" variant="caption" color="primary" sx={{ ml: 1 }}>
                        (Session actuelle)
                      </Typography>
                    )}
                  </>
                }
              />
              {!session.isCurrent && (
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => handleOpenDialog(session)}
                  >
                    Terminer la session
                  </Button>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CloseIcon />}
          onClick={() => handleOpenDialog({ id: 'all', device: 'toutes les sessions' })}
          disabled={sessions.length <= 1}
        >
          Terminer toutes les autres sessions
        </Button>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>
        Supprimer le compte
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
      </Typography>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => {}}
      >
        Supprimer mon compte
      </Button>
      
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Terminer la session
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir terminer la session sur {selectedSession?.device} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button 
            onClick={() => handleTerminateSession(selectedSession?.id)} 
            color="error" 
            autoFocus
          >
            Terminer la session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const SettingsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(demoUser);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const tabs = [
    { label: 'Profil', icon: <EmailIcon /> },
    { label: 'Sécurité', icon: <LockIcon /> },
    { label: 'Préférences', icon: <PaletteIcon /> },
    { label: 'Avancé', icon: <SecurityIcon /> }
  ];
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
  
  const handleSavePassword = async (values, { setSubmitting, resetForm }) => {
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
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de la mise à jour du mot de passe',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
      setSubmitting(false);
    }
  };
  
  const handleSavePreferences = async (values) => {
    try {
      setIsSaving(true);
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour les préférences
      setUser({
        ...user,
        ...values
      });
      
      setSnackbar({
        open: true,
        message: 'Préférences mises à jour avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de la mise à jour des préférences',
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
  
  // Si l'utilisateur n'est pas authentifié, le composant PrivateRoute gérera la redirection
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <AdminLayout>
      <Head>
        <title>Paramètres - Tableau de bord</title>
      </Head>
      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 3 }}>
          Paramètres du compte
        </Typography>
        
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index} 
                label={tab.label} 
                icon={tab.icon} 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            ))}
          </Tabs>
          
          <Divider />
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <ProfileTab 
                user={user} 
                onSave={handleSaveProfile} 
                isSaving={isSaving} 
              />
            )}
            
            {activeTab === 1 && (
              <SecurityTab 
                onSave={handleSavePassword} 
                isSaving={isSaving} 
              />
            )}
            
            {activeTab === 2 && (
              <PreferencesTab 
                user={user} 
                onSave={handleSavePreferences} 
                isSaving={isSaving} 
              />
            )}
            
            {activeTab === 3 && (
              <AdvancedTab user={user} />
            )}
          </Box>
        </Paper>
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

export default SettingsPage;
