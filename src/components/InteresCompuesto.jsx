import React, { useState } from 'react';
import {
  Container, Typography, Paper, Grid, TextField, Button, Tabs, Tab, Box, Alert, FormControl, InputLabel, Select, MenuItem
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


function InteresCompuesto() {
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

  const [TasaTN, setTasaTN] = useState({
    interes: '',
    tiempo: '',
    tiempoUnidad: 'Año',
    PeriodoC: '',
    periodoUnidad: 'Mensual',
    m: '',
    TasaEfectiva: ''
  });

  const [inputs, setInputs] = useState({ nominalRate: '', compoundingPeriods: '', presentValue: '', futureValue: '', effectiveRate: '' });

  const unidadesRelativas = {
    Año: {
      Año: 1,
      Semestre: 2,
      Trimestre: 4,
      Bimestre: 6,
      Mensual: 12,
      Semanal: 52,
      Día: 365
    },
    Semestre: {
      Año: 1 / 2,
      Semestre: 1,
      Trimestre: 2,
      Bimestre: 3,
      Mensual: 6,
      Semanal: 26,
      Día: 188
    },
    Trimestre: {
      Año: 1 / 4,
      Semestre: 1 / 2,
      Trimestre: 1,
      Bimestre: 1.5,
      Mensual: 3,
      Semanal: 13,
      Día: 90
    },
    Bimestre: {
      Año: 1 / 6,
      Semestre: 1 / 3,
      Trimestre: 2 / 3,
      Bimestre: 1,
      Mensual: 2,
      Semanal: 8,
      Día: 60
    },
    Mensual: {
      Año: 1 / 12,
      Semestre: 1 / 6,
      Trimestre: 1 / 3,
      Bimestre: 1 / 2,
      Mensual: 1,
      Semanal: 4,
      Día: 30
    },
    Semanal: {
      Año: 1 / 52,
      Semestre: 1 / 26,
      Trimestre: 1 / 12,
      Bimestre: 1 / 8,
      Mensual: 1 / 4,
      Semanal: 1,
      Día: 7
    },
    Día: {
      Año: 1 / 365,
      Semestre: 1 / 188,
      Trimestre: 1 / 90,
      Bimestre: 1 / 60,
      Mensual: 1 / 30,
      Semanal: 1 / 7,
      Día: 1
    }
  };

  const [TasaECC, setTasaECC] = useState({
    interesNominal: '',
    tiempoInteres: 'Anual',
    interesCC: '',
    tiempoInteresCC: 'Anual'
  })

  // Funciones de cálculo
  // Modificar el botón de cálculo de interés para generar gráfico
  const calcularInteres = () => {
    const { capital, tasa, tiempo } = interesState;

    // Para interés compuesto, el interés es la diferencia entre el valor futuro y el capital inicial
    const valorFuturo = parseFloat(capital) * Math.pow(1 + parseFloat(tasa) / 100, parseFloat(tiempo));
    const interes = valorFuturo - parseFloat(capital);

    setInteresState(prev => ({ ...prev, interes: interes.toFixed(2) }));
    generarDatosGrafico();
  };

  const calcularTasa = () => {
    const { capital, interes, tiempo } = tasaState;

    const valorFuturo = parseFloat(capital) + parseFloat(interes);
    // Despejando la tasa de la fórmula de interés compuesto: VF = VP * (1 + r)^t
    const tasa = (Math.pow(valorFuturo / parseFloat(capital), 1 / parseFloat(tiempo)) - 1) * 100;

    setTasaState(prev => ({ ...prev, tasa: tasa.toFixed(2) }));
    generarDatosGraficoTasa();
  };

  const calcularTiempo = () => {
    const { capital, interes, tasa } = tiempoState;

    const valorFuturo = parseFloat(capital) + parseFloat(interes);
    // Despejando el tiempo de la fórmula de interés compuesto usando logaritmos
    const tiempo = Math.log(valorFuturo / parseFloat(capital)) / Math.log(1 + parseFloat(tasa) / 100);

    setTiempoState(prev => ({ ...prev, tiempo: tiempo.toFixed(2) }));
    generarDatosGraficoTiempo();
  };

  const calcularVP = () => {
    const { valorFuturo, tasa, tiempo } = vpState;

    // Fórmula de valor presente con interés compuesto
    const valorPresente = parseFloat(valorFuturo) / Math.pow(1 + parseFloat(tasa) / 100, parseFloat(tiempo));

    setVpState(prev => ({ ...prev, valorPresente: valorPresente.toFixed(2) }));
    generarDatosGraficoVP();
  };

  const calcularVF = () => {
    const { valorPresente, tasa, tiempo } = vfState;

    // Fórmula de valor futuro con interés compuesto
    const valorFuturo = parseFloat(valorPresente) * Math.pow(1 + parseFloat(tasa) / 100, parseFloat(tiempo));

    setVfState(prev => ({ ...prev, valorFuturo: valorFuturo.toFixed(2) }));
    generarDatosGraficoVF();
  };

  const calcularM = () => {
    // Obtener el factor de conversión entre las unidades
    const factorConversion = unidadesRelativas[TasaTN.tiempoUnidad][TasaTN.periodoUnidad];

    // Calcular m directamente usando el factor de conversión
    const m = (TasaTN.tiempo * factorConversion / TasaTN.PeriodoC).toFixed(2);

    // Actualizar el estado
    if (!isNaN(m) && isFinite(m)) {
      setTasaTN(prev => ({ ...prev, m }));
    }
  };

  const calcularTN = () => {
    calcularM(); // Calcula m antes de la tasa
    calcularM();
    const { interes, m } = TasaTN;
    if (interes && m > 0) {
      const TasaEfectiva = ((parseFloat(interes) / parseFloat(m))).toFixed(2);
      setTasaTN(prev => ({ ...prev, TasaEfectiva }));
    }
  };

  const calcularInteresTNE = () => {
    const { nominalRate, compoundingPeriods, presentValue } = inputs;

    const m = parseFloat(compoundingPeriods);
    const r = parseFloat(nominalRate) / 100; // Convert percentage to decimal
    const i = r / m; // Period interest rate

    // Calculate Effective Interest Rate
    const effectiveRate = Math.pow(1 + i, m) - 1;

    // Calculate Future Value
    const futureValue = parseFloat(presentValue) * Math.pow(1 + i, m);

    setInputs(prev => ({
      ...prev,
      effectiveRate: (effectiveRate * 100).toFixed(2), // Convert back to percentage
      futureValue: futureValue.toFixed(2)
    }));
  };

  const calcularTasaECC = () => {
    const { interesNominal, tiempoInteres, tiempoInteresCC } = TasaECC;

    // Convertir interesNominal a la unidad correspondiente
    let interesNominalConvertido = parseFloat(interesNominal);

    if (tiempoInteres === 'Anual' && tiempoInteresCC === 'Mensual') {
      interesNominalConvertido = interesNominalConvertido / 12; // Convertir a mensual
    } else if (tiempoInteres === 'Mensual' && tiempoInteresCC === 'Anual') {
      interesNominalConvertido = interesNominalConvertido * 12; // Convertir a anual
    }
    // Si ambos son iguales, no es necesario convertir

    // Calcular interesCC usando la fórmula de capitalización continua
    const interesCC = Math.exp(interesNominalConvertido / 100) - 1;

    // Guardar el resultado
    setTasaECC(prev => ({
      ...prev,
      interesCC: (interesCC * 100).toFixed(2), // Convertir a porcentaje
      tasaEfectiva: (interesCC * 100).toFixed(2) // Guardar también como tasa efectiva
    }));
  };

  //Graficos
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

  //Procedimineto
  const renderProcedimientoInteres = () => {
    const { capital, tasa, tiempo, interes } = interesState;
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {capital && tasa && tiempo && (
          <Typography>
            <BlockMath math={`VF = VP \\cdot (1 + r)^{t} = ${capital} \\cdot (1 + \\frac{${tasa}}{100})^{${tiempo}} = ${parseFloat(capital) * Math.pow(1 + parseFloat(tasa) / 100, parseFloat(tiempo)).toFixed(2)}`} />
            <br />
            <BlockMath math={`I = VF - VP = ${parseFloat(capital) * Math.pow(1 + parseFloat(tasa) / 100, parseFloat(tiempo)).toFixed(2)} - ${capital} = ${interes}`} />
          </Typography>
        )}
      </Box>
    );
  };

  const renderProcedimientoTaza = () => {
    const { capital, interes, tiempo, tasa } = tasaState;
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {capital && interes && tiempo && (
          <Typography>
            <BlockMath math={`r = \\left( \\left( \\frac{VF}{VP} \\right)^{\\frac{1}{t}} - 1 \\right) \\cdot 100 = \\left( \\left( \\frac{${parseFloat(capital) + parseFloat(interes)}}{${capital}} \\right)^{\\frac{1}{${tiempo}}} - 1 \\right) \\cdot 100 = ${tasa}`} />
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
            <BlockMath math={`t = \\frac{\\log(\\frac{VF}{VP})}{\\log(1 + \\frac{r}{100})} = \\frac{\\log(\\frac{${parseFloat(capital) + parseFloat(interes)}}{${capital}})}{\\log(1 + \\frac{${tasa}}{100})} = ${tiempo}`} />
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
            <BlockMath math={`VP = \\frac{VF}{(1 + r)^{t}} = \\frac{${valorFuturo}}{(1 + \\frac{${tasa}}{100})^{${tiempo}}} = ${valorPresente}`} />
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
          t = Tiempo
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
            <BlockMath math={`VF = VP \\cdot (1 + r)^{t} = ${valorPresente} \\cdot (1 + \\frac{${tasa}}{100})^{${tiempo}} = ${valorFuturo}`} />
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
          t = Tiempo
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoTN = () => {
    const { interes, m, TasaEfectiva } = TasaTN;
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {interes && m > 0 && (
          <Typography>
            <BlockMath math={`Tasa Efectiva = \\frac{Interés}{m} = \\frac{${interes}}{${m}} = ${TasaEfectiva}`} />
          </Typography>
        )}
      </Box>
    );
  };

  const renderProcedimientoInteresTNE = () => {
    const { nominalRate, compoundingPeriods, presentValue, effectiveRate, futureValue } = inputs;
    const m = parseFloat(compoundingPeriods);
    const r = parseFloat(nominalRate) / 100; // Convertir porcentaje a decimal
    const i = r / m; // Tasa de interés por período

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {nominalRate && compoundingPeriods && presentValue && (
          <Typography>
            <BlockMath math={`Tasa Efectiva = \\left(1 + \\frac{r}{m}\\right)^{m} - 1 = \\left(1 + \\frac{${nominalRate}/100}{${m}}\\right)^{${m}} - 1 = ${effectiveRate}`} />
            <br />
            <BlockMath math={`Valor Futuro = VP \\cdot \\left(1 + \\frac{r}{m}\\right)^{m} = ${presentValue} \\cdot \\left(1 + \\frac{${nominalRate}/100}{${m}}\\right)^{${m}} = ${futureValue}`} />
          </Typography>
        )}
      </Box>
    );
  };

  const renderProcedimientoTasaECC = () => {
    const { interesNominal, tiempoInteres, tiempoInteresCC, interesCC, tasaEfectiva } = TasaECC;

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {interesNominal && tiempoInteres && tiempoInteresCC && (
          <Typography>
            <BlockMath math={`Interés CC = e^{\\frac{Interés Nominal}{100}} - 1 = e^{\\frac{${interesNominal}}{100}} - 1 = ${interesCC}`} />
            <br />
            <BlockMath math={`Tasa Efectiva = Interés CC = ${tasaEfectiva}`} />
          </Typography>
        )}
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

  const renderCalculadoraTN = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Interes %"
          name="interes"
          type="number"
          value={TasaTN.interes}
          onChange={(e) => setTasaTN(prev => ({ ...prev, interes: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={TasaTN.tiempo}
          onChange={(e) => setTasaTN(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Unidad de Tiempo</InputLabel>
          <Select
            value={TasaTN.tiempoUnidad}
            onChange={(e) => setTasaTN(prev => ({ ...prev, tiempoUnidad: e.target.value }))}
          >
            <MenuItem value="Año">Año</MenuItem>
            <MenuItem value="Semestre">Semestral</MenuItem>
            <MenuItem value="Trimestre">Trimestral</MenuItem>
            <MenuItem value="Bimestre">Bimestral</MenuItem>
            <MenuItem value="Mensual">Mensual</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
            <MenuItem value="Día">Diario</MenuItem>
          </Select>

        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Periodo de Composición"
          name="PeriodoC"
          type="number"
          value={TasaTN.PeriodoC}
          onChange={(e) => setTasaTN(prev => ({ ...prev, PeriodoC: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Unidad de Composición</InputLabel>
          <Select
            value={TasaTN.periodoUnidad}
            onChange={(e) => setTasaTN(prev => ({ ...prev, periodoUnidad: e.target.value }))}
          >
            <MenuItem value="Año">Anual</MenuItem>
            <MenuItem value="Semestre">Semestral</MenuItem>
            <MenuItem value="Trimestral">Trimestral</MenuItem>
            <MenuItem value="Mensual">Mensual</MenuItem>
            <MenuItem value="Bimestral">Bimestral</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
            <MenuItem value="Día">Diario</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button variant="contained" color="primary" onClick={calcularTN} fullWidth sx={{ height: '100%' }}>
          Calcular Tasa Efectiva
        </Button>
      </Grid>
      {TasaTN.TasaEfectiva && (
        <Grid item xs={12}>
          <Alert severity="info">Tasa Efectiva: {TasaTN.TasaEfectiva}%</Alert>
        </Grid>
      )}
      {TasaTN.m && (
        <Grid item xs={12}>
          <Alert severity="info">Composición: {TasaTN.m}</Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraInteresTNE = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Tasa Nominal (%)"
          type="number"
          value={inputs.nominalRate}
          onChange={(e) => setInputs(prev => ({ ...prev, nominalRate: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Periodos de Composición (m)"
          type="number"
          value={inputs.compoundingPeriods}
          onChange={(e) => setInputs(prev => ({ ...prev, compoundingPeriods: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Valor Presente (VP)"
          type="number"
          value={inputs.presentValue}
          onChange={(e) => setInputs(prev => ({ ...prev, presentValue: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={calcularInteresTNE} fullWidth>
          Calcular
        </Button>
      </Grid>
      {inputs.effectiveRate && (
        <Grid item xs={12}>
          <Alert severity="info">Tasa Efectiva: {inputs.effectiveRate}%</Alert>
        </Grid>
      )}
      {inputs.futureValue && (
        <Grid item xs={12}>
          <Alert severity="info">Valor Futuro: ${inputs.futureValue}</Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraTasaECC = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Interés Nominal (%)"
          type="number"
          value={TasaECC.interesNominal}
          onChange={(e) => setTasaECC(prev => ({ ...prev, interesNominal: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Tiempo de Interés</InputLabel>
          <Select
            value={TasaECC.tiempoInteres}
            onChange={(e) => setTasaECC(prev => ({ ...prev, tiempoInteres: e.target.value }))}
          >
            <MenuItem value="Anual">Anual</MenuItem>
            <MenuItem value="Mensual">Mensual</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Tiempo de Capitalización Continua</InputLabel>
          <Select
            value={TasaECC.tiempoInteresCC}
            onChange={(e) => setTasaECC(prev => ({ ...prev, tiempoInteresCC: e.target.value }))}
          >
            <MenuItem value="Anual">Anual</MenuItem>
            <MenuItem value="Mensual">Mensual</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button variant="contained" color="primary" onClick={calcularTasaECC} fullWidth>
          Calcular Tasa Efectiva para Capitalización Continua
        </Button>
      </Grid>
      {TasaECC.interesCC && (
        <Grid item xs={12}>
          <Alert severity="info">Interés Efectivo para Capitalización Continua: {TasaECC.interesCC}%</Alert>
        </Grid>
      )}
    </Grid>
  );


  // Renderizado principal
  return (
    <Container maxWidth="mx" sx={{ mt: 4 ,minHeight: '100vh'}}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Calculadora de Interés Compuesto
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
          <Tab label="Valor TN" />
          <Tab label="Valor TNE" />
          <Tab label="Valor TNE Capitalisacion" />
        </Tabs>

        <Box sx={{ p: 2 }}>

          {tabValue === 0 && renderCalculadoraInteres()}
          {tabValue === 1 && renderCalculadoraTasa()}
          {tabValue === 2 && renderCalculadoraTiempo()}
          {tabValue === 3 && renderCalculadoraVP()}
          {tabValue === 4 && renderCalculadoraVF()}
          {tabValue === 5 && renderCalculadoraTN()}
          {tabValue === 6 && renderCalculadoraInteresTNE()}
          {tabValue === 7 && renderCalculadoraTasaECC()}
          {tabValue === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoInteres()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Interés Compuesto
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
                      Visualización de Tasa Compuesto
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
                      Visualización de Tasa Compuesto
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
                      Visualización de Tasa Compuesto
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
                      Visualización de Tasa Compuesto
                    </Typography>
                    {renderGraficoVF()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 5 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoTN()}
              </Grid>
            </Grid>
          )}
          {tabValue === 6 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoInteresTNE()}
              </Grid>
            </Grid>
          )}
          {tabValue === 7 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoTasaECC()}
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default InteresCompuesto;