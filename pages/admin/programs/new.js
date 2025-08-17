import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Formik, Form, Field, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import AdminLayout from '@/components/admin/AdminLayout';
import useAuth from '@/hooks/useAuth';

// Schéma de validation avec Yup
const programValidationSchema = Yup.object({
  title: Yup.string().required('Le titre est requis'),
  description: Yup.string().required('La description est requise'),
  duration: Yup.string().required('La durée est requise'),
  difficulty: Yup.string().required('La difficulté est requise'),
  weeks: Yup.array().of(
    Yup.object({
      title: Yup.string().required('Le titre de la semaine est requis'),
      description: Yup.string().required('La description est requise'),
      workouts: Yup.array().of(
        Yup.object({
          day: Yup.string().required('Le jour est requis'),
          title: Yup.string().required('Le titre est requis'),
          duration: Yup.string().required('La durée est requise')
        })
      ).min(1, 'Au moins un entraînement est requis par semaine')
    })
  ).min(1, 'Au moins une semaine est requise'),
  isPublished: Yup.boolean(),
  tags: Yup.array().of(Yup.string())
});

// Données initiales du formulaire
const initialValues = {
  title: '',
  description: '',
  duration: '8 semaines',
  difficulty: 'Débutant',
  weeks: [
    {
      title: 'Semaine 1',
      description: '',
      workouts: [
        { day: 'Lundi', title: 'Entraînement complet', duration: '45 min' },
        { day: 'Mercredi', title: 'Cardio', duration: '30 min' },
        { day: 'Vendredi', title: 'Renforcement', duration: '45 min' }
      ]
    }
  ],
  isPublished: false,
  tags: []
};

// Options pour les sélecteurs
const difficulties = [
  { value: 'Débutant', label: 'Débutant' },
  { value: 'Intermédiaire', label: 'Intermédiaire' },
  { value: 'Avancé', label: 'Avancé' }
];

const days = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
];

// Composant pour les champs de tags
const TagsInput = ({ name, label, placeholder, ...props }) => {
  const { values, setFieldValue } = useFormikContext();
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().replace(',', '');
      if (!values[name].includes(newTag)) {
        setFieldValue(name, [...values[name], newTag]);
      }
      setInputValue('');
    }
  };

  const handleDelete = (tagToDelete) => {
    setFieldValue(
      name,
      values[name].filter((tag) => tag !== tagToDelete)
    );
  };

  return (
    <FormControl fullWidth margin="normal">
      <TextField
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) {
            const newTag = inputValue.trim();
            if (!values[name].includes(newTag)) {
              setFieldValue(name, [...values[name], newTag]);
            }
            setInputValue('');
          }
        }}
        placeholder={placeholder}
        fullWidth
        InputProps={{
          startAdornment: (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mr: 1 }}>
              {values[name].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDelete(tag)}
                  size="small"
                />
              ))}
            </Box>
          ),
        }}
        {...props}
      />
      <FormHelperText>
        Appuyez sur Entrée ou tapez une virgule pour ajouter un tag
      </FormHelperText>
    </FormControl>
  );
};

const NewProgramPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  const steps = ['Informations de base', 'Planification', 'Options'];
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Ici, vous feriez un appel API pour sauvegarder le programme
      console.log('Données du formulaire:', values);
      
      // Simulation d'un délai de requête
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbar({
        open: true,
        message: 'Programme enregistré avec succès !',
        severity: 'success'
      });
      
      // Rediriger vers la liste des programmes après un délai
      setTimeout(() => {
        router.push('/admin/programs');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du programme:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de l\'enregistrement du programme',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Gérer la navigation entre les étapes
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Si l'utilisateur n'est pas authentifié, le composant PrivateRoute gérera la redirection
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <AdminLayout>
      <Head>
        <title>Nouveau programme - Tableau de bord</title>
      </Head>
      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Nouveau programme
          </Typography>
        </Box>
        
        <Formik
          initialValues={initialValues}
          validationSchema={programValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {index === 0 && (
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                              fullWidth
                              label="Titre du programme"
                              name="title"
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.title && Boolean(errors.title)}
                              helperText={touched.title && errors.title}
                              margin="normal"
                            />
                            
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Description"
                              name="description"
                              value={values.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.description && Boolean(errors.description)}
                              helperText={touched.description && errors.description}
                              margin="normal"
                            />
                            
                            <Grid container spacing={2}>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth margin="normal" error={touched.difficulty && Boolean(errors.difficulty)}>
                                  <InputLabel>Difficulté</InputLabel>
                                  <Select
                                    name="difficulty"
                                    value={values.difficulty}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Difficulté"
                                  >
                                    {difficulties.map((diff) => (
                                      <MenuItem key={diff.value} value={diff.value}>
                                        {diff.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {touched.difficulty && errors.difficulty && (
                                    <FormHelperText>{errors.difficulty}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                  fullWidth
                                  label="Durée"
                                  name="duration"
                                  value={values.duration}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.duration && Boolean(errors.duration)}
                                  helperText={touched.duration && errors.duration}
                                  margin="normal"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Card variant="outlined" sx={{ mt: 2 }}>
                              <CardHeader 
                                title="Aperçu" 
                                titleTypographyProps={{ variant: 'subtitle2' }}
                              />
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {values.title || 'Titre du programme'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {values.description || 'Aucune description fournie'}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">Difficulté:</Typography>
                                  <Chip 
                                    label={values.difficulty || 'Non spécifiée'} 
                                    size="small"
                                    color={
                                      values.difficulty === 'Débutant' ? 'primary' :
                                      values.difficulty === 'Intermédiaire' ? 'secondary' :
                                      'error'
                                    }
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">Durée:</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {values.duration || 'Non spécifiée'}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      )}
                      
                      {index === 1 && (
                        <FieldArray
                          name="weeks"
                          render={arrayHelpers => (
                            <div>
                              {values.weeks.map((week, weekIndex) => (
                                <Card key={weekIndex} variant="outlined" sx={{ mb: 3 }}>
                                  <CardHeader 
                                    title={`Semaine ${weekIndex + 1}`}
                                    action={
                                      values.weeks.length > 1 && (
                                        <IconButton 
                                          size="small" 
                                          color="error"
                                          onClick={() => arrayHelpers.remove(weekIndex)}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      )
                                    }
                                  />
                                  <CardContent>
                                    <TextField
                                      fullWidth
                                      label="Titre de la semaine"
                                      name={`weeks.${weekIndex}.title`}
                                      value={week.title}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.weeks?.[weekIndex]?.title && 
                                        Boolean(errors.weeks?.[weekIndex]?.title)
                                      }
                                      helperText={
                                        touched.weeks?.[weekIndex]?.title && 
                                        errors.weeks?.[weekIndex]?.title
                                      }
                                      margin="normal"
                                    />
                                    
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={2}
                                      label="Description"
                                      name={`weeks.${weekIndex}.description`}
                                      value={week.description}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.weeks?.[weekIndex]?.description && 
                                        Boolean(errors.weeks?.[weekIndex]?.description)
                                      }
                                      helperText={
                                        touched.weeks?.[weekIndex]?.description && 
                                        errors.weeks?.[weekIndex]?.description
                                      }
                                      margin="normal"
                                    />
                                    
                                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                                      Entraînements de la semaine:
                                    </Typography>
                                    
                                    <FieldArray
                                      name={`weeks.${weekIndex}.workouts`}
                                      render={workoutArrayHelpers => (
                                        <div>
                                          {week.workouts.map((workout, workoutIndex) => (
                                            <Paper 
                                              key={workoutIndex} 
                                              variant="outlined" 
                                              sx={{ p: 2, mb: 2 }}
                                            >
                                              <Grid container spacing={2} alignItems="center">
                                                <Grid size={{ xs: 12, sm: 3 }}>
                                                  <FormControl fullWidth margin="dense">
                                                    <InputLabel>Jour</InputLabel>
                                                    <Select
                                                      name={`weeks.${weekIndex}.workouts.${workoutIndex}.day`}
                                                      value={workout.day}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      label="Jour"
                                                    >
                                                      {days.map(day => (
                                                        <MenuItem key={day} value={day}>
                                                          {day}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                                </Grid>
                                                
                                                <Grid size={{ xs: 12, sm: 5 }}>
                                                  <TextField
                                                    fullWidth
                                                    label="Titre de l'entraînement"
                                                    name={`weeks.${weekIndex}.workouts.${workoutIndex}.title`}
                                                    value={workout.title}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    margin="dense"
                                                  />
                                                </Grid>
                                                
                                                <Grid size={{ xs: 8, sm: 3 }}>
                                                  <TextField
                                                    fullWidth
                                                    label="Durée"
                                                    name={`weeks.${weekIndex}.workouts.${workoutIndex}.duration`}
                                                    value={workout.duration}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    margin="dense"
                                                  />
                                                </Grid>
                                                
                                                <Grid size={{ xs: 4, sm: 1 }} sx={{ textAlign: 'center' }}>
                                                  {week.workouts.length > 1 && (
                                                    <IconButton
                                                      size="small"
                                                      color="error"
                                                      onClick={() => workoutArrayHelpers.remove(workoutIndex)}
                                                    >
                                                      <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                  )}
                                                </Grid>
                                              </Grid>
                                            </Paper>
                                          ))}
                                          
                                          <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => workoutArrayHelpers.push({
                                              day: 'Lundi',
                                              title: '',
                                              duration: '30 min'
                                            })}
                                            size="small"
                                            sx={{ mt: 1 }}
                                          >
                                            Ajouter un entraînement
                                          </Button>
                                        </div>
                                      )}
                                    />
                                  </CardContent>
                                </Card>
                              ))}
                              
                              <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => arrayHelpers.push({
                                  title: `Semaine ${values.weeks.length + 1}`,
                                  description: '',
                                  workouts: [
                                    { day: 'Lundi', title: 'Entraînement', duration: '30 min' }
                                  ]
                                })}
                                sx={{ mt: 2 }}
                              >
                                Ajouter une semaine
                              </Button>
                              
                              {typeof errors.weeks === 'string' && (
                                <FormHelperText error>{errors.weeks}</FormHelperText>
                              )}
                            </div>
                          )}
                        />
                      )}
                      
                      {index === 2 && (
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12 }}>
                            <TagsInput
                              name="tags"
                              label="Tags"
                              placeholder="Ajouter des mots-clés (ex: perte de poids, musculation, débutant...)"
                            />
                          </Grid>
                          
                          <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.isPublished}
                                  onChange={handleChange}
                                  name="isPublished"
                                  color="primary"
                                />
                              }
                              label="Publier ce programme"
                            />
                            <FormHelperText>
                              Si coché, le programme sera visible par les utilisateurs
                            </FormHelperText>
                          </Grid>
                        </Grid>
                      )}
                      
                      <Box sx={{ mb: 2, mt: 4 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={index === steps.length - 1 ? null : handleNext}
                            type={index === steps.length - 1 ? 'submit' : 'button'}
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : index === steps.length - 1 ? <SaveIcon /> : null}
                            sx={{ mr: 1 }}
                          >
                            {index === steps.length - 1 ? 'Enregistrer le programme' : 'Suivant'}
                          </Button>
                          
                          <Button
                            disabled={activeStep === 0 || isSubmitting}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            Précédent
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3, textAlign: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Programme enregistré avec succès !
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Votre programme a été enregistré et est maintenant disponible dans la liste des programmes.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/admin/programs')}
                    sx={{ mt: 2 }}
                  >
                    Retour à la liste des programmes
                  </Button>
                </Paper>
              )}
            </Form>
          )}
        </Formik>
      </Box>
      
      {/* Snackbar de notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
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

export default NewProgramPage;
