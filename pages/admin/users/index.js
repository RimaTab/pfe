import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

export default function UsersManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Ici, vous devriez faire un appel API pour récupérer les utilisateurs
        // Exemple avec des données simulées :
        const mockUsers = Array.from({ length: 35 }, (_, i) => ({
          id: i + 1,
          name: `Utilisateur ${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: i % 3 === 0 ? 'admin' : 'user',
          status: i % 5 === 0 ? 'inactive' : 'active',
          lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          avatar: `https://i.pravatar.cc/150?img=${i % 70}`
        }));
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (userId) => {
    router.push(`/admin/users/edit/${userId}`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // Ici, vous devriez faire un appel API pour supprimer l'utilisateur
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId) => {
    // Ici, vous devriez faire un appel API pour mettre à jour le statut
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Gestion des utilisateurs - Admin</title>
      </Head>
      
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Gestion des utilisateurs</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/users/new')}
          >
            Nouvel utilisateur
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Dernière connexion</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Chargement des utilisateurs...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow hover key={user.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              src={user.avatar} 
                              alt={user.name}
                              sx={{ width: 40, height: 40, mr: 2 }}
                            >
                              {!user.avatar && <PersonIcon />}
                            </Avatar>
                            {user.name}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role === 'admin' ? 'Administrateur' : 'Utilisateur'} 
                            color={user.role === 'admin' ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status === 'active' ? 'Actif' : 'Inactif'} 
                            color={user.status === 'active' ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Modifier">
                            <IconButton onClick={() => handleEditUser(user.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.status === 'active' ? 'Désactiver' : 'Activer'}>
                            <IconButton onClick={() => handleToggleStatus(user.id)}>
                              {user.status === 'active' ? (
                                <CancelIcon color="error" fontSize="small" />
                              ) : (
                                <CheckCircleIcon color="success" fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton onClick={() => handleDeleteUser(user.id)}>
                              <DeleteIcon color="error" fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </Paper>
      </Box>
    </AdminLayout>
  );
}
