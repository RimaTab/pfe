import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  ButtonGroup
} from '@mui/material';
import {
  People as PeopleIcon,
  Restaurant as RecipeIcon,
  BarChart as ChartIcon,
  ShowChart as LineChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import AdminLayout from '@/components/admin/AdminLayout';
import useAuth from '@/hooks/useAuth';

// Enregistrer les composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Données de démonstration pour les graphiques
const generateDemoData = (timeRange = 'week') => {
  const now = new Date();
  let labels = [];
  let visits = [];
  let users = [];
  let recipes = [];
  
  if (timeRange === 'week') {
    // Données pour la semaine
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    labels = days;
    visits = days.map(() => Math.floor(Math.random() * 1000) + 500);
    users = days.map(() => Math.floor(Math.random() * 200) + 100);
    recipes = days.map(() => Math.floor(Math.random() * 50) + 20);
  } else if (timeRange === 'month') {
    // Données pour le mois (4 semaines)
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - (i * 7));
      labels.push(`Sem. ${i + 1}`);
      visits.push(Math.floor(Math.random() * 3000) + 2000);
      users.push(Math.floor(Math.random() * 800) + 300);
      recipes.push(Math.floor(Math.random() * 100) + 50);
    }
  } else {
    // Données pour l'année (12 mois)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    labels = months;
    visits = months.map(() => Math.floor(Math.random() * 10000) + 5000);
    users = months.map(() => Math.floor(Math.random() * 3000) + 1000);
    recipes = months.map(() => Math.floor(Math.random() * 300) + 100);
  }
  
  return { labels, visits, users, recipes };
};

