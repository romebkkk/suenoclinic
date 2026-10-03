/**
 * SueñoClinic - Motor clínico de evaluación del sueño y detección de Apnea Obstructiva del Sueño (AOS).
 * Basado en:
 * - Escala STOP-Bang (Chung F et al., Anesthesiology 2008 / British Journal of Anaesthesia 2012)
 * - Escala de Somnolencia Diurna de Epworth (ESS, Johns MW, Sleep 1991)
 * - Directrices de Higiene del Sueño y TCC-I (American Academy of Sleep Medicine, AASM)
 * 
 * 100% In-Browser, privado y sin dependencias.
 * Copyright (c) 2026 DataFlow Elegance — Ismael Ben Kazem
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SuenoClinic = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SuenoClinic = {};

  /**
   * Situaciones de la Escala de Somnolencia de Epworth (ESS)
   */
  SuenoClinic.EPWORTH_SITUATIONS = [
    { id: 'reading', text: 'Sentado leyendo un libro o periódico' },
    { id: 'tv', text: 'Viendo la televisión' },
    { id: 'public_place', text: 'Sentado inactivo en un lugar público (cine, teatro, reunión)' },
    { id: 'car_passenger', text: 'Como pasajero en un coche durante una hora continua sin paradas' },
    { id: 'lying_down', text: 'Tumbado descansando por la tarde cuando las circunstancias lo permiten' },
    { id: 'talking', text: 'Sentado conversando tranquilamente con otra persona' },
    { id: 'post_lunch', text: 'Sentado relajadamente tras una comida sin haber consumido alcohol' },
    { id: 'traffic_stop', text: 'En un coche, mientras está parado unos minutos en un atasco o semáforo' }
  ];

  /**
   * Evalúa la escala de Epworth (0 a 24 puntos)
   * @param {Array<number>} scores Array de 8 números del 0 al 3
   */
  SuenoClinic.evaluarEpworth = function (scores) {
    if (!Array.isArray(scores) || scores.length !== 8) {
      throw new Error('La escala Epworth requiere exactamente 8 respuestas (0 a 3).');
    }

    var total = 0;
    for (var i = 0; i < scores.length; i++) {
      var s = parseInt(scores[i], 10);
      if (isNaN(s) || s < 0 || s > 3) {
        throw new Error('Cada puntuación de Epworth debe estar entre 0 y 3.');
      }
      total += s;
    }

    var nivel = 'normal';
    var descripcion = 'Somnolencia diurna normal. No se observan signos de hipersomnia.';
    var recomendacion = 'Patrón de alerta adecuado para actividades cotidianas.';

    if (total >= 8 && total <= 9) {
      nivel = 'leve_limite';
      descripcion = 'Somnolencia diurna en el límite superior de la normalidad.';
      recomendacion = 'Revisar hábitos de descanso y horarios de sueño.';
    } else if (total >= 10 && total <= 15) {
      nivel = 'moderada';
      descripcion = 'Somnolencia diurna excesiva moderada.';
      recomendacion = 'Existe riesgo significativo de apnea del sueño o privación crónica. Se desaconseja conducir cansado y se recomienda valoración clínica.';
    } else if (total >= 16) {
      nivel = 'severa';
      descripcion = 'Somnolencia diurna excesiva severa / patológica.';
      recomendacion = 'Urgente: Peligro elevado de accidentes al volante o laborales. Consulta prioritaria con neumólogo o Unidad del Sueño para polisomnografía.';
    }

    return {
      puntuacion: total,
      maximo: 24,
      nivel: nivel,
      descripcion: descripcion,
      recomendacion: recomendacion,
      riesgoAccidenteConduccion: total >= 11
    };
  };

  /**
   * Evalúa el cuestionario STOP-Bang para Apnea Obstructiva del Sueño
   * @param {Object} p Parámetros clínicos del paciente
   *   - snore: boolean (¿Ronca fuerte?)
   *   - tired: boolean (¿Se siente cansado/fatigado durante el día?)
   *   - observed: boolean (¿Alguien ha observado que deja de respirar?)
   *   - pressure: boolean (¿Hipertensión arterial diagnosticada o tratada?)
   *   - bmi: number (Índice de masa corporal en kg/m²)
   *   - age: number (Edad en años)
   *   - neckCircumferenceCm: number (Perímetro del cuello en cm)
   *   - gender: string ('male' | 'female')
   */
  SuenoClinic.evaluarStopBang = function (p) {
    if (!p) throw new Error('Parámetros no proporcionados para STOP-Bang.');

    var snore = !!p.snore;
    var tired = !!p.tired;
    var observed = !!p.observed;
    var pressure = !!p.pressure;
    var bmiHigh = (p.bmi && p.bmi > 35);
    var ageOver50 = (p.age && p.age > 50);
    var isMale = (p.gender === 'male' || p.gender === 'hombre');
    
    // Cuello grande: > 43 cm (17 pulgadas) en hombres, > 40 cm (16 pulgadas) en mujeres
    var neckThreshold = isMale ? 43 : 40;
    var neckLarge = (p.neckCircumferenceCm && p.neckCircumferenceCm > neckThreshold);

    var stopCount = (snore ? 1 : 0) + (tired ? 1 : 0) + (observed ? 1 : 0) + (pressure ? 1 : 0);
    var bangCount = (bmiHigh ? 1 : 0) + (ageOver50 ? 1 : 0) + (neckLarge ? 1 : 0) + (isMale ? 1 : 0);
    var totalScore = stopCount + bangCount;

    var items = {
      S_ronquido: snore,
      T_fatiga: tired,
      O_apnea_observada: observed,
      P_hipertension: pressure,
      B_imc_elevado: bmiHigh,
      A_edad_mayor_50: ageOver50,
      N_cuello_ancho: neckLarge,
      G_genero_masculino: isMale
    };

    var riesgo = 'bajo';
    var probabilidadAOSModeradaSevera = '< 15%';
    var recomendacion = 'Bajo riesgo de apnea del sueño. Mantener estilo de vida saludable.';

    // Criterios de estratificación STOP-Bang validados:
    // Puntuación 0-2: Bajo riesgo
    // Puntuación 3-4: Riesgo intermedio
    // Puntuación 5-8: Alto riesgo
    // O si STOP >= 2 + (género masculino O IMC > 35 O cuello ancho) -> Clasificado como Alto Riesgo
    var altoPorCriterioCombinado = (stopCount >= 2 && (isMale || bmiHigh || neckLarge));

    if (totalScore >= 5 || altoPorCriterioCombinado) {
      riesgo = 'alto';
      probabilidadAOSModeradaSevera = '> 65-80%';
      recomendacion = 'Alto riesgo de Apnea Obstructiva del Sueño moderada a severa (IAH >= 15). Se recomienda estudio de poligrafía respiratoria domiciliaria o polisomnografía.';
    } else if (totalScore >= 3) {
      riesgo = 'intermedio';
      probabilidadAOSModeradaSevera = '35-50%';
      recomendacion = 'Riesgo intermedio de apnea. Se recomienda monitorización de síntomas, control de peso e interconsulta médica si coexiste hipertensión o somnolencia.';
    }

    return {
      puntuacionTotal: totalScore,
      maximo: 8,
      stopCount: stopCount,
      bangCount: bangCount,
      items: items,
      riesgo: riesgo,
      probabilidadAOSModeradaSevera: probabilidadAOSModeradaSevera,
      altoPorCriterioCombinado: altoPorCriterioCombinado,
      recomendacion: recomendacion
    };
  };

  /**
   * Genera el plan personalizado de Higiene del Sueño basado en TCC-I (Terapia Cognitivo-Conductual para el Insomnio)
   */
  SuenoClinic.generarRecomendacionesTCCI = function (perfil) {
    var recs = [
      {
        categoria: 'Control de Estímulos',
        titulo: 'Regla de los 20 Minutos',
        detalle: 'Si no logras dormirte en aproximadamente 20 minutos, sal de la cama. Ve a otra habitación con luz tenue y realiza una actividad relajante (lectura en papel, música suave) hasta sentir somnolencia. No asocies la cama con frustración.'
      },
      {
        categoria: 'Control de Estímulos',
        titulo: 'Cama exclusiva para dormir e intimidad',
        detalle: 'Elimina el trabajo, televisión, videojuegos o comida en la cama. El cerebro debe vincular el colchón con el reflejo condicionado del sueño.'
      },
      {
        categoria: 'Ritmo Circadiano',
        titulo: 'Despertador invariable 7 días a la semana',
        detalle: 'Levántate a la misma hora todos los días, incluidos fines de semana y festivos. Esto fija el temporizador del núcleo supraquiasmático cerebral.'
      },
      {
        categoria: 'Fotobiología',
        titulo: 'Luz solar matutina directa',
        detalle: 'Exponte a 15-30 minutos de luz natural exterior dentro de la primera hora tras levantarte. Inhibe la melatonina y programa el pico de melatonina para 14-16 horas después.'
      },
      {
        categoria: 'Farmacología y Dieta',
        titulo: 'Ventana de corte de cafeína (8 horas)',
        detalle: 'La vida media de la cafeína es de 5 a 7 horas. Evita café, té negro, bebidas energéticas y refrescos de cola después de las 14:00 o al menos 8 horas antes de acostarte.'
      },
      {
        categoria: 'Temperatura y Ambiente',
        titulo: 'Termorregulación nocturna (18°C - 20°C)',
        detalle: 'El cuerpo necesita descender su temperatura central en aproximadamente 1°C para iniciar el sueño profundo. Una habitación fresca y ventilada facilita la fase de ondas lentas.'
      }
    ];

    if (perfil && perfil.snore) {
      recs.push({
        categoria: 'Medidas Posturales',
        titulo: 'Terapia posicional (evitar decúbito supino)',
        detalle: 'Dormir boca arriba favorece el colapso de la vía aérea superior por gravedad retrofaríngea. Intenta dormir de lado (decúbito lateral) con almohada cervical ergonómica.'
      });
    }

    return recs;
  };

  /**
   * Genera el informe clínico consolidado para entregar al médico de cabecera o neumólogo
   */
  SuenoClinic.generarInformeClinico = function (datos) {
    var epworth = SuenoClinic.evaluarEpworth(datos.epworthScores);
    var stopBang = SuenoClinic.evaluarStopBang(datos.stopBangParams);

    var fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    var texto = [
      '===========================================================',
      '        SUEÑOCLINIC - INFORME ORIENTATIVO DE SALUD DEL SUEÑO',
      '===========================================================',
      'Fecha de evaluación: ' + fecha,
      'Datos del paciente:',
      '  - Edad: ' + (datos.stopBangParams.age || 'No especificada') + ' años',
      '  - Sexo biológico: ' + (datos.stopBangParams.gender || 'No especificado'),
      '  - IMC: ' + (datos.stopBangParams.bmi ? datos.stopBangParams.bmi.toFixed(1) + ' kg/m²' : 'No especificado'),
      '  - Perímetro de cuello: ' + (datos.stopBangParams.neckCircumferenceCm ? datos.stopBangParams.neckCircumferenceCm + ' cm' : 'No especificado'),
      '',
      '1. RESULTADO ESCALA STOP-BANG (CRIBADO DE APNEA DEL SUEÑO):',
      '  - Puntuación: ' + stopBang.puntuacionTotal + ' / 8',
      '  - Estratificación: RIESGO ' + stopBang.riesgo.toUpperCase(),
      '  - Probabilidad de IAH >= 15: ' + stopBang.probabilidadAOSModeradaSevera,
      '  - Criterio STOP: ' + stopBang.stopCount + ' / 4 | Criterio BANG: ' + stopBang.bangCount + ' / 4',
      '  - ' + stopBang.recomendacion,
      '',
      '2. RESULTADO ESCALA DE EPWORTH (SOMNOLENCIA DIURNA):',
      '  - Puntuación: ' + epworth.puntuacion + ' / 24',
      '  - Nivel: ' + epworth.descripcion,
      '  - Alerta de seguridad vial: ' + (epworth.riesgoAccidenteConduccion ? 'ATENCIÓN: Riesgo aumentado de micro-sueño al volante' : 'Sin alerta crítica'),
      '  - ' + epworth.recomendacion,
      '',
      '3. AVISO CLÍNICO:',
      'Este informe es una herramienta de cribado preliminar y triaje basada en escalas validadas.',
      'No sustituye el diagnóstico médico por Polisomnografía Nocturna (PSG) ni Poligrafía Respiratoria.',
      'Lleve este documento impreso a su médico de atención primaria o neumólogo.',
      '==========================================================='
    ].join('\n');

    return {
      fecha: fecha,
      epworth: epworth,
      stopBang: stopBang,
      textoPlano: texto
    };
  };

  return SuenoClinic;
});
