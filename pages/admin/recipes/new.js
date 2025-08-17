import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Chip,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Formik, Form, Field, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import AdminLayout from '@/components/admin/AdminLayout';
import useAuth from '@/hooks/useAuth';

// Schéma de validation avec Yup
const recipeValidationSchema = Yup.object({
  title: Yup.string().required('Le titre est requis'),
  description: Yup.string().required('La description est requise'),
  category: Yup.string().required('La catégorie est requise'),
  prepTime: Yup.number().min(0, 'Le temps doit être positif').required('Le temps de préparation est requis'),
  cookTime: Yup.number().min(0, 'Le temps doit être positif').required('Le temps de cuisson est requis'),
  servings: Yup.number().min(1, 'Le nombre de portions doit être d\'au moins 1').required('Le nombre de portions est requis'),
  difficulty: Yup.string().required('La difficulté est requise'),
  ingredients: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Le nom de l\'ingrédient est requis'),
      quantity: Yup.number().min(0, 'La quantité doit être positive').required('La quantité est requise'),
      unit: Yup.string().required('L\'unité est requise')
    })
  ).min(1, 'Au moins un ingrédient est requis'),
  instructions: Yup.array().of(
    Yup.string().required('L\'étape ne peut pas être vide')
  ).min(1, 'Au moins une étape est requise'),
  notes: Yup.string(),
  isPublished: Yup.boolean(),
  tags: Yup.array().of(Yup.string())
});

// Données initiales du formulaire
const initialValues = {
  title: '',
  description: '',
  category: '',
  prepTime: 15,
  cookTime: 30,
  servings: 4,
  difficulty: 'facile',
  ingredients: [
    { name: '', quantity: '', unit: 'g' }
  ],
  instructions: [''],
  notes: '',
  isPublished: false,
  tags: []
};

// Options pour les sélecteurs
const categories = [
  'Entrée',
  'Plat principal',
  'Dessert',
  'Apéritif',
  'Boisson',
  'Petit-déjeuner',
  'En-cas',
  'Sauce',
  'Accompagnement'
];

const difficulties = [
  { value: 'facile', label: 'Facile' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'difficile', label: 'Difficile' }
];

const units = [
  { value: 'g', label: 'Grammes (g)' },
  { value: 'kg', label: 'Kilogrammes (kg)' },
  { value: 'ml', label: 'Millilitres (ml)' },
  { value: 'l', label: 'Litres (l)' },
  { value: 'cac', label: 'Cuillère à café' },
  { value: 'cas', label: 'Cuillère à soupe' },
  { value: 'pincée', label: 'Pincée' },
  { value: 'unité', label: 'Unité' },
  { value: 'tranche', label: 'Tranche' },
  { value: 'verre', label: 'Verre' },
  { value: 'tasse', label: 'Tasse' },
  { value: 'poignée', label: 'Poignée' },
  { value: 'botte', label: 'Botte' },
  { value: 'feuille', label: 'Feuille' },
  { value: 'gousse', label: 'Gousse' },
  { value: 'branche', label: 'Branche' },
  { value: 'filet', label: 'Filet' },
  { value: 'sachet', label: 'Sachet' },
  { value: 'sans', label: 'Sans unité' }
];

// Composant pour le champ de tags
const TagsInput = ({ name, label, placeholder, ...props }) => {
  const { setFieldValue, values } = useFormikContext();
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!values[name].includes(inputValue.trim())) {
        setFieldValue(name, [...values[name], inputValue.trim()]);
      }
      setInputValue('');
    }
  };
  
  const handleDelete = (tagToDelete) => {
    setFieldValue(
      name,
      values[name].filter(tag => tag !== tagToDelete)
    );
  };
  
  return (
    <FormControl fullWidth margin="normal">
      <TextField
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Appuyez sur Entrée pour ajouter un tag'}
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: values[name].map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDelete(tag)}
              sx={{ mr: 1, mb: 1 }}
              size="small"
            />
          )),
        }}
        {...props}
      />
      <FormHelperText>Appuyez sur Entrée pour ajouter un tag</FormHelperText>
    </FormControl>
  );
};

