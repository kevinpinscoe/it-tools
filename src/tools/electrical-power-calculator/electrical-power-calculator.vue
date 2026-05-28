<script setup lang="ts">
type SolveFor = 'P' | 'V' | 'I' | 'R';

interface FormulaOption {
  label: string
  formula: string
  input1: { label: string; unit: string }
  input2: { label: string; unit: string }
  calc: (a: number, b: number) => { P: number; V: number; I: number; R: number }
}

const formulas: Record<SolveFor, FormulaOption[]> = {
  P: [
    {
      label: 'Voltage & Current',
      formula: 'P = V × I',
      input1: { label: 'Voltage (V)', unit: 'V' },
      input2: { label: 'Current (I)', unit: 'A' },
      calc: (V, I) => ({ P: V * I, V, I, R: V / I }),
    },
    {
      label: 'Voltage & Resistance',
      formula: 'P = V² ÷ R',
      input1: { label: 'Voltage (V)', unit: 'V' },
      input2: { label: 'Resistance (R)', unit: 'Ω' },
      calc: (V, R) => ({ P: (V ** 2) / R, V, I: V / R, R }),
    },
    {
      label: 'Current & Resistance',
      formula: 'P = I² × R',
      input1: { label: 'Current (I)', unit: 'A' },
      input2: { label: 'Resistance (R)', unit: 'Ω' },
      calc: (I, R) => ({ P: (I ** 2) * R, V: I * R, I, R }),
    },
  ],
  V: [
    {
      label: 'Power & Current',
      formula: 'V = P ÷ I',
      input1: { label: 'Power (P)', unit: 'W' },
      input2: { label: 'Current (I)', unit: 'A' },
      calc: (P, I) => ({ P, V: P / I, I, R: P / (I ** 2) }),
    },
    {
      label: 'Power & Resistance',
      formula: 'V = √(P × R)',
      input1: { label: 'Power (P)', unit: 'W' },
      input2: { label: 'Resistance (R)', unit: 'Ω' },
      calc: (P, R) => ({ P, V: Math.sqrt(P * R), I: Math.sqrt(P / R), R }),
    },
    {
      label: 'Current & Resistance',
      formula: 'V = I × R',
      input1: { label: 'Current (I)', unit: 'A' },
      input2: { label: 'Resistance (R)', unit: 'Ω' },
      calc: (I, R) => ({ P: (I ** 2) * R, V: I * R, I, R }),
    },
  ],
  I: [
    {
      label: 'Power & Voltage',
      formula: 'I = P ÷ V',
      input1: { label: 'Power (P)', unit: 'W' },
      input2: { label: 'Voltage (V)', unit: 'V' },
      calc: (P, V) => ({ P, V, I: P / V, R: (V ** 2) / P }),
    },
    {
      label: 'Power & Resistance',
      formula: 'I = √(P ÷ R)',
      input1: { label: 'Power (P)', unit: 'W' },
      input2: { label: 'Resistance (R)', unit: 'Ω' },
      calc: (P, R) => ({ P, V: Math.sqrt(P * R), I: Math.sqrt(P / R), R }),
    },
    {
      label: 'Voltage & Resistance',
      formula: 'I = V ÷ R',
      input1: { label: 'Voltage (V)', unit: 'V' },
      input2: { label: 'Resistance (R)', unit: 'Ω' },
      calc: (V, R) => ({ P: (V ** 2) / R, V, I: V / R, R }),
    },
  ],
  R: [
    {
      label: 'Voltage & Current',
      formula: 'R = V ÷ I',
      input1: { label: 'Voltage (V)', unit: 'V' },
      input2: { label: 'Current (I)', unit: 'A' },
      calc: (V, I) => ({ P: V * I, V, I, R: V / I }),
    },
    {
      label: 'Power & Current',
      formula: 'R = P ÷ I²',
      input1: { label: 'Power (P)', unit: 'W' },
      input2: { label: 'Current (I)', unit: 'A' },
      calc: (P, I) => ({ P, V: P / I, I, R: P / (I ** 2) }),
    },
    {
      label: 'Power & Voltage',
      formula: 'R = V² ÷ P',
      input1: { label: 'Power (P)', unit: 'W' },
      input2: { label: 'Voltage (V)', unit: 'V' },
      calc: (P, V) => ({ P, V, I: P / V, R: (V ** 2) / P }),
    },
  ],
};

