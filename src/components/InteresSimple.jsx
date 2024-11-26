import React, { useState } from 'react';
import {
  Container, Typography, Paper, Grid, TextField, Button, Tabs, Tab, Box, Alert
} from '@mui/material';

import {
  LineChart,
  Line,
  Rectangle,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { InlineMath, BlockMath } from 'react-katex';


function InteresSimple() {
  // State para manejar la pestaña activa
  const [tabValue, setTabValue] = useState(0);
  const [graficoDatos, setGraficoDatos] = useState([]);

  // States para cada tipo de cálculo
  const [interesState, setInteresState] = useState({
    capital: '',
    tasa: '',
    tiempo: '',
    interes: ''
  });

  const [tasaState, setTasaState] = useState({
    capital: '',
    interes: '',
    tiempo: '',
    tasa: ''
  });

  const [tiempoState, setTiempoState] = useState({
    capital: '',
    interes: '',
    tasa: '',
    tiempo: ''
  });

  const [vpState, setVpState] = useState({
    valorFuturo: '',
    tasa: '',
    tiempo: '',
    valorPresente: ''
  });

  const [vfState, setVfState] = useState({
    valorPresente: '',
    tasa: '',
    tiempo: '',
    valorFuturo: ''
  });

  // Funciones de cálculo
  // Modificar el botón de cálculo de interés para generar gráfico
  const calcularInteres = () => {
    const { capital, tasa, tiempo } = interesState;
    if (capital && tasa && tiempo) {
      const interes = (parseFloat(capital) * parseFloat(tasa) * parseFloat(tiempo)) / 100;
      setInteresState(prev => ({ ...prev, interes: interes.toFixed(2) }));

      // Generar datos del gráfico
      generarDatosGrafico();
    }
  };

  const calcularTasa = () => {
    const { capital, interes, tiempo } = tasaState;
    if (capital && interes && tiempo) {
      const tasa = (parseFloat(interes) * 100) / (parseFloat(capital) * parseFloat(tiempo));
      setTasaState(prev => ({ ...prev, tasa: tasa.toFixed(2) }));

      generarDatosGraficoTasa();
    }
  };

  const calcularTiempo = () => {
    const { capital, interes, tasa } = tiempoState;
    if (capital && interes && tasa) {
      const tiempo = (parseFloat(interes) * 100) / (parseFloat(capital) * parseFloat(tasa));
      setTiempoState(prev => ({ ...prev, tiempo: tiempo.toFixed(2) }));

      generarDatosGraficoTiempo();
    }
  };

  const calcularVP = () => {
    const { valorFuturo, tasa, tiempo } = vpState;
    if (valorFuturo && tasa && tiempo) {
      const valorPresente = parseFloat(valorFuturo) / Math.pow((1 + parseFloat(tasa) / 100), parseFloat(tiempo));
      setVpState(prev => ({ ...prev, valorPresente: valorPresente.toFixed(2) }));

      generarDatosGraficoVP();
    }
  };

  const calcularVF = () => {
    const { valorPresente, tasa, tiempo } = vfState;
    if (valorPresente && tasa && tiempo) {
      const valorFuturo = parseFloat(valorPresente) * (1 + (parseFloat(tasa) * parseFloat(tiempo) / 100));
      setVfState(prev => ({ ...prev, valorFuturo: valorFuturo.toFixed(2) }));

      generarDatosGraficoVF();
    }
  };

  const renderGraficoInteres = () => (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={graficoDatos}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="periodo"
            label={{
              value: 'Periodo',
              position: 'insideBottomRight',
              offset: 0
            }}
          />
          <YAxis
            label={{
              value: 'Valor',
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="interes"
            name="Interés"
            fill="#ffc658"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderGraficoTaza = () => (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={graficoDatos}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tasa" />
          <YAxis
            dataKey="periodo"
            type="number"
            domain={[0, 100]}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="tasa"
            name="Tasa (%)"
            fill="#82ca9d"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
            background={{ fill: '#eee' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderGraficoTiempo = () => (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={graficoDatos}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="periodo"
            label={{
              value: 'Periodo',
              position: 'insideBottomRight',
              offset: 0
            }}
          />
          <YAxis
            label={{
              value: ' Tiempo (años)',
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="tiempo"
            name="Tiempo (años)"
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderGraficoVP = () => (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={graficoDatos} margin={{ top: 20, right: 30, left: 20, bottom: 5, }} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
          <YAxis label={{ value: 'Valor Presente', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [value.toFixed(2), 'Valor Presente']} />
          <Legend />
          <Bar dataKey="valorPresente" name="Valor Presente" fill="#1F51FF" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderGraficoVF = () => (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={graficoDatos} margin={{ top: 20, right: 30, left: 20, bottom: 5, }} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
          <YAxis label={{ value: 'Valor Futuro', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [value.toFixed(2), 'Valor Futuro']} />
          <Legend />
          <Bar dataKey="valorFuturo" name="Valor Futuro" fill="#6500ff" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderProcedimientoInteres = () => {
    const { capital, tasa, tiempo, interes } = interesState;
    return (
      <>
        <Typography variant="h6" sx={{ padding: 2 }}>Procedimiento:</Typography>
        {capital && tasa && tiempo && (
          <BlockMath math={`I = \\frac{VP \\cdot r \\cdot n}{100} = \\frac{${capital} \\cdot ${tasa} \\cdot ${tiempo}}{100} = ${interes}`} />
        )}
      </>
    );
  };
  
  

  const renderProcedimientoTaza = () => {
    const { capital, interes, tiempo, tasa } = tasaState;
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {capital && interes && tiempo && (
          <Typography>
            <BlockMath math={`r = \\frac{I \\cdot 100}{VP \\cdot n} = \\frac{${interes} \\cdot 100}{${capital} \\cdot ${tiempo}} = ${tasa}`} />
          </Typography>
        )}
      </Box>
    );
  };

  const renderProcedimientoTiempo = () => {
    const { capital, interes, tasa, tiempo } = tiempoState;
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {capital && interes && tasa && (
          <Typography>
            <BlockMath math={`n = \\frac{I \\cdot 100}{VP \\cdot r} = \\frac{${interes} \\cdot 100}{${capital} \\cdot ${tasa}} = ${tiempo}`} />
          </Typography>
        )}
      </Box>
    );
  };

  const renderProcedimientoVP = () => {
    const { valorFuturo, tasa, tiempo, valorPresente } = vpState;
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorFuturo && tasa && tiempo && (
          <Typography>
            <BlockMath math={`VP = \\frac{VF}{(1 + r * n)} = \\frac{${valorFuturo}}{(1 + ${tasa}/100 * ${tiempo})} = ${valorPresente}`} />
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Donde:
          <br />
          VP = Valor Presente
          <br />
          VF = Valor Futuro
          <br />
          r = Tasa de interés
          <br />
          n = Número de periodos
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoVF = () => {
    const { valorPresente, tasa, tiempo, valorFuturo } = vfState;
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorPresente && tasa && tiempo && (
          <Typography>
            <BlockMath math={`VF = VP + ( VP \\cdot (r) \\cdot n) \\ = ${valorPresente} + (${valorPresente} \\cdot (${tasa}/100) \\cdot ${tiempo}) \\\\ = ${valorFuturo}`} />
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Donde:
          <br />
          VF = Valor Futuro
          <br />
          VP = Valor Presente
          <br />
          r = Tasa de interés
          <br />
          n = Número de periodos
        </Typography>
      </Box>
    );
  };

  // Función para generar datos del gráfico
  const generarDatosGrafico = () => {
    const { capital, tasa, tiempo } = interesState;

    if (!capital || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const capitalNum = parseFloat(capital);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);

    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      // Calcular Valor Presente y Valor Futuro
      const interes = (capitalNum * tasaNum * periodo) / 100;
      const valorFuturo = capitalNum + interes;
      const valorPresente = capitalNum / Math.pow((1 + tasaNum / 100), periodo);

      datosGrafico.push({
        periodo: periodo,
        valorPresente: valorPresente,
        valorFuturo: valorFuturo,
        interes: interes
      });
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoTasa = () => {
    const { capital, interes, tiempo } = tasaState;

    if (!capital || !interes || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const capitalNum = parseFloat(capital);
    const interesNum = parseFloat(interes);
    const tiempoNum = parseFloat(tiempo);

    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      const tasa = (parseFloat(interes) * 100) / (capitalNum * periodo);
      datosGrafico.push({
        periodo: periodo,
        tasa: tasa || 0
      });
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoTiempo = () => {
    const { capital, interes, tasa } = tiempoState;

    if (!capital || !interes || !tasa) {
      return;
    }

    const datosGrafico = [];
    const capitalNum = parseFloat(capital);
    const interesNum = parseFloat(interes);
    const tasaNum = parseFloat(tasa);

    for (let periodo = 1; periodo <= 1; periodo++) {
      const tiempo = (parseFloat(interes) * 100) / (capitalNum * tasaNum);
      datosGrafico.push({
        periodo: periodo,
        tiempo: tiempo || 0
      });
    }

    console.log(datosGrafico);

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoVP = () => {
    const { valorFuturo, tasa, tiempo } = vpState;

    if (!valorFuturo || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const valorFuturoNum = parseFloat(valorFuturo);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);

    // Calcular el valor presente inicial
    const valorPresenteInicial = valorFuturoNum / ((1 + tasaNum / 100 * tiempoNum));

    // Agregar el valor presente en el periodo 0
    datosGrafico.push({
      periodo: 0,
      valorPresente: valorPresenteInicial
    });

    // Calcular los valores intermedios
    for (let periodo = 1; periodo < tiempoNum; periodo++) {
      const valorIntermedio = valorPresenteInicial * ((1 + tasaNum / 100 * periodo));
      datosGrafico.push({
        periodo: periodo,
        valorPresente: valorIntermedio
      });
    }

    // Agregar el valor futuro total en el último periodo
    datosGrafico.push({
      periodo: tiempoNum,
      valorPresente: valorFuturoNum
    });

    setGraficoDatos(datosGrafico);
  };


  const generarDatosGraficoVF = () => {
    const { valorPresente, tasa, tiempo } = vfState;

    if (!valorPresente || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const valorPresenteNum = parseFloat(valorPresente);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);

    // Agregar el valor presente en el periodo 0
    datosGrafico.push({
      periodo: 0,
      valorFuturo: valorPresenteNum
    });

    // Calcular intereses acumulados para los periodos intermedios
    for (let periodo = 1; periodo < tiempoNum; periodo++) {
      const interesAcumulado = valorPresenteNum * (tasaNum / 100) * periodo;
      datosGrafico.push({
        periodo: periodo,
        valorFuturo: interesAcumulado
      });
    }

    // Agregar el valor futuro total en el último periodo
    const valorFuturoTotal = valorPresenteNum + valorPresenteNum * (tasaNum / 100) * tiempoNum;
    datosGrafico.push({
      periodo: tiempoNum,
      valorFuturo: valorFuturoTotal
    });

    setGraficoDatos(datosGrafico);
  };


  // Manejador de cambios para inputs
  const handleInteresChange = (e) => {
    const { name, value } = e.target;
    setInteresState(prev => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Renderizado de pestañas de cálculo
  const renderCalculadoraInteres = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Capital"
          name="capital"
          type="number"
          value={interesState.capital}
          onChange={handleInteresChange}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={interesState.tasa}
          onChange={handleInteresChange}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={interesState.tiempo}
          onChange={handleInteresChange}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularInteres}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular Interés
        </Button>
      </Grid>
      {interesState.interes && (
        <Grid item xs={12}>
          <Alert severity="info">
            Interés: {interesState.interes}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  // Similar para otras pestañas (Tasa, Tiempo, VP)
  const renderCalculadoraTasa = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Capital"
          name="capital"
          type="number"
          value={tasaState.capital}
          onChange={(e) => setTasaState(prev => ({ ...prev, capital: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Interés"
          name="interes"
          type="number"
          value={tasaState.interes}
          onChange={(e) => setTasaState(prev => ({ ...prev, interes: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={tasaState.tiempo}
          onChange={(e) => setTasaState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularTasa}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular Tasa
        </Button>
      </Grid>
      {tasaState.tasa && (
        <Grid item xs={12}>
          <Alert severity="info">
            Tasa: {tasaState.tasa}%
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraTiempo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Capital"
          name="capital"
          type="number"
          value={tiempoState.capital}
          onChange={(e) => setTiempoState(prev => ({ ...prev, capital: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Interés"
          name="interes"
          type="number"
          value={tiempoState.interes}
          onChange={(e) => setTiempoState(prev => ({ ...prev, interes: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={tiempoState.tasa}
          onChange={(e) => setTiempoState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularTiempo}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular Tiempo
        </Button>
      </Grid>
      {tiempoState.tiempo && (
        <Grid item xs={12}>
          <Alert severity="info">
            Tiempo: {tiempoState.tiempo} años
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraVP = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Valor Futuro"
          name="valorFuturo"
          type="number"
          value={vpState.valorFuturo}
          onChange={(e) => setVpState(prev => ({ ...prev, valorFuturo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={vpState.tasa}
          onChange={(e) => setVpState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={vpState.tiempo}
          onChange={(e) => setVpState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularVP}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VP
        </Button>
      </Grid>
      {vpState.valorPresente && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor Presente: {vpState.valorPresente}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraVF = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Valor Presente"
          name="valorPresente"
          type="number"
          value={vfState.valorPresente}
          onChange={(e) => setVfState(prev => ({ ...prev, valorPresente: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={vfState.tasa}
          onChange={(e) => setVfState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={vfState.tiempo}
          onChange={(e) => setVfState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularVF}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VF
        </Button>
      </Grid>
      {vfState.valorFuturo && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor Futuro: {vfState.valorFuturo}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  // Renderizado principal
  return (
    <Container maxWidth="md" sx={{ mt: 4 ,minHeight: '100vh'}}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Calculadora de Interés Simple
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Interés" />
          <Tab label="Tasa" />
          <Tab label="Tiempo" />
          <Tab label="Valor Presente" />
          <Tab label="Valor Futuro" />
        </Tabs>

        <Box sx={{ p: 2 }}>

          {tabValue === 0 && renderCalculadoraInteres()}
          {tabValue === 1 && renderCalculadoraTasa()}
          {tabValue === 2 && renderCalculadoraTiempo()}
          {tabValue === 3 && renderCalculadoraVP()}
          {tabValue === 4 && renderCalculadoraVF()}
          {tabValue === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoInteres()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Interés Simple
                    </Typography>
                    {renderGraficoInteres()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoTaza()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Tasa Simple
                    </Typography>
                    {renderGraficoTaza()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoTiempo()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Tasa Simple
                    </Typography>
                    {renderGraficoTiempo()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoVP()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Tasa Simple
                    </Typography>
                    {renderGraficoVP()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 4 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoVF()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Tasa Simple
                    </Typography>
                    {renderGraficoVF()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default InteresSimple;