// Données pour les graphiques
const chartData = (timeRange) => {
  const { labels, visits, users, recipes } = generateDemoData(timeRange);
  
  return {
    lineData: {
      labels,
      datasets: [
        {
          label: 'Visites',
          data: visits,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Nouveaux utilisateurs',
          data: users,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Nouvelles recettes',
          data: recipes,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    barData: {
      labels,
      datasets: [
        {
          label: 'Visites',
          data: visits,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Nouveaux utilisateurs',
          data: users,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    pieData: {
      labels: ['Visiteurs uniques', 'Retours', 'Nouveaux visiteurs'],
      datasets: [
        {
          data: [
            Math.floor(Math.random() * 10000) + 5000,
            Math.floor(Math.random() * 5000) + 2000,
            Math.floor(Math.random() * 3000) + 1000
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    doughnutData: {
      labels: ['Mobile', 'Tablette', 'Desktop'],
      datasets: [
        {
          data: [
            Math.floor(Math.random() * 70) + 20,
            Math.floor(Math.random() * 20) + 10,
            Math.floor(Math.random() * 40) + 20
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  };
};

// Options communes pour les graphiques
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      padding: 12,
      boxPadding: 6
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        borderDash: [3, 3]
      }
    }
  }
};

// Options spécifiques pour les graphiques en anneau
const doughnutOptions = {
  ...chartOptions,
  cutout: '70%',
  plugins: {
    ...chartOptions.plugins,
    legend: {
      ...chartOptions.plugins.legend,
      position: 'right'
    }
  }
};

// Composant de métrique
const MetricCard = ({ title, value, change, icon: Icon, color }) => {
  const theme = useTheme();
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {isPositive && <ArrowUpwardIcon color="success" fontSize="small" />}
              {isNegative && <ArrowDownwardIcon color="error" fontSize="small" />}
              {!isPositive && !isNegative && <TrendingFlatIcon color="action" fontSize="small" />}
              <Typography 
                variant="body2" 
                color={isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary'}
                sx={{ ml: 0.5 }}
              >
                {change !== 0 ? `${Math.abs(change)}%` : 'Stable'}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                vs. période précédente
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.dark`,
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon fontSize="large" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Tableau des pages les plus visitées
const TopPagesTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pages les plus visitées
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Page</TableCell>
                <TableCell align="right">Visiteurs</TableCell>
                <TableCell align="right">Pages/vue</TableCell>
                <TableCell align="right">Temps moyen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2">{row.page}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {row.url}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{row.visitors.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.pagesPerVisit.toFixed(1)}</TableCell>
                    <TableCell align="right">{row.avgTime}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </CardContent>
    </Card>
  );
};

const StatsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Données de démonstration pour le tableau des pages les plus visitées
  const topPagesData = [
    { page: 'Accueil', url: '/', visitors: 12453, pagesPerVisit: 3.2, avgTime: '2:45' },
    { page: 'Recettes', url: '/recipes', visitors: 9876, pagesPerVisit: 4.1, avgTime: '3:12' },
    { page: 'Programmes', url: '/programs', visitors: 7654, pagesPerVisit: 5.3, avgTime: '4:23' },
    { page: 'Blog', url: '/blog', visitors: 5432, pagesPerVisit: 2.8, avgTime: '2:15' },
    { page: 'Contact', url: '/contact', visitors: 3210, pagesPerVisit: 1.5, avgTime: '1:45' },
    { page: 'À propos', url: '/about', visitors: 2987, pagesPerVisit: 1.8, avgTime: '2:01' },
    { page: 'FAQ', url: '/faq', visitors: 2456, pagesPerVisit: 2.1, avgTime: '2:30' },
    { page: 'Conditions d\'utilisation', url: '/terms', visitors: 1234, pagesPerVisit: 1.2, avgTime: '1:15' },
    { page: 'Politique de confidentialité', url: '/privacy', visitors: 987, pagesPerVisit: 1.1, avgTime: '1:10' },
    { page: 'Mentions légales', url: '/legal', visitors: 654, pagesPerVisit: 1.0, avgTime: '0:45' }
  ];

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simuler un chargement asynchrone
      await new Promise(resolve => setTimeout(resolve, 800));
      setData(chartData(timeRange));
      setIsLoading(false);
    };
    
    if (isAuthenticated) {
      loadData();
    }
  }, [timeRange, isAuthenticated]);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Gérer le changement de période
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Si l'utilisateur n'est pas authentifié, le composant PrivateRoute gérera la redirection
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <Head>
        <title>Statistiques - Tableau de bord</title>
      </Head>
      
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: isMobile ? 2 : 0 }}>
            Tableau de bord
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="time-range-label">Période</InputLabel>
              <Select
                labelId="time-range-label"
                id="time-range-select"
                value={timeRange}
                label="Période"
                onChange={handleTimeRangeChange}
                startAdornment={<DateRangeIcon sx={{ mr: 1, color: 'action.active' }} />}
              >
                <MenuItem value="week">7 derniers jours</MenuItem>
                <MenuItem value="month">4 dernières semaines</MenuItem>
                <MenuItem value="year">12 derniers mois</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="Actualiser les données">
              <IconButton 
                color="primary" 
                onClick={() => setData(chartData(timeRange))}
                disabled={isLoading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Métriques clés */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Visiteurs"
              value="24.5K"
              change={12.5}
              icon={PeopleIcon}
              color="primary"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Pages vues"
              value="87.2K"
              change={8.2}
              icon={ChartIcon}
              color="secondary"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Temps moyen"
              value="3:45"
              change={-2.3}
              icon={TrendingUpIcon}
              color="info"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Taux de rebond"
              value="42.8%"
              change={-5.1}
              icon={TrendingDownIcon}
              color="warning"
            />
          </Grid>
        </Grid>
        
        {/* Graphiques principaux */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%', minHeight: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Aperçu des performances</Typography>
                  <ButtonGroup size="small" variant="outlined">
                    <Button 
                      variant={activeTab === 0 ? 'contained' : 'outlined'}
                      onClick={() => setActiveTab(0)}
                      startIcon={<LineChartIcon />}
                    >
                      Ligne
                    </Button>
                    <Button 
                      variant={activeTab === 1 ? 'contained' : 'outlined'}
                      onClick={() => setActiveTab(1)}
                      startIcon={<ChartIcon />}
                    ></Button>
                  </ButtonGroup>
                </Box>
                
                <Box sx={{ height: 'calc(100% - 48px)' }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {activeTab === 0 && data?.lineData && (
                        <Line data={data.lineData} options={chartOptions} />
                      )}
                      {activeTab === 1 && data?.barData && (
                        <Bar data={data.barData} options={chartOptions} />
                      )}
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, lg: 4 }}>
            <Grid container spacing={3} direction="column" sx={{ height: '100%' }}>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ height: '100%', minHeight: 300 }}>
                    <Typography variant="h6" gutterBottom>
                      Répartition des appareils
                    </Typography>
                    {isLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 40px)' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      data?.doughnutData && (
                        <Box sx={{ height: 250, mt: 2 }}>
                          <Doughnut data={data.doughnutData} options={doughnutOptions} />
                        </Box>
                      )
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ height: '100%', minHeight: 300 }}>
                    <Typography variant="h6" gutterBottom>
                      Sources de trafic
                    </Typography>
                    {isLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 40px)' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      data?.pieData && (
                        <Box sx={{ height: 250, mt: 2 }}>
                          <Pie data={data.pieData} options={doughnutOptions} />
                        </Box>
                      )
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Tableau des pages les plus visitées */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TopPagesTable data={topPagesData} />
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default StatsPage;
