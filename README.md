# SueñoClinic 🌙💤

> **Herramienta clínica integral de evaluación del sueño:** Cribado precoz de Apnea Obstructiva del Sueño (Escala STOP-Bang), Escala de Somnolencia Diurna de Epworth (ESS), Higiene del Sueño basada en TCC-I y generador de informe para Unidades del Sueño. **100% privado en el navegador, sin rastreo ni costes de servidor.**

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Tests Clínicos](https://img.shields.io/badge/tests-7%20passed-brightgreen.svg)](test.js)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](sueno.js)
[![100% In-Browser](https://img.shields.io/badge/privacidad-100%25%20local-indigo.svg)](index.html)

---

## 🎯 El Problema Clínico Real

La **Apnea Obstructiva del Sueño (AOS)** es una epidemia silente:
- **Más del 80% de los afectados están sin diagnosticar** en la población general.
- Cada pausa respiratoria nocturna genera desaturaciones bruscas de oxígeno, picos de adrenalina e hipertensión refractaria.
- Multiplica por **3 el riesgo de ictus e infarto de miocardio**, además de ser una de las principales causas de accidentes mortales de tráfico por micro-sueños diurnos.
- Las listas de espera para Polisomnografía (PSG) hospitalaria superan habitualmente los 6-12 meses: el triaje y cribado previo riguroso es indispensable.

**SueñoClinic** pone en manos de cualquier persona y profesional de atención primaria las herramientas de estratificación validadas por la literatura médica internacional para detectar el riesgo a tiempo y acudir a la consulta con datos objetivos.

---

## 🔬 Metodología Médica y Algoritmos

1. **Cuestionario STOP-Bang (Chung F et al., *Anesthesiology* 2008 / *BJA* 2012):**
   - **S**noring (Ronquido intenso)
   - **T**ired (Cansancio diurno)
   - **O**bserved (Apnea observada por conviviente)
   - **P**ressure (Hipertensión arterial tratada o diagnosticada)
   - **B**MI (> 35 kg/m²)
   - **A**ge (> 50 años)
   - **N**eck circumference (> 43 cm en varones, > 40 cm en mujeres)
   - **G**ender (Masculino)
   - *Estratificación validada:* Criterios combinados para alta especificidad en AOS moderada a severa (IAH $\ge 15$).

2. **Escala de Somnolencia Diurna de Epworth (ESS - Johns MW, *Sleep* 1991):**
   - 8 escenarios estandarizados calificados de 0 a 3.
   - Puntuación 0-24 con discriminación de riesgo para conducción y manejo de maquinaria pesada ($> 10$ puntos).

3. **Higiene del Sueño & TCC-I (American Academy of Sleep Medicine):**
   - Terapia de control de estímulos (regla de los 20 minutos).
   - Terapia de sincronización circadiana fotobiológica matutina.
   - Ventanas de corte de cafeína y termorregulación ambiental.

4. **Dossier Clínico Exportable:**
   - Resumen médico estructurado listo para imprimir o copiar al historial clínico.

---

## 🚀 Uso Rápido

### En el navegador
Abre directamente `index.html` en cualquier navegador web moderno (Chrome, Firefox, Safari, Edge). No requiere Node.js ni servidor web.

### Pruebas clínicas automatizadas
Ejecuta el back-testing con Node.js:
```bash
node test.js
```

---

## 🔒 Privacidad Radical
- Ningún dato de salud se envía a internet.
- Sin telemetría, sin cookies de seguimiento, sin base de datos en la nube.
- Diseñado para funcionar 100% desconectado (offline-first).

---

## ⚠️ Aviso de Responsabilidad Médica
SueñoClinic es una herramienta digital de apoyo y cribado preliminar. No constituye un diagnóstico médico formal ni sustituye la realización de una polisomnografía nocturna o la consulta con un facultativo especialista en medicina respiratoria o neurofisiología.

---

## 📄 Licencia
Licencia MIT. Copyright (c) 2026 DataFlow Elegance — Ismael Ben Kazem.
