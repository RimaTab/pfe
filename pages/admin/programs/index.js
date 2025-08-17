import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Paper,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon
} from '@mui/icons-material';
import AdminLayout from '@/components/admin/AdminLayout';
import useAuth from '@/hooks/useAuth';

// Données de démonstration (à remplacer par un appel API réel)
const demoPrograms = [
  {
    id: 1,
    title: 'Programme Perte de Poids',
    description: 'Programme complet pour une perte de poids saine et durable',
    duration: '12 semaines',
    difficulty: 'Intermédiaire',
    isPublished: true,
    createdAt: '2023-10-15',
    updatedAt: '2023-10-20'
  },
  {
    id: 2,
    title: 'Programme Prise de Masse',
    description: 'Développez votre masse musculaire avec ce programme intensif',
    duration: '16 semaines',
    difficulty: 'Avancé',
    isPublished: true,
    createdAt: '2023-09-20',
    updatedAt: '2023-10-10'
  },
  {
    id: 3,
    title: 'Programme Débutant',
    description: 'Idéal pour commencer votre parcours de remise en forme',
    duration: '8 semaines',
    difficulty: 'Débutant',
    isPublished: false,
    createdAt: '2023-11-01',
    updatedAt: '2023-11-05'
  }
];

const ProgramsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, user } = useAuth();
  
  // États
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les programmes (simulation d'API)
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        // Simuler un chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPrograms(demoPrograms);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des programmes:', error);
        setSnackbar({
          open: true,
          message: 'Erreur lors du chargement des programmes',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPrograms();
    }
  }, [isAuthenticated]);

  // Gérer le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gérer l'ouverture du menu d'actions
  const handleMenuOpen = (event, program) => {
    setAnchorEl(event.currentTarget);
    setSelectedProgram(program);
  };

  // Gérer la fermeture du menu d'actions
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProgram(null);
  };

  // Gérer la suppression d'un programme
  const handleDelete = () => {
    // Simulation de suppression
    setSnackbar({
      open: true,
      message: `Programme "${selectedProgram?.title}" supprimé avec succès`,
      severity: 'success'
    });
    handleMenuClose();
  };

  // Gérer la publication/dépublication d'un programme
  const handleTogglePublish = () => {
    // Simulation de mise à jour
    setSnackbar({
      open: true,
      message: `Programme "${selectedProgram?.title}" ${selectedProgram?.isPublished ? 'dépublié' : 'publié'} avec succès`,
      severity: 'success'
    });
    handleMenuClose();
  };

  // Filtrer les programmes selon le terme de recherche
  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedPrograms = filteredPrograms.slice(
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
        <title>Programmes - Tableau de bord</title>
      </Head>
      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: isMobile ? 2 : 0 }}>
            Gestion des programmes
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto' }}>
            <TextField
              size="small"
              placeholder="Rechercher un programme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: isMobile ? '100%' : 300 }}
            />
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/programs/new')}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Nouveau programme
            </Button>
          </Box>
        </Box>
        
        <Card>
          <CardHeader 
            title={`${filteredPrograms.length} programme${filteredPrograms.length !== 1 ? 's' : ''} trouvé${filteredPrograms.length !== 1 ? 's' : ''}`}
            action={
              <Tooltip title="Filtres">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            }
          />
          
          <Divider />
          
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : filteredPrograms.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {searchTerm 
                    ? 'Aucun programme ne correspond à votre recherche.'
                    : 'Aucun programme disponible pour le moment.'}
                </Typography>
                {searchTerm && (
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={() => setSearchTerm('')}
                  >
                    Réinitialiser la recherche
                  </Button>
                )}
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Titre</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Durée</TableCell>
                        <TableCell>Difficulté</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPrograms.map((program) => (
                        <TableRow key={program.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {program.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 300
                              }}
                            >
                              {program.description}
                            </Typography>
                          </TableCell>
                          <TableCell>{program.duration}</TableCell>
                          <TableCell>
                            <Chip 
                              label={program.difficulty}
                              size="small"
                              color={
                                program.difficulty === 'Débutant' ? 'primary' :
                                program.difficulty === 'Intermédiaire' ? 'secondary' :
                                'error'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={program.isPublished ? 'Publié' : 'Brouillon'}
                              color={program.isPublished ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, program)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredPrograms.length}
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
      
      {/* Menu d'actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          router.push(`/admin/programs/${selectedProgram?.id}`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir les détails</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          router.push(`/admin/programs/edit/${selectedProgram?.id}`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleTogglePublish}>
          <ListItemIcon>
            {selectedProgram?.isPublished ? (
              <UnpublishedIcon fontSize="small" color="warning" />
            ) : (
              <PublishIcon fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedProgram?.isPublished ? 'Dépublier' : 'Publier'}
          </ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>
      
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

export default ProgramsPage;
