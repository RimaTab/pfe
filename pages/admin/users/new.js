import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Le prénom est requis')
    .min(2, 'Trop court!')
    .max(50, 'Trop long!'),
  lastName: Yup.string()
    .required('Le nom est requis')
    .min(2, 'Trop court!')
    .max(50, 'Trop long!'),
  email: Yup.string()
    .email('Email invalide')
    .required('L\'email est requis'),
  password: Yup.string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
  role: Yup.string()
    .required('Le rôle est requis')
    .oneOf(['user', 'admin'], 'Rôle invalide'),
  phone: Yup.string()
    .matches(/^[0-9\s\-.]*$/, 'Numéro de téléphone invalide')
    .min(10, 'Trop court!')
    .max(20, 'Trop long!'),
});

export default function NewUser() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setIsSubmitting(true);
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, vous devriez faire un appel API pour créer l'utilisateur
      console.log('Nouvel utilisateur à créer:', values);
      
      // Rediriger vers la liste des utilisateurs avec un message de succès
      router.push({
        pathname: '/admin/users',
        query: { success: 'Utilisateur créé avec succès' },
      });
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      setFieldError('submit', 'Une erreur est survenue lors de la création de l\'utilisateur');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFieldValue('avatar', file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Nouvel utilisateur - Admin</title>
      </Head>
      
      <Box p={3}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Nouvel utilisateur</Typography>
        </Box>

        <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: 'user',
              phone: '',
              avatar: null
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ 
              values, 
              errors, 
              touched, 
              handleChange, 
              handleBlur,
              setFieldValue
            }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center"
                      mb={3}
                    >
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload"
                        type="file"
                        onChange={(e) => handleAvatarChange(e, setFieldValue)}
                      />
                      <label htmlFor="avatar-upload">
                        <IconButton component="span">
                          <Avatar 
                            src={avatarPreview} 
                            sx={{ 
                              width: 120, 
                              height: 120, 
                              fontSize: 48,
                              cursor: 'pointer'
                            }}
                          >
                            <PersonIcon fontSize="inherit" />
                          </Avatar>
                        </IconButton>
                      </label>
                      <Typography 
                        variant="caption" 
                        color="textSecondary"
                        sx={{ mt: 1, cursor: 'pointer' }}
                        onClick={() => document.getElementById('avatar-upload').click()}
                      >
                        {avatarPreview ? 'Changer la photo' : 'Ajouter une photo'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="firstName"
                          label="Prénom"
                          variant="outlined"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.firstName && Boolean(errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="lastName"
                          label="Nom"
                          variant="outlined"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.lastName && Boolean(errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="email"
                          type="email"
                          label="Adresse email"
                          variant="outlined"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="password"
                          label="Mot de passe"
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="confirmPassword"
                          label="Confirmer le mot de passe"
                          type={showConfirmPassword ? 'text' : 'password'}
                          variant="outlined"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl 
                          fullWidth 
                          variant="outlined"
                          error={touched.role && Boolean(errors.role)}
                        >
                          <InputLabel id="role-label">Rôle</InputLabel>
                          <Field
                            as={Select}
                            labelId="role-label"
                            name="role"
                            label="Rôle"
                            value={values.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <MenuItem value="user">Utilisateur</MenuItem>
                            <MenuItem value="admin">Administrateur</MenuItem>
                          </Field>
                          {touched.role && errors.role && (
                            <FormHelperText>{errors.role}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          fullWidth
                          name="phone"
                          label="Téléphone"
                          variant="outlined"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                          <Button
                            variant="outlined"
                            onClick={() => router.push('/admin/users')}
                            disabled={isSubmitting}
                          >
                            Annuler
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Création...' : 'Créer l\'utilisateur'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                
                {errors.submit && (
                  <Box mt={2}>
                    <Typography color="error">{errors.submit}</Typography>
                  </Box>
                )}
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </AdminLayout>
  );
}
