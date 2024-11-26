import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import {  AppBar,  Toolbar,  Typography,  Container,  Grid, Card,  CardContent, CardActionArea, Switch, Box
} from '@mui/material';
import {
  AttachMoney,
  Calculate,
  TrendingUp,
  Timeline
} from '@mui/icons-material';
import InteresSimple from './components/InteresSimple';
import InteresCompuesto from './components/InteresCompuesto';
import TasaInteresVariable from './components/TasaInteresVariable';
import SeriesUniformes from './components/SeriesUniformes';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import 'katex/dist/katex.min.css';


function Home() {
  const navigate = useNavigate();
  const calculadorasItems = [
    {
      titulo: "Interés Simple",
      descripcion: "Cálculos de interés simple",
      icono: <AttachMoney />,
      ruta: "/interes-simple"
    },
    {
      titulo: "Interés Compuesto",
      descripcion: "Cálculos de interés compuesto",
      icono: <Calculate />,
      ruta: "/interes-compuesto"
    },
    {
      titulo: "Tasa de Interés Variable",
      descripcion: "Interés que cambia con el tiempo",
      icono: <TrendingUp />,
      ruta: "/tasa-interes-variable"
    },
    {
      titulo: "Series Uniformes",
      descripcion: "Cálculo de series uniformes",
      icono: <Timeline />,
      ruta: "/series-uniformes"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
      >
        Calculadora de Ingeniería Económica
      </Typography>

      <Grid
        container
        spacing={3}
        justifyContent="center"
      >
        {calculadorasItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardActionArea
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => navigate(item.ruta)}
              >
                {React.cloneElement(item.icono, {
                  sx: {
                    fontSize: 60,
                    color: 'primary.main',
                    mb: 2
                  }
                })}
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    align="center"
                  >
                    {item.titulo}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {item.descripcion}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Box sx={{ maxHeight: 'mx', maxWidth:'mx',backgroundColor: '#666666' ,minHeight: '100vh'}}>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Calculadora de Ingeniería Económica
              </Typography>
              <ThemeSwitch />
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/interes-simple" element={<InteresSimple />} />
            <Route path="/interes-compuesto" element={<InteresCompuesto />} />
            <Route path="/tasa-interes-variable" element={<TasaInteresVariable />} />
            <Route path="/series-uniformes" element={<SeriesUniformes />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

function ThemeSwitch() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  return (
    <Switch
      checked={darkMode}
      onChange={() => setDarkMode(!darkMode)}
      color="default"
      inputProps={{ 'aria-label': 'theme switch' }}
    />
  );
}

export default App;

