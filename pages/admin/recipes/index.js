import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  TablePagination,
  TableSortLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import AdminLayout from '../../../components/admin/AdminLayout';
import useAuth from '../../../hooks/useAuth';

// Données de démonstration pour les recettes
const DEMO_RECIPES = [
  {
    id: 1,
    title: 'Poulet rôti aux herbes',
    category: 'Plat principal',
    prepTime: '20 min',
    cookTime: '1h',
    difficulty: 'Moyen',
    rating: 4.5,
    status: 'published',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-15T10:30:00Z'
  },
  // Ajoutez plus de recettes de démonstration si nécessaire
];

const RecipesPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, logout, user } = useAuth();
  
  // États pour la gestion des données
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, recipeId: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // États pour la pagination et le tri
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Charger les recettes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        
        // Utiliser le service de recettes pour charger les recettes
        const { getRecipes } = await import('@/services/recipeService');
        const recipes = getRecipes();
        
        // Si aucune recette n'existe, utiliser les données de démonstration
        if (recipes.length === 0) {
          setRecipes(DEMO_RECIPES);
        } else {
          setRecipes(recipes);
        }
        // Simulation de chargement
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Utilisation des données de démonstration
        setRecipes(DEMO_RECIPES);
        setError('');
      } catch (err) {
        console.error('Erreur lors du chargement des recettes:', err);
        setError('Impossible de charger les recettes. Veuillez réessayer.');
        setSnackbar({
          open: true,
          message: 'Erreur lors du chargement des recettes',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecipes();
    }
  }, [isAuthenticated]);

  // Gérer le tri
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Gérer le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gérer la suppression d'une recette
  const handleDeleteClick = (recipeId) => {
    setDeleteDialog({ open: true, recipeId });
  };

  // Gérer la suppression d'une recette
  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Utiliser le service de recettes pour supprimer la recette
      const { deleteRecipe } = await import('@/services/recipeService');
      await deleteRecipe(deleteDialog.recipeId);
      
      // Mettre à jour l'état local
      setRecipes(recipes.filter(recipe => recipe.id !== deleteDialog.recipeId));
      
      setSnackbar({
        open: true,
        message: 'Recette supprimée avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la recette:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur est survenue lors de la suppression de la recette',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, recipeId: null });
    }
  };

  // Annuler la suppression
  const cancelDelete = () => {
    setDeleteDialog({ open: false, recipeId: null });
  };

  // Filtrer et trier les recettes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || recipe.status === filter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (orderBy === 'title') {
      return order === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (orderBy === 'createdAt') {
      return order === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else if (orderBy === 'rating') {
      return order === 'asc' 
        ? a.rating - b.rating 
        : b.rating - a.rating;
    }
    return 0;
  });

  // Pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRecipes.length) : 0;
  const paginatedRecipes = filteredRecipes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Si l'utilisateur n'est pas authentifié, le composant PrivateRoute gérera la redirection
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <Head>
        <title>Gestion des recettes - Tableau de bord</title>
      </Head>
      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Gestion des recettes
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/recipes/new')}
            >
              Nouvelle recette
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
            >
              Actualiser
            </Button>
          </Box>
        </Box>
        
        {/* Barre de recherche et filtres */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Rechercher une recette..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250, flexGrow: 1 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="filter-label">Filtrer par statut</InputLabel>
                <Select
                  labelId="filter-label"
                  value={filter}
                  label="Filtrer par statut"
                  onChange={(e) => setFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">Tous les statuts</MenuItem>
                  <MenuItem value="draft">Brouillon</MenuItem>
                  <MenuItem value="published">Publié</MenuItem>
                  <MenuItem value="archived">Archivé</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
        
        {/* Tableau des recettes */}
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : filteredRecipes.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="body1" color="textSecondary">
                  Aucune recette trouvée
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'title'}
                            direction={orderBy === 'title' ? order : 'asc'}
                            onClick={() => handleRequestSort('title')}
                          >
                            Titre
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Catégorie</TableCell>
                        <TableCell align="right">Temps de préparation</TableCell>
                        <TableCell align="right">Difficulté</TableCell>
                        <TableCell align="right">
                          <TableSortLabel
                            active={orderBy === 'rating'}
                            direction={orderBy === 'rating' ? order : 'desc'}
                            onClick={() => handleRequestSort('rating')}
                          >
                            Note
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'createdAt'}
                            direction={orderBy === 'createdAt' ? order : 'desc'}
                            onClick={() => handleRequestSort('createdAt')}
                          >
                            Date de création
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRecipes.map((recipe) => (
                        <TableRow key={recipe.id} hover>
                          <TableCell>{recipe.title}</TableCell>
                          <TableCell>{recipe.category}</TableCell>
                          <TableCell align="right">{recipe.prepTime}</TableCell>
                          <TableCell align="right">{recipe.difficulty}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={recipe.rating.toFixed(1)} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(recipe.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={recipe.status === 'published' ? 'Publié' : 'Brouillon'}
                              color={recipe.status === 'published' ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Tooltip title="Modifier">
                                <IconButton 
                                  size="small" 
                                  onClick={() => router.push(`/admin/recipes/edit/${recipe.id}`)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton 
                                  onClick={() => handleDeleteClick(recipe.id)}
                                  color="error"
                                  size="small"
                                  disabled={loading}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={8} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredRecipes.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Lignes par page:"
                  labelDisplayedRows={({ from, to, count }) => 
                    `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                  }
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      
      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default RecipesPage;