// Composant pour l'upload d'images
const ImageUpload = ({ name, label, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [preview, setPreview] = useState(null);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFieldValue(name, file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <FormControl fullWidth margin="normal">
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<PhotoCameraIcon />}
          fullWidth
          sx={{ py: 2, mb: 2 }}
        >
          {label || 'Télécharger une image'}
        </Button>
      </label>
      {preview && (
        <Box mt={2} textAlign="center">
          <img
            src={preview}
            alt="Aperçu"
            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
          />
        </Box>
      )}
    </FormControl>
  );
};

const NewRecipePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const steps = ['Informations de base', 'Ingrédients', 'Préparation', 'Options'];
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Utiliser le service de recettes pour créer une nouvelle recette
      const newRecipe = {
        title: values.title,
        description: values.description,
        category: values.category,
        prepTime: values.prepTime,
        cookTime: values.cookTime,
        servings: values.servings,
        difficulty: values.difficulty,
        ingredients: values.ingredients,
        instructions: values.instructions,
        notes: values.notes,
        isPublished: values.isPublished,
        tags: values.tags,
        rating: 0,
        status: values.isPublished ? 'published' : 'draft'
      };
      
      // Enregistrer la recette dans le localStorage
      const { createRecipe } = await import('@/services/recipeService');
      await createRecipe(newRecipe);
      
      setSnackbar({
        open: true,
        message: 'Recette enregistrée avec succès !',
        severity: 'success'
      });
      
      // Rediriger vers la liste des recettes après un délai
      setTimeout(() => {
        router.push('/admin/recipes');
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la recette:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de l\'enregistrement de la recette',
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
        <title>Nouvelle recette - Tableau de bord</title>
      </Head>
      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Nouvelle recette
          </Typography>
        </Box>
        
        <Formik
          initialValues={initialValues}
          validationSchema={recipeValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    {!isMobile && (
                      <StepContent>
                        {index === 0 && (
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={8}>
                            <TextField
                              fullWidth
                              label="Titre de la recette"
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
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal" error={touched.category && Boolean(errors.category)}>
                                  <InputLabel>Catégorie</InputLabel>
                                  <Select
                                    name="category"
                                    value={values.category}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Catégorie"
                                  >
                                    {categories.map((category) => (
                                      <MenuItem key={category} value={category}>
                                        {category}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {touched.category && errors.category && (
                                    <FormHelperText>{errors.category}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              
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
                              
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Temps de préparation (min)"
                                  name="prepTime"
                                  value={values.prepTime}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.prepTime && Boolean(errors.prepTime)}
                                  helperText={touched.prepTime && errors.prepTime}
                                  margin="normal"
                                />
                              </Grid>
                              
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Temps de cuisson (min)"
                                  name="cookTime"
                                  value={values.cookTime}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.cookTime && Boolean(errors.cookTime)}
                                  helperText={touched.cookTime && errors.cookTime}
                                  margin="normal"
                                />
                              </Grid>
                              
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Portions"
                                  name="servings"
                                  value={values.servings}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.servings && Boolean(errors.servings)}
                                  helperText={touched.servings && errors.servings}
                                  margin="normal"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <ImageUpload 
                              name="image" 
                              label="Ajouter une image de couverture" 
                            />
                          </Grid>
                        </Grid>
                      )}
                      
                      {index === 1 && (
                        <FieldArray
                          name="ingredients"
                          render={arrayHelpers => (
                            <div>
                              {values.ingredients.map((ingredient, index) => (
                                <Grid container spacing={2} key={index} alignItems="center">
                                  <Grid size={{ xs: 12, sm: 5 }}>
                                    <TextField
                                      fullWidth
                                      label="Ingrédient"
                                      name={`ingredients.${index}.name`}
                                      value={ingredient.name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={touched.ingredients?.[index]?.name && Boolean(errors.ingredients?.[index]?.name)}
                                      helperText={touched.ingredients?.[index]?.name && errors.ingredients?.[index]?.name}
                                      margin="normal"
                                    />
                                  </Grid>
                                  
                                  <Grid size={{ xs: 5, sm: 3 }}>
                                    <TextField
                                      fullWidth
                                      type="number"
                                      label="Quantité"
                                      name={`ingredients.${index}.quantity`}
                                      value={ingredient.quantity}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={touched.ingredients?.[index]?.quantity && Boolean(errors.ingredients?.[index]?.quantity)}
                                      helperText={touched.ingredients?.[index]?.quantity && errors.ingredients?.[index]?.quantity}
                                      margin="normal"
                                    />
                                  </Grid>
                                  
                                  <Grid size={{ xs: 5, sm: 3 }}>
                                    <FormControl fullWidth margin="normal">
                                      <InputLabel>Unité</InputLabel>
                                      <Select
                                        name={`ingredients.${index}.unit`}
                                        value={ingredient.unit}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Unité"
                                      >
                                        {units.map((unit) => (
                                          <MenuItem key={unit.value} value={unit.value}>
                                            {unit.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  
                                  <Grid size={{ xs: 2, sm: 1 }} sx={{ display: 'flex', alignItems: 'center' }}>
                                    {values.ingredients.length > 1 && (
                                      <IconButton
                                        onClick={() => arrayHelpers.remove(index)}
                                        color="error"
                                        size="small"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    )}
                                  </Grid>
                                </Grid>
                              ))}
                              
                              <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => arrayHelpers.push({ name: '', quantity: '', unit: 'g' })}
                                sx={{ mt: 2 }}
                              >
                                Ajouter un ingrédient
                              </Button>
                              
                              {typeof errors.ingredients === 'string' && (
                                <FormHelperText error>{errors.ingredients}</FormHelperText>
                              )}
                            </div>
                          )}
                        />
                      )}
                      
                      {index === 2 && (
                        <FieldArray
                          name="instructions"
                          render={arrayHelpers => (
                            <div>
                              {values.instructions.map((instruction, index) => (
                                <Box key={index} mb={2}>
                                  <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label={`Étape ${index + 1}`}
                                    name={`instructions.${index}`}
                                    value={instruction}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.instructions?.[index] && Boolean(errors.instructions?.[index])}
                                    helperText={touched.instructions?.[index] && errors.instructions?.[index]}
                                    margin="normal"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <Typography variant="subtitle1" color="text.secondary">
                                            {index + 1}.
                                          </Typography>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  
                                  <Box display="flex" justifyContent="flex-end" mt={1}>
                                    {values.instructions.length > 1 && (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => arrayHelpers.remove(index)}
                                      >
                                        Supprimer cette étape
                                      </Button>
                                    )}
                                  </Box>
                                  
                                  <Divider sx={{ my: 2 }} />
                                </Box>
                              ))}
                              
                              <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => arrayHelpers.push('')}
                                sx={{ mt: 2 }}
                              >
                                Ajouter une étape
                              </Button>
                              
                              {typeof errors.instructions === 'string' && (
                                <FormHelperText error>{errors.instructions}</FormHelperText>
                              )}
                            </div>
                          )}
                        />
                      )}
                      
                      {index === 3 && (
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Notes et astuces"
                              name="notes"
                              value={values.notes}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              helperText="Facultatif - Vous pouvez ajouter des conseils ou des variantes"
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TagsInput
                              name="tags"
                              label="Tags"
                              placeholder="Ajouter des mots-clés (ex: végétarien, rapide, sans gluten...)"
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.isPublished}
                                  onChange={handleChange}
                                  name="isPublished"
                                  color="primary"
                                />
                              }
                              label="Publier cette recette"
                            />
                            <FormHelperText>
                              Si coché, la recette sera visible par les visiteurs du site
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
                            {index === steps.length - 1 ? 'Enregistrer la recette' : 'Suivant'}
                          </Button>
                          
                          <Button
                            disabled={activeStep === 0 || isSubmitting}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            Précédent
                          </Button>
                          
                          {index < steps.length - 1 && (
                            <Button
                              variant="outlined"
                              onClick={() => {
                                // Passer directement à l'aperçu ou à l'enregistrement
                                if (index === steps.length - 2) {
                                  // Dernière étape avant l'enregistrement
                                  handleNext();
                                } else {
                                  // Passer à l'aperçu
                                  setActiveStep(steps.length - 1);
                                }
                              }}
                              sx={{ ml: 1 }}
                            >
                              Passer à l'aperçu
                            </Button>
                          )}
                        </div>
                      </Box>
                    </StepContent>
                  )}
                </Step>
              ))}
            </Stepper>
            {!isMobile && values.isSubmitted && (
              <Paper sx={{ p: 3, mt: 2, textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Recette enregistrée avec succès !
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Votre recette a été enregistrée et est maintenant disponible dans la liste des recettes.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/admin/recipes')}
                  sx={{ mt: 2 }}
                >
                  Voir toutes les recettes
                </Button>
              </Paper>
            )}
            </Form>
          )}
        </Formik>
      </Box>
      
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default NewRecipePage;
