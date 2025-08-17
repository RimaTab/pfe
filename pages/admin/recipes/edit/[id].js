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
  'g', 'kg', 'ml', 'cl', 'L', 'c. à soupe', 'c. à café', 'pincée', 'unité', 'tranche', 'feuille'
];

// Composant pour le champ de tags
const TagsInput = ({ name, label, placeholder, ...props }) => {
  const { setFieldValue, values } = useFormikContext();
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue) {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/,/g, '');
      if (newTag && !values.tags.includes(newTag)) {
        setFieldValue('tags', [...values.tags, newTag]);
      }
      setInputValue('');
    }
  };
  
  const handleDelete = (tagToDelete) => {
    setFieldValue('tags', values.tags.filter(tag => tag !== tagToDelete));
  };
  
  return (
    <div>
      <TextField
        fullWidth
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue) {
            const newTag = inputValue.trim().replace(/,/g, '');
            if (newTag && !values.tags.includes(newTag)) {
              setFieldValue('tags', [...values.tags, newTag]);
            }
            setInputValue('');
          }
        }}
        placeholder={placeholder}
        margin="normal"
        InputProps={{
          startAdornment: values.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDelete(tag)}
              style={{ marginRight: 4, marginBottom: 4 }}
            />
          ))
        }}
        {...props}
      />
    </div>
  );
};

// Composant pour l'upload d'images
const ImageUpload = ({ name, label, ...props }) => {
  const { setFieldValue, values } = useFormikContext();
  const [preview, setPreview] = useState(values[name] || '');
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFieldValue(name, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id={`${name}-button-file`}
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor={`${name}-button-file`}>
        <Button
          variant="outlined"
          component="span"
          startIcon={<PhotoCameraIcon />}
          style={{ marginBottom: 16 }}
        >
          {label}
        </Button>
      </label>
      {preview && (
        <Box mt={2} textAlign="center">
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }}
          />
        </Box>
      )}
    </div>
  );
};

const EditRecipePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
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
    tags: [],
    image: ''
  });
  
  // Charger la recette à éditer
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        
        // Utiliser le service de recettes pour charger la recette
        const { getRecipeById } = await import('@/services/recipeService');
        const recipe = getRecipeById(id);
        
        if (recipe) {
          setInitialValues({
            ...recipe,
            ingredients: recipe.ingredients.length > 0 
              ? recipe.ingredients 
              : [{ name: '', quantity: '', unit: 'g' }],
            instructions: recipe.instructions.length > 0 
              ? recipe.instructions 
              : ['']
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Recette non trouvée',
            severity: 'error'
          });
          router.push('/admin/recipes');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la recette:', error);
        setSnackbar({
          open: true,
          message: 'Une erreur est survenue lors du chargement de la recette',
          severity: 'error'
        });
        router.push('/admin/recipes');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchRecipe();
    }
  }, [id, router]);
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Utiliser le service de recettes pour mettre à jour la recette
      const { updateRecipe } = await import('@/services/recipeService');
      const updatedRecipe = {
        ...values,
        updatedAt: new Date().toISOString()
      };
      
      await updateRecipe(id, updatedRecipe);
      
      setSnackbar({
        open: true,
        message: 'Recette mise à jour avec succès !',
        severity: 'success'
      });
      
      // Rediriger vers la liste des recettes après un délai
      setTimeout(() => {
        router.push('/admin/recipes');
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la recette:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de la mise à jour de la recette',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Gérer la navigation entre les étapes
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Si l'utilisateur n'est pas authentifié, le composant PrivateRoute gérera la redirection
  if (!isAuthenticated) {
    return null;
  }
  
  // Fonction pour gérer les changements d'ingrédients
  const handleIngredientChange = (e, index) => {
    const { name, value } = e.target;
    const ingredients = [...values.ingredients];
    const fieldName = name.split('.')[2]; // Récupère le nom du champ (name, amount, unit)
    
    if (fieldName === 'amount') {
      ingredients[index][fieldName] = value === '' ? '' : Number(value);
    } else {
      ingredients[index][fieldName] = value;
    }
    
    setFieldValue('ingredients', ingredients);
  };
  
  // Fonction pour supprimer un ingrédient
  const removeIngredient = (index) => {
    const ingredients = [...values.ingredients];
    ingredients.splice(index, 1);
    setFieldValue('ingredients', ingredients);
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Head>
        <title>Modifier la recette - Tableau de bord</title>
      </Head>
      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Modifier la recette
          </Typography>
        </Box>
        
        <Formik
          initialValues={initialValues}
          validationSchema={recipeValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
                {['Informations de base', 'Ingrédients', 'Préparation', 'Options'].map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Box mt={4}>
                {activeStep === 0 && (
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
                      
                      <Grid container spacing={3}>
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
                      </Grid>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
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
                            InputProps={{
                              endAdornment: <InputAdornment position="end">min</InputAdornment>,
                            }}
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
                            InputProps={{
                              endAdornment: <InputAdornment position="end">min</InputAdornment>,
                            }}
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
                      
                      <TagsInput
                        name="tags"
                        label="Tags"
                        placeholder="Ajouter des tags (appuyez sur Entrée ou ,)"
                        value={values.tags}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <ImageUpload 
                        name="image" 
                        label="Ajouter une image"
                      />
                    </Grid>
                  </Grid>
                )}
                
                {activeStep === 1 && (
                  <FieldArray
                    name="ingredients"
                    render={arrayHelpers => (
                      <div>
                        {values.ingredients && values.ingredients.length > 0 ? (
                          values.ingredients.map((ingredient, index) => (
                            <Grid container spacing={2} alignItems="center" key={index}>
                              <Grid item xs={12} sm={5}>
                                <TextField
                                  fullWidth
                                  label="Ingrédient"
                                  name={`ingredients.${index}.name`}
                                  value={ingredient.name}
                                  onChange={(e) => handleIngredientChange(e, index)}
                                  onBlur={handleBlur}
                                  error={touched.ingredients?.[index]?.name && Boolean(errors.ingredients?.[index]?.name)}
                                  helperText={touched.ingredients?.[index]?.name && errors.ingredients?.[index]?.name}
                                  margin="none"
                                />
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Quantité"
                                  name={`ingredients.${index}.amount`}
                                  value={ingredient.amount}
                                  onChange={(e) => handleIngredientChange(e, index)}
                                  onBlur={handleBlur}
                                  error={touched.ingredients?.[index]?.amount && Boolean(errors.ingredients?.[index]?.amount)}
                                  helperText={touched.ingredients?.[index]?.amount && errors.ingredients?.[index]?.amount}
                                  margin="none"
                                />
                              </Grid>
                              <Grid item xs={5} sm={3}>
                                <FormControl fullWidth margin="none">
                                  <InputLabel>Unité</InputLabel>
                                  <Select
                                    name={`ingredients.${index}.unit`}
                                    value={ingredient.unit}
                                    onChange={(e) => handleIngredientChange(e, index)}
                                    label="Unité"
                                  >
                                    {units.map((unit) => (
                                      <MenuItem key={unit} value={unit}>
                                        {unit}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={1} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <IconButton
                                  color="error"
                                  onClick={() => removeIngredient(index)}
                                  aria-label="Supprimer l'ingrédient"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))
                        ) : null}
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => arrayHelpers.push({ name: '', amount: '', unit: 'g' })}
                          sx={{ mt: 1 }}
                        >
                          Ajouter un ingrédient
                        </Button>
                      </div>
                    )}
                  />
                )}
                
                {activeStep === 2 && (
                  <FieldArray
                    name="instructions"
                    render={arrayHelpers => (
                      <div>
                        {values.instructions && values.instructions.length > 0 ? (
                          values.instructions.map((instruction, index) => (
                            <Box key={index} sx={{ mb: 3 }}>
                              <Box display="flex" alignItems="center" mb={1}>
                                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                                  Étape {index + 1}
                                </Typography>
                                <IconButton
                                  onClick={() => arrayHelpers.remove(index)}
                                  size="small"
                                  color="error"
                                  disabled={values.instructions.length <= 1}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name={`instructions.${index}.description`}
                                value={instruction.description || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.instructions?.[index]?.description && Boolean(errors.instructions?.[index]?.description)}
                                helperText={touched.instructions?.[index]?.description && errors.instructions?.[index]?.description}
                                placeholder="Décrivez cette étape..."
                              />
                            </Box>
                          ))
                        ) : null}
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => arrayHelpers.push({ description: '' })}
                          sx={{ mt: 1 }}
                        >
                          Ajouter une étape
                        </Button>
                      </div>
                    )}
                  />
                )}
                
                {activeStep === 3 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Notes (optionnel)"
                        name="notes"
                        value={values.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        helperText="Des conseils, des variantes, des astuces..."
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
                        label="Publier la recette"
                      />
                    </Grid>
                  </Grid>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Précédent
                  </Button>
                  
                  {activeStep < 3 ? (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ ml: 1 }}
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </Button>
                  )}
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      
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

export default EditRecipePage;
