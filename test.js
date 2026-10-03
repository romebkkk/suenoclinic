/**
 * Test Suite para SueñoClinic - Validación de algoritmos clínicos
 */

const assert = require('assert');
const SuenoClinic = require('./sueno');

console.log('--- INICIANDO TESTS CLÍNICOS DE SUEÑOCLINIC ---');

// Test 1: Epworth escala normal
const epworthNormal = SuenoClinic.evaluarEpworth([0, 1, 0, 1, 1, 0, 1, 0]);
assert.strictEqual(epworthNormal.puntuacion, 4);
assert.strictEqual(epworthNormal.nivel, 'normal');
assert.strictEqual(epworthNormal.riesgoAccidenteConduccion, false);
console.log('✅ Test 1 Superado: Epworth valor normal evaluado correctamente.');

// Test 2: Epworth somnolencia severa
const epworthSevero = SuenoClinic.evaluarEpworth([3, 3, 2, 3, 3, 1, 2, 2]);
assert.strictEqual(epworthSevero.puntuacion, 19);
assert.strictEqual(epworthSevero.nivel, 'severa');
assert.strictEqual(epworthSevero.riesgoAccidenteConduccion, true);
console.log('✅ Test 2 Superado: Epworth valor severo detecta alerta de conducción.');

// Test 3: STOP-Bang bajo riesgo
const stopBangBajo = SuenoClinic.evaluarStopBang({
  snore: false,
  tired: true,
  observed: false,
  pressure: false,
  bmi: 23.5,
  age: 32,
  neckCircumferenceCm: 36,
  gender: 'female'
});
assert.strictEqual(stopBangBajo.puntuacionTotal, 1);
assert.strictEqual(stopBangBajo.riesgo, 'bajo');
console.log('✅ Test 3 Superado: STOP-Bang bajo riesgo (puntuación 1).');

// Test 4: STOP-Bang intermedio
const stopBangIntermedio = SuenoClinic.evaluarStopBang({
  snore: true,
  tired: true,
  observed: false,
  pressure: true,
  bmi: 28,
  age: 45,
  neckCircumferenceCm: 39,
  gender: 'female'
});
assert.strictEqual(stopBangIntermedio.puntuacionTotal, 3);
assert.strictEqual(stopBangIntermedio.riesgo, 'intermedio');
console.log('✅ Test 4 Superado: STOP-Bang intermedio (puntuación 3).');

// Test 5: STOP-Bang alto riesgo por puntuación total (>= 5)
const stopBangAlto = SuenoClinic.evaluarStopBang({
  snore: true,
  tired: true,
  observed: true,
  pressure: true,
  bmi: 36,
  age: 58,
  neckCircumferenceCm: 44,
  gender: 'male'
});
assert.strictEqual(stopBangAlto.puntuacionTotal, 8);
assert.strictEqual(stopBangAlto.riesgo, 'alto');
console.log('✅ Test 5 Superado: STOP-Bang máximo riesgo (8/8).');

// Test 6: STOP-Bang criterio combinado (STOP >= 2 + Cuello ancho) -> Alto riesgo
const stopBangCombinado = SuenoClinic.evaluarStopBang({
  snore: true,
  tired: false,
  observed: true,
  pressure: false, // stopCount = 2
  bmi: 27,
  age: 42,
  neckCircumferenceCm: 45, // cuello > 43 en hombre
  gender: 'male'
});
// totalScore = 2 (stop) + 2 (neck + male) = 4, pero por criterio combinado STOP>=2 + male/neck => ALTO
assert.strictEqual(stopBangCombinado.altoPorCriterioCombinado, true);
assert.strictEqual(stopBangCombinado.riesgo, 'alto');
console.log('✅ Test 6 Superado: Criterio combinado STOP-Bang de alto riesgo verificado.');

// Test 7: Generación de informe clínico
const informe = SuenoClinic.generarInformeClinico({
  epworthScores: [2, 2, 1, 2, 2, 1, 2, 1], // total = 13 (moderada)
  stopBangParams: {
    snore: true,
    tired: true,
    observed: true,
    pressure: false,
    bmi: 31,
    age: 55,
    neckCircumferenceCm: 42,
    gender: 'female'
  }
});
assert.ok(informe.textoPlano.includes('SUEÑOCLINIC'));
assert.strictEqual(informe.epworth.puntuacion, 13);
assert.strictEqual(informe.stopBang.riesgo, 'alto');
console.log('✅ Test 7 Superado: Informe clínico consolidado emitido fielmente.');

console.log('\n--- TODOS LOS 7 TESTS DE SUEÑOCLINIC SUPERADOS EXITOSAMENTE ---');
