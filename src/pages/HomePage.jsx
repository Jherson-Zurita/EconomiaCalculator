import React from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CardActionArea 
} from '@mui/material';
import { 
  AttachMoney, 
  Calculate, 
  TrendingUp, 
  Timeline 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HomePage() {
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
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

export default HomePage;