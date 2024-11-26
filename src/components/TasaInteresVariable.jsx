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

function TasaInteresVariable() {
  // State para manejar la pestaña activa
  const [tabValue, setTabValue] = useState(0);
  const [graficoDatos, setGraficoDatos] = useState([]);

  // States para cada tipo de cálculo

  const [vpState, setVpState] = useState({
    valorPresente: '',
    tasa: '',
    tiempo: '',
    valorFuturo: ''
  });

  const [vfState, setVfState] = useState({
    valorFuturo: '',
    tasa: '',
    tiempo: '',
    valorPresente: ''
  });

  const [paState, setPaState] = useState({
    pagoPeriodico: '',
    tasa: '',
    tiempo: '',
    valorPresente: ''
  });

  const [apState, setApState] = useState({
    valorPresente: '', // Valor Presente
    tasa: '',
    tiempo: '',
    valorAnualidad: '' // Valor de la Anualidad
  });

  const [faState, setFaState] = useState({
    valorAnualidad: '', // Valor de cada Anualidad
    tasa: '',
    tiempo: '',
    valorFuturo: '' // Valor Futuro
  });

  const [afState, setAfState] = useState({
    valorFuturo: '', // Valor Futuro
    tasa: '',
    tiempo: '',
    valorAnualidad: '' // Valor de la Anualidad
  });

  const [pgState, setPgState] = useState({
    valorGradiente: '', // Valor del Gradiente
    tasa: '',
    tiempo: '',
    valorPresente: '' // Valor Presente
  });

  const [agState, setAgState] = useState({
    valorGradiente: '', // Valor del Gradiente
    tasa: '',
    tiempo: '',
    valorAnualidad: '' // Valor de la Anualidad
  });

  const [cfState, setCfState] = useState({
    cantidadBase: '', // Cantidad base
    n: '', // Número de años
    flujoCaja: '', // CFn
    gradiente: '' // G
  });

  // Funciones de cálculo
  // Modificar el botón de cálculo de interés para generar gráfico
  const calcularVP = () => {
    const { valorFuturo, tasa, tiempo } = vfState;
    if (valorFuturo && tasa && tiempo) {
      const valorPresente = parseFloat(valorFuturo) / Math.pow((1 + parseFloat(tasa) / 100), parseFloat(tiempo));
      setVfState(prev => ({ ...prev, valorPresente: valorPresente.toFixed(2) }));

      generarDatosGraficoVP();
    }
  };

  const calcularVF = () => {
    const { valorPresente, tasa, tiempo } = vpState;
    if (valorPresente && tasa && tiempo) {
      const valorFuturo = parseFloat(valorPresente) * Math.pow((1 + parseFloat(tasa) / 100), parseFloat(tiempo));
      setVpState(prev => ({ ...prev, valorFuturo: valorFuturo.toFixed(2) }));

      generarDatosGraficoVF();
    }
  };

  const calcularVP_PA = () => {
    const { pagoPeriodico, tasa, tiempo } = paState;

    if (pagoPeriodico && tasa && tiempo) {
      const tasaDecimal = parseFloat(tasa) / 100;
      const n = parseFloat(tiempo);

      // Fórmula P/A: VP = VA * [((1+i)^n - 1) / (i(1+i)^n)]
      const valorPresente = parseFloat(pagoPeriodico) *
        (Math.pow(1 + tasaDecimal, n) - 1) /
        (tasaDecimal * Math.pow(1 + tasaDecimal, n));

      setPaState(prev => ({ ...prev, valorPresente: valorPresente.toFixed(2) }));
      generarDatosGraficoPA();
    }
  };

  const calcularVA_AP = () => {
    const { valorPresente, tasa, tiempo } = apState;

    if (valorPresente && tasa && tiempo) {
      const tasaDecimal = parseFloat(tasa) / 100;
      const n = parseFloat(tiempo);

      // Fórmula A/P: VA = VP * [i(1+i)^n / ((1+i)^n - 1)]
      const valorAnualidad = parseFloat(valorPresente) *
        (tasaDecimal * Math.pow(1 + tasaDecimal, n)) /
        (Math.pow(1 + tasaDecimal, n) - 1);

      setApState(prev => ({ ...prev, valorAnualidad: valorAnualidad.toFixed(2) }));
      generarDatosGraficoAP();
    }
  };

  const calcularVF_FA = () => {
    const { valorAnualidad, tasa, tiempo } = faState;

    if (valorAnualidad && tasa && tiempo) {
      const tasaDecimal = parseFloat(tasa) / 100;
      const n = parseFloat(tiempo);

      // Fórmula F/A: VF = VA * [((1+i)^n - 1) / i]
      const valorFuturo = parseFloat(valorAnualidad) *
        (Math.pow(1 + tasaDecimal, n) - 1) /
        tasaDecimal;

      setFaState(prev => ({ ...prev, valorFuturo: valorFuturo.toFixed(2) }));
      generarDatosGraficoFA();
    }
  };

  const calcularVA_AF = () => {
    const { valorFuturo, tasa, tiempo } = afState;

    if (valorFuturo && tasa && tiempo) {
      const tasaDecimal = parseFloat(tasa) / 100;
      const n = parseFloat(tiempo);

      // Fórmula A/F: VA = VF * [i / ((1+i)^n - 1)]
      const valorAnualidad = parseFloat(valorFuturo) *
        (tasaDecimal / (Math.pow(1 + tasaDecimal, n) - 1));

      setAfState(prev => ({ ...prev, valorAnualidad: valorAnualidad.toFixed(2) }));
      generarDatosGraficoAF();
    }
  };

  const calcularVP_PG = () => {
    const { valorGradiente, tasa, tiempo } = pgState;

    if (valorGradiente && tasa && tiempo) {
      const tasaDecimal = parseFloat(tasa) / 100;
      const n = parseFloat(tiempo);

      // Fórmula P/G: VP = G * [((1+i)^n - i*n - 1) / (i^2 * (1+i)^n)]
      const valorPresente = parseFloat(valorGradiente) *
        ((Math.pow(1 + tasaDecimal, n) - tasaDecimal * n - 1) /
          (Math.pow(tasaDecimal, 2) * Math.pow(1 + tasaDecimal, n)));

      setPgState(prev => ({ ...prev, valorPresente: valorPresente.toFixed(2) }));
      generarDatosGraficoPG();
    }
  };

  const calcularVA_AG = () => {
    const { valorGradiente, tasa, tiempo } = agState;
    
    if (valorGradiente && tasa && tiempo) {
      const tasaDecimal = parseFloat(tasa) / 100;
      const n = parseFloat(tiempo);
      
      // Fórmula A/G: VA = G * [(1/i) - (n/((1+i)^n - 1))]
      const valorAnualidad = parseFloat(valorGradiente) * 
        ((1 / tasaDecimal) - 
         (n / (Math.pow(1 + tasaDecimal, n) - 1)));
      
      setAgState(prev => ({ ...prev, valorAnualidad: valorAnualidad.toFixed(2) }));
      generarDatosGraficoAG();
    }
  };

  const calcularCF_G = () => {
    const { cantidadBase, n, flujoCaja, gradiente } = cfState;
    const cantidadBaseNum = parseFloat(cantidadBase);
    const nNum = parseInt(n, 10);
    
    if (cantidadBase && n && gradiente) {
      // Calcular el flujo de caja en el año n
      const flujoCaja = cantidadBaseNum + (nNum - 1) * parseFloat(gradiente);
      setCfState(prev => ({
        ...prev,
        flujoCaja: flujoCaja.toFixed(2),
      }));
    } else if (cantidadBase && n && flujoCaja) {
      // Calcular el gradiente G
      const gradiente = (parseFloat(flujoCaja) - cantidadBaseNum) / (nNum - 1);
      setCfState(prev => ({
        ...prev,
        gradiente: gradiente.toFixed(2),
      }));
    } else {
      alert("Por favor ingrese Cantidad Base, Número de Años y uno de los siguientes: Flujo de Caja o Gradiente.");
    }
  };

  //graficos
  const renderGraficoVP = () => (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={graficoDatos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <BarChart data={graficoDatos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
          <YAxis label={{ value: 'Valor Futuro', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [value.toFixed(2), 'Valor Futuro']} />
          <Legend />
          <Bar dataKey="valorFuturo" name="Valor Futuro" fill="#1F51FF" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderGraficoPA = () => {
    const { pagoPeriodico, tiempo, valorPresente } = paState;
    const datosGrafico = [];

    // Agregar el primer periodo con el valor presente inicial
    datosGrafico.push({
      periodo: 0,
      valor: parseFloat(valorPresente),
      tipo: 'Valor Presente'
    });

    // Agregar los periodos intermedios con el valor del pago periódico
    for (let periodo = 1; periodo <= tiempo; periodo++) {
      datosGrafico.push({
        periodo: periodo,
        valor: parseFloat(pagoPeriodico),
        tipo: 'Valor Anual'
      });
    }

    return (
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
            <YAxis label={{ value: 'Valor', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name) => [value, datosGrafico.find(d => d.valor === value)?.tipo || name]} />
            <Legend />
            <Bar dataKey="valor" name="Valor" fill="#1F51FF" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderGraficoAP = () => {
    const { valorPresente, tiempo, valorAnualidad } = apState;
    const datosGrafico = [];

    // Agregar el primer periodo con el valor presente
    datosGrafico.push({
      periodo: 0,
      valorAnualidad: parseFloat(valorPresente)
    });

    // Agregar los periodos intermedios con el valor de la anualidad
    for (let periodo = 1; periodo < tiempo; periodo++) {
      datosGrafico.push({
        periodo: periodo,
        valorAnualidad: parseFloat(valorAnualidad)
      });
    }

    // Agregar el último periodo
    datosGrafico.push({
      periodo: tiempo,
      valorAnualidad: parseFloat(valorAnualidad)
    });

    return (
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
            <YAxis label={{ value: 'Valor de Anualidad', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [value.toFixed(2), 'Valor Anualidad']} />
            <Legend />
            <Bar dataKey="valorAnualidad" name="Valor Anualidad" fill="#1F51FF" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderGraficoFA = () => {
    const { valorAnualidad, tiempo, valorFuturo } = faState;
    const datosGrafico = []; // Agregar el primer periodo con valor anualidad 
    datosGrafico.push({ periodo: 0, valor: 0, tipo: 'Valor Anual' });
    // Agregar los periodos intermedios con valor anualidad 
    for (let periodo = 1; periodo <= tiempo; periodo++) {
      datosGrafico.push({ periodo: periodo, valor: parseFloat(valorAnualidad), tipo: 'Valor Anual' });
    } // Agregar el último periodo con el valor futuro total
    datosGrafico[datosGrafico.length - 1].valor = parseFloat(valorFuturo);
    datosGrafico[datosGrafico.length - 1].tipo = 'Valor Futuro';
    return (
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
            <YAxis label={{ value: 'Valor', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name, props) => [value.toFixed(2), props.payload.tipo]} />
            <Legend />
            <Bar dataKey="valor" name="Valor" fill="#1F51FF" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderGraficoAF = () => {
    const { valorFuturo, tiempo, valorAnualidad } = afState;
    const datosGrafico = []; // Agregar el primer periodo con valor anualidad 
    datosGrafico.push({ periodo: 0, valor: 0, tipo: 'Valor Anual' }); // Agregar los periodos intermedios con valor anualidad 
    for (let periodo = 1; periodo < tiempo; periodo++) {
      datosGrafico.push({ periodo: periodo, valor: parseFloat(valorAnualidad), tipo: 'Valor Anual' });
    }
    // Agregar el último periodo con el valor futuro total 
    datosGrafico.push({ periodo: tiempo, valor: parseFloat(valorFuturo), tipo: 'Valor Futuro' });
    return (
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
            <YAxis label={{ value: 'Valor', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name, props) => [value.toFixed(2), props.payload.tipo]} />
            <Legend />
            <Bar dataKey="valor" name="Valor" fill="#1F51FF" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderGraficoPG = () => {
    const { valorGradiente, tiempo, valorPresente, tasa } = pgState;
    const datosGrafico = [];
  
    // Agregar el primer periodo con el valor presente inicial
    datosGrafico.push({
      periodo: 0,
      valor: parseFloat(valorPresente),
      tipo: 'Valor Presente'
    });
  
    // Agregar los periodos intermedios con el valor del gradiente
    for (let periodo = 1; periodo <= tiempo; periodo++) {
      const valorAcumulado = parseFloat(valorGradiente) * periodo;
      const valorDescuentoActual = valorAcumulado / Math.pow(1 + (parseFloat(tasa) / 100), periodo);
      datosGrafico.push({
        periodo: periodo,
        valor: valorDescuentoActual,
        tipo: 'Valor Gradiente'
      });
    }
  
    // Agregar el último periodo con el valor futuro total
    datosGrafico.push({
      periodo: tiempo + 1,
      valor: parseFloat(valorPresente) + datosGrafico.reduce((acc, curr) => acc + curr.valor, 0),
      tipo: 'Valor Futuro'
    });
  
    return (
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
            <YAxis label={{ value: 'Valor', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name, props) => [value.toFixed(2), props.payload.tipo]} />
            <Legend />
            <Line type="monotone" dataKey="valor" name="Valor" stroke="#1F51FF" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderGraficoAG = () => {
    const { valorGradiente, tiempo, valorAnualidad, tasa } = agState;
    const datosGrafico = [];
    
    // Agregar el primer periodo con el valor anualidad inicial
    datosGrafico.push({
      periodo: 0,
      valor: parseFloat(valorAnualidad),
      tipo: 'Valor Anual'
    });
  
    // Agregar los periodos intermedios con el valor de la anualidad y gradiente
    let valorAcumulado = 0;
    for (let periodo = 1; periodo <= tiempo; periodo++) {
      valorAcumulado += parseFloat(valorGradiente) * periodo;
      const valorAnualidadPeriodo = parseFloat(valorAnualidad) + (valorAcumulado / Math.pow(1 + (parseFloat(tasa) / 100), periodo));
  
      datosGrafico.push({
        periodo: periodo,
        valor: valorAnualidadPeriodo,
        tipo: 'Valor Anual'
      });
    }
  
    return (
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" label={{ value: 'Periodo', position: 'insideBottomRight', offset: 0 }} />
            <YAxis label={{ value: 'Valor Anualidad', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name, props) => [value.toFixed(2), props.payload.tipo]} />
            <Legend />
            <Line type="monotone" dataKey="valor" name="Valor Anualidad" stroke="#1F51FF" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  //procedimientos
  const renderProcedimientoVP = () => {
    const { valorFuturo, tasa, tiempo, valorPresente } = vfState;

    // Calcular el factor de integración
    const r = parseFloat(tasa) / 100;
    const n = parseFloat(tiempo);
    const factorIntegracion = n > 0 ? (1 / Math.pow((1 + r), n)).toFixed(4) : 1;

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorFuturo && tasa && tiempo && (
          <Typography>
            <BlockMath math={`VP = VF \\left( \\frac{1}{(1 + r)^n} \\right) = ${valorFuturo} \\left( \\frac{1}{(1 + ${tasa}/100)^{${tiempo}}} \\right) = ${valorPresente}`} />
            <br />
            <Typography variant="h8" sx={{ mt: 2 }}>
              Factor de Integración: {factorIntegracion}
            </Typography>
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
    const { valorPresente, tasa, tiempo, valorFuturo } = vpState;
    // Calcular el factor de integración 
    const r = parseFloat(tasa) / 100;
    const n = parseFloat(tiempo);
    const factorIntegracion = n > 0 ? Math.pow((1 + r), n).toFixed(4) : 1; // Si n es 0, el factor de integración es 1 
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorPresente && tasa && tiempo && (
          <Typography>
            <BlockMath math={`VF = VP(1 + r)^n`} />
            <BlockMath math={`${valorPresente}(1 + ${tasa}/100)^{${tiempo}} = ${valorFuturo}`} />
            <br />
            <Typography variant="h7" sx={{ mt: 2 }}> Factor de Integración:
              {factorIntegracion}
            </Typography>
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}
        >
          Donde: <br /> VF = Valor Futuro <br /> VP = Valor Presente <br /> r = Tasa de interés <br /> n = Número de periodos
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoPA = () => {
    const { pagoPeriodico, tasa, tiempo, valorPresente } = paState;
    const tasaDecimal = parseFloat(tasa) / 100;
    const n = parseFloat(tiempo);

    // Calcular el factor de integración
    const factorIntegracion = ((Math.pow(1 + tasaDecimal, n) - 1) / (tasaDecimal * Math.pow(1 + tasaDecimal, n))).toFixed(2);

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {pagoPeriodico && tasa && tiempo && (
          <Typography>
            <BlockMath
              math={`VP = VA * \\frac{(1+i)^n - 1}{i(1+i)^n} = ${pagoPeriodico} * \\frac{(1+${tasa}/100)^{${tiempo}} - 1}{(${tasa}/100)(1+${tasa}/100)^{${tiempo}}} = ${valorPresente}`}
            />
            <br />
            <Typography variant="h7">
              Factor de Integración: {factorIntegracion}
            </Typography>
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Donde:
          <br />
          VP = Valor Presente
          <br />
          VA = Valor de cada Anualidad
          <br />
          i = Tasa de interés
          <br />
          n = Número de periodos
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoAP = () => {
    const { valorPresente, tasa, tiempo, valorAnualidad } = apState;
    const tasaDecimal = parseFloat(tasa) / 100;
    const n = parseFloat(tiempo);

    // Calcular el factor de recuperación de capital
    const factorRecuperacion = ((tasaDecimal * Math.pow(1 + tasaDecimal, n)) /
      (Math.pow(1 + tasaDecimal, n) - 1)).toFixed(2);

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorPresente && tasa && tiempo && (
          <Typography>
            <BlockMath
              math={`VA = VP * \\frac{i(1+i)^n}{(1+i)^n - 1} = ${valorPresente} * \\frac{(${tasa}/100)(1+${tasa}/100)^{${tiempo}}}{(1+${tasa}/100)^{${tiempo}} - 1} = ${valorAnualidad}`}
            />
            <br />
            <Typography variant="h7">
              Factor de Recuperación de Capital: {factorRecuperacion}
            </Typography>
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Donde:
          <br />
          VA = Valor de la Anualidad
          <br />
          VP = Valor Presente
          <br />
          i = Tasa de interés
          <br />
          n = Número de periodos
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoFA = () => {
    const { valorAnualidad, tasa, tiempo, valorFuturo } = faState;
    const tasaDecimal = parseFloat(tasa) / 100;
    const n = parseFloat(tiempo);

    // Calcular el factor de acumulación
    const factorAcumulacion = ((Math.pow(1 + tasaDecimal, n) - 1) / tasaDecimal).toFixed(2);

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorAnualidad && tasa && tiempo && (
          <Typography>
            <BlockMath
              math={`VF = VA * \\frac{(1+i)^n - 1}{i} = ${valorAnualidad} * \\frac{(1+${tasa}/100)^{${tiempo}} - 1}{${tasa}/100} = ${valorFuturo}`}
            />
            <br />
            <Typography variant="body2">
              Factor de Acumulación: {factorAcumulacion}
            </Typography>
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Donde:
          <br />
          VF = Valor Futuro
          <br />
          VA = Valor de cada Anualidad
          <br />
          i = Tasa de interés
          <br />
          n = Número de periodos
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoAF = () => {
    const { valorFuturo, tasa, tiempo, valorAnualidad } = afState;
    const tasaDecimal = parseFloat(tasa) / 100;
    const n = parseFloat(tiempo);

    // Calcular el factor de recuperación de capital
    const factorRecuperacion = (tasaDecimal / (Math.pow(1 + tasaDecimal, n) - 1)).toFixed(2);

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorFuturo && tasa && tiempo && (
          <Typography>
            <BlockMath
              math={`VA = VF * \\frac{i}{(1+i)^n - 1} = ${valorFuturo} * \\frac{${tasa}/100}{(1+${tasa}/100)^{${tiempo}} - 1} = ${valorAnualidad}`}
            />
            <br />
            <Typography variant="body2">
              Factor de Recuperación de Capital: {factorRecuperacion}
            </Typography>
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Donde:
          <br />
          VA = Valor de la Anualidad
          <br />
          VF = Valor Futuro
          <br />
          i = Tasa de interés
          <br />
          n = Número de periodos
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoPG = () => {
    const { valorGradiente, tasa, tiempo, valorPresente } = pgState;
    const tasaDecimal = parseFloat(tasa) / 100;
    const n = parseFloat(tiempo);

    // Calcular el factor de valor presente para gradiente
    const factorVP = ((Math.pow(1 + tasaDecimal, n) - tasaDecimal * n - 1) /
      (Math.pow(tasaDecimal, 2) * Math.pow(1 + tasaDecimal, n))).toFixed(2);

    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorGradiente && tasa && tiempo && (
          <Typography>
            <BlockMath
              math={`VP = G * \\frac{(1+i)^n - i*n - 1}{i^2 * (1+i)^n} = ${valorGradiente} * \\frac{(1+${tasa}/100)^{${tiempo}} - ${tasa}/100 * ${tiempo} - 1}{(${tasa}/100)^2 * (1+${tasa}/100)^{${tiempo}}} = ${valorPresente}`}
            />
            <br />
            <Typography variant="body2">
              Factor de Valor Presente para Gradiente: {factorVP}
            </Typography>
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Donde:
          <br />
          VP = Valor Presente
          <br />
          G = Valor del Gradiente
          <br />
          i = Tasa de interés
          <br />
          n = Número de periodos
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoAG = () => {
    const { valorGradiente, tasa, tiempo, valorAnualidad } = agState;
    const tasaDecimal = parseFloat(tasa) / 100;
    const n = parseFloat(tiempo);
    
    // Calcular el factor de anualidad para gradiente
    const factorAnualidad = ((1 / tasaDecimal) - 
      (n / (Math.pow(1 + tasaDecimal, n) - 1))).toFixed(2);
  
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Procedimiento:</Typography>
        {valorGradiente && tasa && tiempo && (
          <Typography>
            <BlockMath 
              math={`VA = G * \\left(\\frac{1}{i} - \\frac{n}{(1+i)^n - 1}\\right) = ${valorGradiente} * \\left(\\frac{1}{${tasa}/100} - \\frac{${tiempo}}{(1+${tasa}/100)^{${tiempo}} - 1}\\right) = ${valorAnualidad}`} 
            />
            <br />
            <Typography variant="body2">
              Factor de Anualidad para Gradiente: {factorAnualidad}
            </Typography>
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Donde:
          <br />
          VA = Valor de la Anualidad
          <br />
          G = Valor del Gradiente
          <br />
          i = Tasa de interés
          <br />
          n = Número de periodos
        </Typography>
      </Box>
    );
  };

  const renderProcedimientoCF_G = () => {
    const { cantidadBase, n, flujoCaja, gradiente } = cfState;
  
    return (
      <Box sx={{ padding: 2, mt: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h6">Procedimiento Matemático</Typography>
        
        {cantidadBase && n && (flujoCaja || gradiente) && (
          <>
            {flujoCaja && (
              <>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <BlockMath 
                    math={`\\text{1. Fórmula de Flujo de Caja (CFn):} \\\\ 
                    CFn = \\text{Cantidad Base} + (n-1) \\cdot G`} 
                  />
                  
                  <BlockMath 
                    math={`\\text{Sustituyendo valores:} \\\\ 
                    CFn = ${cantidadBase} + (${n}-1) \\cdot ${gradiente} = ${flujoCaja}`} 
                  />
                </Typography>
              </>
            )}
            
            {gradiente && (
              <>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <BlockMath 
                    math={`\\text{2. Fórmula de Gradiente (G):} \\\\ 
                    G = \\frac{CFn - \\text{Cantidad Base}}{n-1}`} 
                  />
                  
                  <BlockMath 
                    math={`\\text{Sustituyendo valores:} \\\\ 
                    G = \\frac{${flujoCaja} - ${cantidadBase}}{${n}-1} = ${gradiente}`} 
                  />
                </Typography>
              </>
            )}
            
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Donde:
              <br />
              CFn = Flujo de Caja en el año n
              <br />
              G = Gradiente
              <br />
              n = Número de años
            </Typography>
          </>
        )}
        
        {(!cantidadBase || !n || (!flujoCaja && !gradiente)) && (
          <Alert severity="warning">
            Ingrese Cantidad Base, Número de Años y uno de los siguientes: Flujo de Caja o Gradiente para ver el procedimiento
          </Alert>
        )}
      </Box>
    );
  };
  
  // Función para generar datos del gráfico
  const generarDatosGraficoVP = () => {
    const { valorFuturo, tasa, tiempo } = vfState;

    if (!valorFuturo || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const valorFuturoNum = parseFloat(valorFuturo);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);

    // Calcular los valores presentes
    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      const valorPresente = valorFuturoNum / Math.pow((1 + tasaNum / 100), periodo);
      datosGrafico.push({
        periodo: periodo,
        valorPresente: valorPresente
      });
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoVF = () => {
    const { valorPresente, tasa, tiempo } = vpState;

    if (!valorPresente || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const valorPresenteNum = parseFloat(valorPresente);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);

    // Calcular los valores futuros
    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      const valorFuturo = valorPresenteNum * Math.pow((1 + tasaNum / 100), periodo);
      datosGrafico.push({
        periodo: periodo,
        valorFuturo: valorFuturo
      });
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoPA = () => {
    const { pagoPeriodico, tasa, tiempo } = paState;

    if (!pagoPeriodico || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const pagoPeriodicoNum = parseFloat(pagoPeriodico);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);
    const tasaDecimal = tasaNum / 100;

    // Calcular el valor presente acumulado en cada periodo
    let valorAcumulado = 0;
    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      if (periodo === 0) {
        // Valor inicial (antes del primer pago)
        datosGrafico.push({
          periodo: 0,
          valorPresente: 0
        });
      } else {
        // Calcular valor presente acumulado
        valorAcumulado += pagoPeriodicoNum / Math.pow(1 + tasaDecimal, periodo);
        datosGrafico.push({
          periodo: periodo,
          valorPresente: valorAcumulado
        });
      }
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoAP = () => {
    const { valorPresente, tasa, tiempo, valorAnualidad } = apState;

    if (!valorPresente || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const valorPresenteNum = parseFloat(valorPresente);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);
    const tasaDecimal = tasaNum / 100;
    const valorAnualidadNum = parseFloat(valorAnualidad);

    // Calcular el valor de cada periodo
    let saldoRestante = valorPresenteNum;
    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      if (periodo === 0) {
        // Valor inicial (saldo inicial)
        datosGrafico.push({
          periodo: 0,
          valorAnualidad: saldoRestante
        });
      } else {
        // Calcular intereses y amortización
        const intereses = saldoRestante * tasaDecimal;
        const amortizacion = valorAnualidadNum - intereses;
        saldoRestante -= amortizacion;

        datosGrafico.push({
          periodo: periodo,
          valorAnualidad: valorAnualidadNum
        });
      }
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoFA = () => {
    const { valorAnualidad, tasa, tiempo, valorFuturo } = faState;

    if (!valorAnualidad || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const valorAnualidadNum = parseFloat(valorAnualidad);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);
    const tasaDecimal = tasaNum / 100;

    // Calcular el valor acumulado en cada periodo
    let valorAcumulado = 0;
    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      if (periodo === 0) {
        // Valor inicial
        datosGrafico.push({
          periodo: 0,
          valorFuturo: 0
        });
      } else {
        // Calcular valor futuro acumulado
        valorAcumulado += valorAnualidadNum * Math.pow(1 + tasaDecimal, tiempoNum - periodo);
        datosGrafico.push({
          periodo: periodo,
          valorFuturo: valorAcumulado
        });
      }
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoAF = () => {
    const { valorFuturo, tasa, tiempo, valorAnualidad } = afState;

    if (!valorFuturo || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const valorFuturoNum = parseFloat(valorFuturo);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);
    const tasaDecimal = tasaNum / 100;
    const valorAnualidadNum = parseFloat(valorAnualidad);

    // Calcular el valor de cada periodo
    let saldoRestante = valorFuturoNum;
    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      if (periodo === 0) {
        // Valor inicial (saldo inicial)
        datosGrafico.push({
          periodo: 0,
          valorAnualidad: 0
        });
      } else {
        // Calcular el valor de la anualidad
        datosGrafico.push({
          periodo: periodo,
          valorAnualidad: valorAnualidadNum
        });
      }
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoPG = () => {
    const { valorGradiente, tasa, tiempo, valorPresente } = pgState;

    if (!valorGradiente || !tasa || !tiempo) {
      return;
    }

    const datosGrafico = [];
    const valorGradienteNum = parseFloat(valorGradiente);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);
    const tasaDecimal = tasaNum / 100;
    const valorPresenteNum = parseFloat(valorPresente);

    // Calcular el valor acumulado en cada periodo
    let valorAcumulado = 0;
    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      if (periodo === 0) {
        // Valor inicial
        datosGrafico.push({
          periodo: 0,
          valorPresente: 0
        });
      } else {
        // Calcular valor presente acumulado con gradiente
        valorAcumulado += valorGradienteNum * periodo;
        const valorDescuentoActual = valorAcumulado / Math.pow(1 + tasaDecimal, periodo);

        datosGrafico.push({
          periodo: periodo,
          valorPresente: valorDescuentoActual
        });
      }
    }

    setGraficoDatos(datosGrafico);
  };

  const generarDatosGraficoAG = () => {
    const { valorGradiente, tasa, tiempo, valorAnualidad } = agState;
  
    if (!valorGradiente || !tasa || !tiempo) {
      return;
    }
  
    const datosGrafico = [];
    const valorGradienteNum = parseFloat(valorGradiente);
    const tasaNum = parseFloat(tasa);
    const tiempoNum = parseFloat(tiempo);
    const tasaDecimal = tasaNum / 100;
    const valorAnualidadNum = parseFloat(valorAnualidad);
  
    // Calcular el valor acumulado en cada periodo
    let valorAcumulado = 0;
    for (let periodo = 0; periodo <= tiempoNum; periodo++) {
      if (periodo === 0) {
        // Valor inicial
        datosGrafico.push({
          periodo: 0,
          valorAnualidad: 0
        });
      } else {
        // Calcular valor de anualidad con gradiente
        valorAcumulado += valorGradienteNum * periodo;
        const valorAnualidadPeriodo = valorAnualidadNum + (valorAcumulado / Math.pow(1 + tasaDecimal, periodo));
        
        datosGrafico.push({
          periodo: periodo,
          valorAnualidad: valorAnualidadPeriodo
        });
      }
    }
  
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
  const renderCalculadoraVP = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Valor Futuro"
          name="valorFuturo"
          type="number"
          value={vfState.valorFuturo}
          onChange={(e) => setVfState(prev => ({ ...prev, valorFuturo: e.target.value }))}
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
          onClick={calcularVP}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VP
        </Button>
      </Grid>
      {vfState.valorPresente && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor Presente: {vfState.valorPresente}
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
          value={vpState.valorPresente}
          onChange={(e) => setVpState(prev => ({ ...prev, valorPresente: e.target.value }))}
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
          onClick={calcularVF}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VF
        </Button>
      </Grid>
      {vpState.valorFuturo && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor Futuro: {vpState.valorFuturo}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraPA = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Pago Periódico"
          name="pagoPeriodico"
          type="number"
          value={paState.pagoPeriodico}
          onChange={(e) => setPaState(prev => ({ ...prev, pagoPeriodico: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={paState.tasa}
          onChange={(e) => setPaState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={paState.tiempo}
          onChange={(e) => setPaState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularVP_PA}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VP
        </Button>
      </Grid>
      {paState.valorPresente && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor Presente: {paState.valorPresente}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraAP = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Valor Presente"
          name="valorPresente"
          type="number"
          value={apState.valorPresente}
          onChange={(e) => setApState(prev => ({ ...prev, valorPresente: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={apState.tasa}
          onChange={(e) => setApState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={apState.tiempo}
          onChange={(e) => setApState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularVA_AP}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VA
        </Button>
      </Grid>
      {apState.valorAnualidad && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor de la Anualidad: {apState.valorAnualidad}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraFA = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Valor Anualidad"
          name="valorAnualidad"
          type="number"
          value={faState.valorAnualidad}
          onChange={(e) => setFaState(prev => ({ ...prev, valorAnualidad: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={faState.tasa}
          onChange={(e) => setFaState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={faState.tiempo}
          onChange={(e) => setFaState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularVF_FA}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VF
        </Button>
      </Grid>
      {faState.valorFuturo && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor Futuro: {faState.valorFuturo}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraAF = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Valor Futuro"
          name="valorFuturo"
          type="number"
          value={afState.valorFuturo}
          onChange={(e) => setAfState(prev => ({ ...prev, valorFuturo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={afState.tasa}
          onChange={(e) => setAfState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={afState.tiempo}
          onChange={(e) => setAfState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularVA_AF}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VA
        </Button>
      </Grid>
      {afState.valorAnualidad && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor de la Anualidad: {afState.valorAnualidad}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraPG = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Valor Gradiente"
          name="valorGradiente"
          type="number"
          value={pgState.valorGradiente}
          onChange={(e) => setPgState(prev => ({ ...prev, valorGradiente: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={pgState.tasa}
          onChange={(e) => setPgState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={pgState.tiempo}
          onChange={(e) => setPgState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularVP_PG}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VP
        </Button>
      </Grid>
      {pgState.valorPresente && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor Presente: {pgState.valorPresente}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraAG = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Valor Gradiente"
          name="valorGradiente"
          type="number"
          value={agState.valorGradiente}
          onChange={(e) => setAgState(prev => ({ ...prev, valorGradiente: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tasa (%)"
          name="tasa"
          type="number"
          value={agState.tasa}
          onChange={(e) => setAgState(prev => ({ ...prev, tasa: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Tiempo"
          name="tiempo"
          type="number"
          value={agState.tiempo}
          onChange={(e) => setAgState(prev => ({ ...prev, tiempo: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularVA_AG}
          fullWidth
          sx={{ height: '100%' }}
        >
          Calcular VA
        </Button>
      </Grid>
      {agState.valorAnualidad && (
        <Grid item xs={12}>
          <Alert severity="info">
            Valor de la Anualidad: {agState.valorAnualidad}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderCalculadoraCF_G = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Cantidad Base"
          name="cantidadBase"
          type="number"
          value={cfState.cantidadBase}
          onChange={(e) => setCfState(prev => ({ ...prev, cantidadBase: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Número de Años (n)"
          name="n"
          type="number"
          value={cfState.n}
          onChange={(e) => setCfState(prev => ({ ...prev, n: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Flujo de Caja (CFn)"
          name="flujoCaja"
          type="number"
          value={cfState.flujoCaja}
          onChange={(e) => setCfState(prev => ({ ...prev, flujoCaja: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Gradiente (G)"
          name="gradiente"
          type="number"
          value={cfState.gradiente}
          onChange={(e) => setCfState(prev => ({ ...prev, gradiente: e.target.value }))}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={calcularCF_G}
          fullWidth
        >
          Calcular CFn y G
        </Button>
      </Grid>
      {cfState.flujoCaja && (
        <Grid item xs={12}>
          <Alert severity="info">
            Flujo de Caja en el año n (CFn): {cfState.flujoCaja}
          </Alert>
        </Grid>
      )}
      {cfState.gradiente && (
        <Grid item xs={12}>
          <Alert severity="info">
            Gradiente (G): {cfState.gradiente}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
  
  // Renderizado principal
  return (
    <Container maxWidth="mx" sx={{ mt: 4 ,minHeight: '100vh'}}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Calculadora de Series Uniformes
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Valor Presente" />
          <Tab label="Valor Futuro" />
          <Tab label="Valor Presente Anual" />
          <Tab label="Pago Periodico" />
          <Tab label="Pago Periodico Anual" />
          <Tab label="Valor Anual Futuro" />
          <Tab label="Valor Presente Gradiente" />
          <Tab label="Valor Anual Gradiente" />
          <Tab label="Valor Gradiente " />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {tabValue === 0 && renderCalculadoraVP()}
          {tabValue === 1 && renderCalculadoraVF()}
          {tabValue === 2 && renderCalculadoraPA()}
          {tabValue === 3 && renderCalculadoraAP()}
          {tabValue === 4 && renderCalculadoraFA()}
          {tabValue === 5 && renderCalculadoraAF()}
          {tabValue === 6 && renderCalculadoraPG()}
          {tabValue === 7 && renderCalculadoraAG()}
          {tabValue === 8 && renderCalculadoraCF_G()}
          {tabValue === 0 && (
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
          {tabValue === 1 && (
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
          {tabValue === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoPA()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Valor Presente Anual
                    </Typography>
                    {renderGraficoPA()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoAP()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Anualidad
                    </Typography>
                    {renderGraficoAP()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 4 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoFA()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Futura Anual
                    </Typography>
                    {renderGraficoFA()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 5 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoAF()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Anualidad Futura
                    </Typography>
                    {renderGraficoAF()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 6 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoPG()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Tasa Presente Gradiente
                    </Typography>
                    {renderGraficoPG()}
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valor Gradiente (%)"
                  name="valorGradiente"
                  type="number"
                  value={pgState.valorGradiente}
                />
              </Grid>
            </Grid>
          )}
          {tabValue === 7 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoAG()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Tasa Anual Gradiente
                    </Typography>
                    {renderGraficoAG()}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          {tabValue === 8 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderProcedimientoCF_G()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {graficoDatos.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualización de Tasa Compuesta Gradiente
                    </Typography>
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

export default TasaInteresVariable;