const solveFor = ref<SolveFor>('P');
const formulaIndex = ref(0);
const input1 = ref<number | undefined>(undefined);
const input2 = ref<number | undefined>(undefined);

watch(solveFor, () => {
  formulaIndex.value = 0;
  input1.value = undefined;
  input2.value = undefined;
});

watch(formulaIndex, () => {
  input1.value = undefined;
  input2.value = undefined;
});

const currentFormulas = computed(() => formulas[solveFor.value]);
const currentFormula = computed(() => currentFormulas.value[formulaIndex.value]);

function fmt(val: number): string {
  if (!Number.isFinite(val) || Number.isNaN(val) || val < 0) {
    return '—';
  }
  return Number.parseFloat(val.toPrecision(8)).toString();
}

const results = computed(() => {
  const a = input1.value;
  const b = input2.value;
  if (a === undefined || b === undefined) {
    return null;
  }
  const r = currentFormula.value.calc(a, b);
  return { P: fmt(r.P), V: fmt(r.V), I: fmt(r.I), R: fmt(r.R) };
});
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 580px">

      <c-card mb-3 title="Solve For">
        <n-radio-group v-model:value="solveFor">
          <n-space>
            <n-radio value="P">Power (W)</n-radio>
            <n-radio value="V">Voltage (V)</n-radio>
            <n-radio value="I">Current (A)</n-radio>
            <n-radio value="R">Resistance (Ω)</n-radio>
          </n-space>
        </n-radio-group>
      </c-card>

      <c-card mb-3 title="Formula">
        <n-radio-group v-model:value="formulaIndex">
          <n-space vertical>
            <n-radio
              v-for="(f, idx) in currentFormulas"
              :key="idx"
              :value="idx"
            >
              <span style="font-style: italic; margin-right: 8px;">{{ f.formula }}</span>
              <span op-60 style="font-size: 0.85em;">using {{ f.label }}</span>
            </n-radio>
          </n-space>
        </n-radio-group>
      </c-card>

      <c-card mb-3 title="Inputs">
        <div flex gap-3 items-center mb-3>
          <span style="min-width: 160px;">{{ currentFormula.input1.label }}</span>
          <n-input-number
            v-model:value="input1"
            :min="0"
            placeholder="Enter value"
            style="max-width: 180px;"
          />
          <span op-70>{{ currentFormula.input1.unit }}</span>
        </div>
        <div flex gap-3 items-center>
          <span style="min-width: 160px;">{{ currentFormula.input2.label }}</span>
          <n-input-number
            v-model:value="input2"
            :min="0"
            placeholder="Enter value"
            style="max-width: 180px;"
          />
          <span op-70>{{ currentFormula.input2.unit }}</span>
        </div>
      </c-card>

      <c-card v-if="results" title="Results">
        <div flex gap-3 items-center mb-3>
          <span style="min-width: 160px;">Power (P)</span>
          <input-copyable :value="results.P" readonly style="max-width: 180px;" />
          <span op-70>W</span>
        </div>
        <div flex gap-3 items-center mb-3>
          <span style="min-width: 160px;">Voltage (V)</span>
          <input-copyable :value="results.V" readonly style="max-width: 180px;" />
          <span op-70>V</span>
        </div>
        <div flex gap-3 items-center mb-3>
          <span style="min-width: 160px;">Current (I)</span>
          <input-copyable :value="results.I" readonly style="max-width: 180px;" />
          <span op-70>A</span>
        </div>
        <div flex gap-3 items-center>
          <span style="min-width: 160px;">Resistance (R)</span>
          <input-copyable :value="results.R" readonly style="max-width: 180px;" />
          <span op-70>Ω</span>
        </div>
      </c-card>

      <c-card v-else>
        <n-text op-60>
          Enter both values above to calculate.
        </n-text>
      </c-card>

    </div>
  </div>
</template>
