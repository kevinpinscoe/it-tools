<script setup lang="ts">
type SolveFor = 'PF' | 'P' | 'S' | 'Q';

const solveFor = ref<SolveFor>('PF');
const input1 = ref<number | undefined>(undefined);
const input2 = ref<number | undefined>(undefined);

watch(solveFor, () => {
  input1.value = undefined;
  input2.value = undefined;
});

interface FieldConfig {
  label1: string
  unit1: string
  label2: string
  unit2: string
  formula: string
}

const config: Record<SolveFor, FieldConfig> = {
  PF: { label1: 'Real Power (P)', unit1: 'kW', label2: 'Apparent Power (S)', unit2: 'kVA', formula: 'PF = P ÷ S' },
  P: { label1: 'Apparent Power (S)', unit1: 'kVA', label2: 'Power Factor (PF)', unit2: '', formula: 'P = S × PF' },
  S: { label1: 'Real Power (P)', unit1: 'kW', label2: 'Power Factor (PF)', unit2: '', formula: 'S = P ÷ PF' },
  Q: { label1: 'Real Power (P)', unit1: 'kW', label2: 'Apparent Power (S)', unit2: 'kVA', formula: 'Q = √(S² − P²)' },
};

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

  let P: number, S: number, Q: number, PF: number;

  switch (solveFor.value) {
    case 'PF':
      P = a;
      S = b;
      PF = P / S;
      Q = Math.sqrt(Math.max(0, S ** 2 - P ** 2));
      break;
    case 'P':
      S = a;
      PF = b;
      P = S * PF;
      Q = Math.sqrt(Math.max(0, S ** 2 - P ** 2));
      break;
    case 'S':
      P = a;
      PF = b;
      S = P / PF;
      Q = Math.sqrt(Math.max(0, S ** 2 - P ** 2));
      break;
    case 'Q':
      P = a;
      S = b;
      Q = Math.sqrt(Math.max(0, S ** 2 - P ** 2));
      PF = P / S;
      break;
  }

  const theta = (Math.acos(PF!) * 180) / Math.PI;

  return {
    PF: fmt(PF!),
    P: fmt(P!),
    S: fmt(S!),
    Q: fmt(Q!),
    theta: fmt(theta),
  };
});

const current = computed(() => config[solveFor.value]);
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 560px">
      <c-card mb-3 title="Solve For">
        <n-radio-group v-model:value="solveFor">
          <n-space>
            <n-radio value="PF">
              Power Factor
            </n-radio>
            <n-radio value="P">
              Real Power (kW)
            </n-radio>
            <n-radio value="S">
              Apparent Power (kVA)
            </n-radio>
            <n-radio value="Q">
              Reactive Power (kVAR)
            </n-radio>
          </n-space>
        </n-radio-group>
        <div mt-2 op-60 style="font-size: 0.85em; font-style: italic;">
          {{ current.formula }}
        </div>
      </c-card>

      <c-card mb-3 title="Inputs">
        <div mb-3 flex items-center gap-3>
          <span style="min-width: 180px;">{{ current.label1 }}</span>
          <n-input-number v-model:value="input1" :min="0" placeholder="Enter value" style="max-width: 160px;" />
          <span op-70>{{ current.unit1 }}</span>
        </div>
        <div flex items-center gap-3>
          <span style="min-width: 180px;">{{ current.label2 }}</span>
          <n-input-number
            v-model:value="input2"
            :min="0"
            :max="solveFor === 'P' || solveFor === 'S' ? 1 : undefined"
            placeholder="Enter value"
            style="max-width: 160px;"
          />
          <span op-70>{{ current.unit2 }}</span>
        </div>
      </c-card>

      <c-card v-if="results" title="Results">
        <div mb-3 flex items-center gap-3>
          <span style="min-width: 180px;">Power Factor (PF)</span>
          <input-copyable :value="results.PF" readonly style="max-width: 160px;" />
          <span op-70>ratio (0–1)</span>
        </div>
        <div mb-3 flex items-center gap-3>
          <span style="min-width: 180px;">Phase Angle (θ)</span>
          <input-copyable :value="results.theta" readonly style="max-width: 160px;" />
          <span op-70>°</span>
        </div>
        <div mb-3 flex items-center gap-3>
          <span style="min-width: 180px;">Real Power (P)</span>
          <input-copyable :value="results.P" readonly style="max-width: 160px;" />
          <span op-70>kW</span>
        </div>
        <div mb-3 flex items-center gap-3>
          <span style="min-width: 180px;">Apparent Power (S)</span>
          <input-copyable :value="results.S" readonly style="max-width: 160px;" />
          <span op-70>kVA</span>
        </div>
        <div flex items-center gap-3>
          <span style="min-width: 180px;">Reactive Power (Q)</span>
          <input-copyable :value="results.Q" readonly style="max-width: 160px;" />
          <span op-70>kVAR</span>
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
