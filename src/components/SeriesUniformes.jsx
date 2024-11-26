import React, { useState } from 'react';
import {
  Container,
  Paper,
  Stack,
  Grid,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  IconButton,
  Box, Typography
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter
} from 'recharts';
import { BlockMath } from 'react-katex';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete'

function SeriesUniformes() {
  const [tiempoGeneral, setTiempoGeneral] = useState('');
  const [montos, setMontos] = useState([]);
  const [tasaInteres, setTasaInteres] = useState('');
  const [seriesAnuales, setSeriesAnuales] = useState([]);
  const [openMontosDialog, setOpenMontosDialog] = useState(false);
  const [openSeriesDialog, setOpenSeriesDialog] = useState(false);
  const [openGradientesDialog, setOpenGradientesDialog] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [calcularVF, setCalcularVF] = useState(false);

  const [nuevoMonto, setNuevoMonto] = useState({
    valor: '',
    tipo: 'VF',
    periodo: '',
    esPositivo: true
  });

  const [nuevaSerie, setNuevaSerie] = useState({
    valor: '',
    periodoInicio: '',
    periodoFin: '',
    esPositivo: true
  });

  const [gradientes, setGradientes] = useState([]);
  const [nuevoGradiente, setNuevoGradiente] = useState({
    valor: '',
    periodoInicio: '',
    periodoFin: '',
    esPositivo: true
  });

  const limpiarCalculos = () => {
    setTiempoGeneral('');
    setMontos([]);
    setTasaInteres('');
    setSeriesAnuales([]);
    setGradientes([]);
    setResultado(null);
    setCalcularVF(false);
  };

  // Factor P/F
  const factorPF = (i, n) => 1 / Math.pow(1 + i / 100, n);

  // Factor F/P
  const factorFP = (i, n) => Math.pow(1 + i / 100, n);

  // Factor P/A
  const factorPA = (i, n) => {
    const tasaDecimal = i / 100;
    return (Math.pow(1 + tasaDecimal, n) - 1) / (tasaDecimal * Math.pow(1 + tasaDecimal, n));
  };

  // Factor A/P
  const factorAP = (i, n) => {
    const tasaDecimal = i / 100;
    return (tasaDecimal * Math.pow(1 + tasaDecimal, n)) / (Math.pow(1 + tasaDecimal, n) - 1);
  };

  // Factor A/F
  const factorAF = (i, n) => {
    const tasaDecimal = i / 100;
    return tasaDecimal / (Math.pow(1 + tasaDecimal, n) - 1);
  };

  // Factor F/A
  const factorFA = (i, n) => {
    const tasaDecimal = i / 100;
    return (Math.pow(1 + tasaDecimal, n) - 1) / tasaDecimal;
  };

  // Factor P/G
  const factorPG = (i, n) => {
    const tasaDecimal = i / 100;
    return (Math.pow(1 + tasaDecimal, n) - 1 - n * tasaDecimal) / (Math.pow(tasaDecimal, 2) * Math.pow(1 + tasaDecimal, n));
  };

  // Factor A/G
  const factorAG = (i, n) => {
    const tasaDecimal = i / 100;
    return (1 / tasaDecimal) - (n / (Math.pow(1 + tasaDecimal, n) - 1));
  };

  const calcularVPTotal = () => {
    const i = parseFloat(tasaInteres);
    const n = parseFloat(tiempoGeneral);

    // Calcular VP de las series anuales
    const vpSeriesAnuales = seriesAnuales.reduce((total, serie) => {
      const periodoInicio = parseFloat(serie.periodoInicio);
      const periodoFin = parseFloat(serie.periodoFin);
      const valorSerie = parseFloat(serie.valor);

      const numPeriodos = periodoFin - periodoInicio + 1;

      if (periodoInicio <= n && periodoFin <= n && periodoInicio > 0) {
        return total + valorSerie * factorPA(i, numPeriodos) * factorPF(i, periodoInicio - 1);
      }
      return total;
    }, 0);

    // Calcular VP de los montos
    const vpMontos = montos.reduce((total, monto) => {
      const periodo = parseFloat(monto.periodo);
      const valorMonto = parseFloat(monto.valor);
      return total + valorMonto * factorPF(i, periodo);
    }, 0);

    // Calcular VP de los gradientes
    const vpGradientes = gradientes.reduce((total, gradiente) => {
      const periodoInicio = parseFloat(gradiente.periodoInicio);
      const periodoFin = parseFloat(gradiente.periodoFin);
      const valorGradiente = parseFloat(gradiente.valor);

      if (periodoInicio <= n && periodoFin <= n && periodoInicio > 0) {
        const numPeriodos = periodoFin - periodoInicio + 1;
        console.log(numPeriodos);
        const periodoMedio = (periodoFin - periodoInicio) / 2;
        const valorConSigno = gradiente.esPositivo ? valorGradiente : -valorGradiente; // Aplicar el signo
        return total + valorConSigno * factorPG(i, numPeriodos) * factorPF(i, periodoMedio - 1);
      }
      return total;
    }, 0);

    setResultado({
      vpSeriesAnuales,
      vpMontos,
      vpGradientes,
      vpTotal: vpSeriesAnuales + vpMontos + vpGradientes
    });
  };

  const calcularVFTotal = () => {
    const i = parseFloat(tasaInteres) / 100; // Convertir a decimal
    const n = parseFloat(tiempoGeneral);

    // Calcular VF de las series anuales
    const vfSeriesAnuales = seriesAnuales.reduce((total, serie) => {
      const periodoInicio = parseFloat(serie.periodoInicio);
      const periodoFin = parseFloat(serie.periodoFin);
      const valorSerie = parseFloat(serie.valor);

      // Asegurarse de que la serie anual esté dentro del rango
      if (periodoInicio <= n && periodoFin <= n && periodoInicio > 0) {
        // Calcular el número de periodos de la serie
        const numPeriodos = periodoFin - periodoInicio + 1;
        return total + valorSerie * Math.pow(1 + i, periodoFin - periodoInicio + 1);
      }
      return total; // Si no está en el rango, no se suma
    }, 0);

    // Calcular VF de los montos
    const vfMontos = montos.reduce((total, monto) => {
      const periodo = parseFloat(monto.periodo);
      const valorMonto = parseFloat(monto.valor);
      return total + valorMonto * Math.pow(1 + i, periodo);
    }, 0);

    // Calcular VF de los gradientes
    const vfGradientes = gradientes.reduce((total, gradiente) => {
      const periodoInicio = parseFloat(gradiente.periodoInicio);
      const periodoFin = parseFloat(gradiente.periodoFin);
      const valorGradiente = parseFloat(gradiente.valor);

      // Asegurarse de que el gradiente esté dentro del rango
      if (periodoInicio <= n && periodoFin <= n && periodoInicio > 0) {
        const numPeriodos = periodoFin - periodoInicio + 1;
        const valorConSigno = gradiente.esPositivo ? valorGradiente : -valorGradiente; // Aplicar el signo
        const vfGradiente = valorConSigno * ((Math.pow(1 + i, numPeriodos) - 1) / i) * Math.pow(1 + i, periodoFin - 1);
        return total + vfGradiente;
      }
      return total; // Si no está en el rango, no se suma
    }, 0);

    setResultado({
      vfSeriesAnuales,
      vfMontos,
      vfGradientes,
      vfTotal: vfSeriesAnuales + vfMontos + vfGradientes
    });
  };

  const agregarMonto = () => {
    setMontos([...montos, {
      ...nuevoMonto,
      valor: nuevoMonto.esPositivo ? parseFloat(nuevoMonto.valor) : -parseFloat(nuevoMonto.valor)
    }]);
    setOpenMontosDialog(false);
    setNuevoMonto({ valor: '', tipo: 'VF', periodo: '', esPositivo: true });
  };

  const agregarSerieAnual = () => {
    setSeriesAnuales([...seriesAnuales, {
      ...nuevaSerie,
      valor: nuevaSerie.esPositivo ? parseFloat(nuevaSerie.valor) : -parseFloat(nuevaSerie.valor)
    }]);
    setOpenSeriesDialog(false);
    setNuevaSerie({ valor: '', periodoInicio: '', periodoFin: '', esPositivo: true });
  };

  const agregarGradiente = () => {
    setGradientes([...gradientes, {
      ...nuevoGradiente,
      valor: nuevoGradiente.esPositivo ? parseFloat(nuevoGradiente.valor) : -parseFloat(nuevoGradiente.valor)
    }]);
    setOpenGradientesDialog(false);
    setNuevoGradiente({ valor: '', periodoInicio: '', periodoFin: '', esPositivo: true });
  };

  //procedimientos :
  const renderProcedimientoVP = () => {
    if (!resultado) return null;

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento de Cálculo de Valor Presente:</Typography>

        {seriesAnuales.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Series Anuales:</Typography>
            {seriesAnuales.map((serie, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  Serie {index + 1}:
                  Valor = {serie.valor},
                  Periodo: {serie.periodoInicio} - {serie.periodoFin}
                </Typography>
                <BlockMath
                  math={`VP = ${serie.valor} \\cdot \\frac{(1 + ${parseFloat(tasaInteres) / 100})^{${serie.periodoFin - serie.periodoInicio + 1}} - 1}{${parseFloat(tasaInteres) / 100} \\cdot (1 + ${parseFloat(tasaInteres) / 100})^{${serie.periodoFin - serie.periodoInicio + 1}}} \\cdot \\frac{1}{(1 + ${parseFloat(tasaInteres) / 100})^{${serie.periodoInicio - 1}}}`}
                />
                <Typography>
                  VP = {(serie.valor * factorPA(parseFloat(tasaInteres), serie.periodoFin - serie.periodoInicio + 1) * factorPF(parseFloat(tasaInteres), serie.periodoInicio - 1)).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography variant="subtitle2">
              VP Total Series = {resultado.vpSeriesAnuales.toFixed(2)}
            </Typography>
          </Box>
        )}

        {montos.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Montos Puntuales:</Typography>
            {montos.map((monto, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  Monto {index + 1}:
                  Valor = {monto.valor},
                  Periodo = {monto.periodo}
                </Typography>
                <BlockMath
                  math={`VP = ${monto.valor} \\cdot \\frac{1}{(1 + ${parseFloat(tasaInteres) / 100})^{${monto.periodo}}}`}
                />
                <Typography>
                  VP = {(monto.valor * factorPF(parseFloat(tasaInteres), parseFloat(monto.periodo))).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography variant="subtitle2">
              VP Total Montos = {resultado.vpMontos.toFixed(2)}
            </Typography>
          </Box>
        )}

        {gradientes.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Gradientes:</Typography>
            {gradientes.map((gradiente, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  Gradiente {index + 1}:
                  Valor = {gradiente.valor},
                  Periodo: {gradiente.periodoInicio} - {gradiente.periodoFin}
                </Typography>
                <BlockMath
                  math={`VP = ${gradiente.valor} \\cdot \\frac{(1 + ${parseFloat(tasaInteres) / 100})^{${gradiente.periodoFin - gradiente.periodoInicio + 1}} - ${parseFloat(tasaInteres) / 100} \\cdot ${gradiente.periodoFin - gradiente.periodoInicio + 1}-1}{(${parseFloat(tasaInteres) / 100})^2 \\cdot (1 + ${parseFloat(tasaInteres) / 100})^{${gradiente.periodoFin - gradiente.periodoInicio + 1}}} \\cdot \\frac{1}{(1 + ${parseFloat(tasaInteres) / 100})^{(${(gradiente.periodoFin - gradiente.periodoInicio) / 2 - 1})}}`}
                />
                <Typography>
                  VP = {((gradiente.valor * factorPG(parseFloat(tasaInteres), gradiente.periodoFin - gradiente.periodoInicio + 1)) * factorPF(parseFloat(tasaInteres), (gradiente.periodoInicio + gradiente.periodoFin) / 2 - 1)).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography variant="subtitle2">
              VP Total Gradientes = {resultado.vpGradientes.toFixed(2)}
            </Typography>
          </Box>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          VP Total: {resultado.vpTotal.toFixed(2)}
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoVF = () => {
    if (!resultado) return null;

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento de Cálculo de Valor Futuro:</Typography>

        {seriesAnuales.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Series Anuales:</Typography>
            {seriesAnuales.map((serie, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  Serie {index + 1}:
                  Valor = {serie.valor},
                  Periodo: {serie.periodoInicio} - {serie.periodoFin}
                </Typography>
                <BlockMath
                  math={`VF = ${serie.valor} \\cdot \\frac{(1 + ${parseFloat(tasaInteres) / 100})^{${serie.periodoFin - serie.periodoInicio + 1}} - 1}{${parseFloat(tasaInteres) / 100}} \\cdot (1 + ${parseFloat(tasaInteres) / 100})^{${n - serie.periodoFin}}`}
                />
                <Typography>
                  VF = {(serie.valor * factorFA(parseFloat(tasaInteres), serie.periodoFin - serie.periodoInicio + 1) * Math.pow(1 + parseFloat(tasaInteres) / 100, n - serie.periodoFin)).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography variant="subtitle2">
              VF Total Series = {resultado.vfSeriesAnuales.toFixed(2)}
            </Typography>
          </Box>
        )}

        {montos.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Montos Puntuales:</Typography>
            {montos.map((monto, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  Monto {index + 1}:
                  Valor = {monto.valor},
                  Periodo = {monto.periodo}
                </Typography>
                <BlockMath
                  math={`VF = ${monto.valor} \\cdot (1 + ${parseFloat(tasaInteres) / 100})^{${n - monto.periodo}}`}
                />
                <Typography>
                  VF = {(monto.valor * Math.pow(1 + parseFloat(tasaInteres) / 100, n - monto.periodo)).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography variant="subtitle2">
              VF Total Montos = {resultado.vfMontos.toFixed(2)}
            </Typography>
          </Box>
        )}

        {gradientes.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Gradientes:</Typography>
            {gradientes.map((gradiente, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  Gradiente {index + 1}:
                  Valor = {gradiente.valor},
                  Periodo: {gradiente.periodoInicio} - {gradiente.periodoFin}
                </Typography>
                <BlockMath
                  math={`VF = ${gradiente.valor} \\cdot \\frac{(1 + ${parseFloat(tasaInteres) / 100})^{${gradiente.periodoFin - gradiente.periodoInicio + 1}} - 1}{${parseFloat(tasaInteres) / 100}} \\cdot (1 + ${parseFloat(tasaInteres) / 100})^{${n - gradiente.periodoFin}}`}
                />
                <Typography>
                  VF = {((gradiente.valor * factorFA(parseFloat(tasaInteres), gradiente.periodoFin - gradiente.periodoInicio + 1)) * Math.pow(1 + parseFloat(tasaInteres) / 100, n - gradiente.periodoFin)).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography variant="subtitle2">
              VF Total Gradientes = {resultado.vfGradientes.toFixed(2)}
            </Typography>
          </Box>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          VF Total: {resultado.vfTotal.toFixed(2)}
        </Typography>
      </Box>
    );
  };


  //Datos Graficos
  const generarDatosGraficoVP = () => {
    if (!resultado) return [];

    const datosGrafico = [];
    const tasaDecimal = parseFloat(tasaInteres) / 100;

    // Generar datos agrupados por periodo
    const periodos = {};

    montos.forEach(monto => {
      const periodo = parseFloat(monto.periodo);
      const valor = parseFloat(monto.valor);
      if (!periodos[periodo]) periodos[periodo] = { periodo, valorMontoPuntual: 0, valorSerieAnual: 0, valorGradiente: 0 };
      periodos[periodo].valorMontoPuntual += valor;
    });

    seriesAnuales.forEach(serie => {
      const periodoInicio = parseFloat(serie.periodoInicio);
      const periodoFin = parseFloat(serie.periodoFin);
      const valorSerie = parseFloat(serie.valor);

      for (let t = periodoInicio; t <= periodoFin; t++) {
        if (!periodos[t]) periodos[t] = { periodo: t, valorMontoPuntual: 0, valorSerieAnual: 0, valorGradiente: 0 };
        periodos[t].valorSerieAnual += valorSerie;
      }
    });

    gradientes.forEach(gradiente => {
      const periodoInicio = parseFloat(gradiente.periodoInicio);
      const periodoFin = parseFloat(gradiente.periodoFin);
      const valorGradiente = parseFloat(gradiente.valor);

      for (let t = periodoInicio; t <= periodoFin; t++) {
        if (!periodos[t]) periodos[t] = { periodo: t, valorMontoPuntual: 0, valorSerieAnual: 0, valorGradiente: 0 };
        periodos[t].valorGradiente += valorGradiente * (t - periodoInicio + 1);
      }
    });

    return Object.values(periodos);
  };

  const generarDatosGraficoVF = () => {
    if (!resultado) return [];

    const datosGrafico = [];
    const i = parseFloat(tasaInteres) / 100; // Convertir a decimal
    const n = parseFloat(tiempoGeneral);

    // Montos puntuales
    montos.forEach((monto) => {
      const periodo = parseFloat(monto.periodo);
      const valorVF = parseFloat(monto.valor) * Math.pow(1 + i, periodo);
      datosGrafico.push({
        periodo,
        tipo: "Monto Puntual",
        valor: valorVF,
      });
    });

    // Series anuales
    seriesAnuales.forEach((serie) => {
      const periodoInicio = parseFloat(serie.periodoInicio);
      const periodoFin = parseFloat(serie.periodoFin);
      const valorSerie = parseFloat(serie.valor);

      for (let t = periodoInicio; t <= periodoFin; t++) {
        const valorVF = valorSerie * Math.pow(1 + i, t);
        datosGrafico.push({
          periodo: t,
          tipo: "Serie Anual",
          valor: valorVF,
        });
      }
    });

    // Gradientes
    gradientes.forEach((gradiente) => {
      const periodoInicio = parseFloat(gradiente.periodoInicio);
      const periodoFin = parseFloat(gradiente.periodoFin);
      const valorGradiente = parseFloat(gradiente.valor);
      const signo = gradiente.esPositivo ? 1 : -1;

      for (let t = periodoInicio; t <= periodoFin; t++) {
        const incremento = signo * valorGradiente * (t - periodoInicio + 1);
        const valorVF = incremento * Math.pow(1 + i, t);
        datosGrafico.push({
          periodo: t,
          tipo: "Gradiente",
          valor: valorVF,
        });
      }
    });

    return datosGrafico;
  };

  //Render Grafico
  const renderGraficoVP = () => {
    const datosGrafico = generarDatosGraficoVP();

    return (
      <Box sx={{ width: '100%', height: 500 }}>
        <ResponsiveContainer>
          <BarChart
            data={datosGrafico}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="periodo"
              label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }}
            />
            <YAxis
              label={{ value: 'Valor Presente', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={(value, name, props) => [value.toFixed(2), props.payload.tipo]} />
            <Legend />
            <Bar dataKey="valorMontoPuntual" name="Monto Puntual" fill="#FF0000" />
            <Bar dataKey="valorSerieAnual" name="Serie Anual" fill="#00FF00" />
            <Bar dataKey="valorGradiente" name="Gradiente" fill="#0000FF" />

          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderGraficoVF = () => {
    const datosGrafico = generarDatosGraficoVF();

    return (
      <Box sx={{ width: "100%", height: 500 }}>
        <ResponsiveContainer>
          <BarChart
            data={datosGrafico}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="periodo"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickCount={10}
              label={{ value: "Periodo", position: "insideBottomRight", offset: 0 }}
              tickFormatter={(tick) => `P${tick}`}
              allowDecimals={false}
            />
            <YAxis
              label={{ value: "Valor Futuro", angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value, name, props) => [value.toFixed(2), props.payload.tipo]} />
            <Legend />
            <Bar dataKey="valor" name="Monto Puntual" fill="#FF0000" />
            <Bar dataKey="valor" name="Serie Anual" fill="#00FF00" />
            <Bar dataKey="valor" name="Gradiente" fill="#0000FF" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };


  const eliminarMonto = (index) => {
    const nuevoMontos = [...montos];
    nuevoMontos.splice(index, 1);
    setMontos(nuevoMontos);
  };

  const eliminarSerie = (index) => {
    const nuevasSeries = [...seriesAnuales];
    nuevasSeries.splice(index, 1);
    setSeriesAnuales(nuevasSeries);
  };

  const eliminarGradiente = (index) => {
    const nuevosGradientes = [...gradientes];
    nuevosGradientes.splice(index, 1);
    setGradientes(nuevosGradientes);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 ,minHeight: '100vh'}}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            color: 'primary.main',
            mb: 3
          }}
        >
          Calculadora Financiera de Gradientes y Montos
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tiempo Total"
              type="number"
              variant="outlined"
              value={tiempoGeneral}
              onChange={(e) => setTiempoGeneral(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tasa de Interés (%)"
              type="number"
              variant="outlined"
              value={tasaInteres}
              onChange={(e) => setTasaInteres(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Sección de Gradientes */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setOpenGradientesDialog(true)}
                fullWidth
              >
                Agregar Gradiente
              </Button>
            </Stack>
          </Grid>

          {gradientes.map((gradiente, index) => (
            <Grid item xs={12} key={index} container alignItems="center" spacing={1}>
              <Grid item xs={10}>
                <Alert
                  severity="info"
                  sx={{ borderRadius: 1 }}
                >
                  Gradiente: {gradiente.valor} - Periodo: {gradiente.periodoInicio} a {gradiente.periodoFin}
                </Alert>
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => eliminarGradiente(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Sección de Montos */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setOpenMontosDialog(true)}
                fullWidth
              >
                Agregar Monto
              </Button>
            </Stack>
          </Grid>

          {montos.map((monto, index) => (
            <Grid item xs={12} key={index} container alignItems="center" spacing={1}>
              <Grid item xs={10}>
                <Alert
                  severity={monto.esPositivo ? "success" : "error"}
                  sx={{ borderRadius: 1 }}
                >
                  {monto.tipo}: {monto.valor} - Periodo: {monto.periodo}
                </Alert>
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => eliminarMonto(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Sección de Series Anuales */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setOpenSeriesDialog(true)}
                fullWidth
              >
                Agregar Serie Anual
              </Button>
            </Stack>
          </Grid>

          {seriesAnuales.map((serie, index) => (
            <Grid item xs={12} key={index} container alignItems="center" spacing={1}>
              <Grid item xs={10}>
                <Alert
                  severity={serie.esPositivo ? "success" : "error"}
                  sx={{ borderRadius: 1 }}
                >
                  Valor: {serie.valor} - Periodo: {serie.periodoInicio} a {serie.periodoFin}
                </Alert>
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => eliminarSerie(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          {/* Botones de cálculo */}
          <Grid item container spacing={2}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calcularVF ? calcularVFTotal : calcularVPTotal}
                  fullWidth
                >
                  {calcularVF ? 'Calcular VF Total' : 'Calcular VP Total'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setCalcularVF(!calcularVF)}
                  fullWidth
                >
                  {calcularVF ? 'Cambiar a VP' : 'Cambiar a VF'}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={limpiarCalculos}
                  fullWidth
                >
                  Limpiar Resultados
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Resultados */}
          {resultado && (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ borderRadius: 1 }}>
                {['Series Anuales', 'Montos Puntuales', 'Gradientes', 'Total'].map((label, i) => (
                  <Typography variant="body1" key={i}>
                    {`${calcularVF ? 'VF' : 'VP'} ${label}: ${[resultado.vpSeriesAnuales, resultado.vpMontos, resultado.vpGradientes, resultado.vpTotal][i].toFixed(2)}`}
                  </Typography>
                ))}
              </Alert>
            </Grid>
          )}

          {resultado && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Procedimiento para {calcularVF ? 'VF' : 'VP'}
                </Typography>
                {calcularVF ? renderProcedimientoVF() : renderProcedimientoVP()}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Visualización
                </Typography>
                {calcularVF ? renderGraficoVF() : renderGraficoVP()}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Diálogos para agregar elementos */}
      <Dialog open={openGradientesDialog} onClose={() => setOpenGradientesDialog(false)}>
        <DialogTitle>Agregar Nuevo Gradiente</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                value={nuevoGradiente.valor}
                onChange={(e) => setNuevoGradiente(prev => ({ ...prev, valor: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Periodo Inicio"
                type="number"
                value={nuevoGradiente.periodoInicio}
                onChange={(e) => setNuevoGradiente(prev => ({ ...prev, periodoInicio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Periodo Fin"
                type="number"
                value={nuevoGradiente.periodoFin}
                onChange={(e) => setNuevoGradiente(prev => ({ ...prev, periodoFin: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={nuevoGradiente.esPositivo}
                    onChange={(e) => setNuevoGradiente(prev => ({ ...prev, esPositivo: e.target.checked }))}
                  />
                }
                label={nuevoGradiente.esPositivo ? "Positivo" : "Negativo"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGradientesDialog(false)}>Cancelar</Button>
          <Button onClick={agregarGradiente}>Agregar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMontosDialog} onClose={() => setOpenMontosDialog(false)}>
        <DialogTitle>Agregar Nuevo Monto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                value={nuevoMonto.valor}
                onChange={(e) => setNuevoMonto(prev => ({ ...prev, valor: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Tipo"
                value={nuevoMonto.tipo}
                onChange={(e) => setNuevoMonto(prev => ({ ...prev, tipo: e.target.value }))}
                SelectProps={{ native: true }}
              >
                <option value="VF">Valor Futuro</option>
                <option value="VP">Valor Presente</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Periodo"
                type="number"
                value={nuevoMonto.periodo}
                onChange={(e) => setNuevoMonto(prev => ({ ...prev, periodo: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={nuevoMonto.esPositivo}
                    onChange={(e) => setNuevoMonto(prev => ({ ...prev, esPositivo: e.target.checked }))}
                  />
                }
                label={nuevoMonto.esPositivo ? "Positivo" : "Negativo"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMontosDialog(false)}>Cancelar</Button>
          <Button onClick={agregarMonto}>Agregar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSeriesDialog} onClose={() => setOpenSeriesDialog(false)}>
        <DialogTitle>Agregar Nueva Serie Anual</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                value={nuevaSerie.valor}
                onChange={(e) => setNuevaSerie(prev => ({ ...prev, valor: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Periodo Inicio"
                type="number"
                value={nuevaSerie.periodoInicio}
                onChange={(e) => setNuevaSerie(prev => ({ ...prev, periodoInicio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Periodo Fin"
                type="number"
                value={nuevaSerie.periodoFin}
                onChange={(e) => setNuevaSerie(prev => ({ ...prev, periodoFin: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={nuevaSerie.esPositivo}
                    onChange={(e) => setNuevaSerie(prev => ({ ...prev, esPositivo: e.target.checked }))}
                  />
                }
                label={nuevaSerie.esPositivo ? "Positivo" : "Negativo"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSeriesDialog(false)}>Cancelar</Button>
          <Button onClick={agregarSerieAnual}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeriesUniformes;