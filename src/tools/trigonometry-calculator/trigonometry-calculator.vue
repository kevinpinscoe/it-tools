<script setup lang="ts">
type AngleUnit = 'deg' | 'rad';

const angleUnit = ref<AngleUnit>('deg');

function toRad(val: number, unit: AngleUnit) {
  return unit === 'deg' ? (val * Math.PI) / 180 : val;
}

function fromRad(val: number, unit: AngleUnit) {
  return unit === 'rad' ? val : (val * 180) / Math.PI;
}

function fmt(val: number): string {
  if (!Number.isFinite(val) || Number.isNaN(val)) {
    return '';
  }
  return Number.parseFloat(val.toPrecision(10)).toString();
}

// --- Basic trig ---
const angle = ref<number | undefined>(undefined);

const sinResult = computed(() => angle.value === undefined ? '' : fmt(Math.sin(toRad(angle.value, angleUnit.value))));
const cosResult = computed(() => angle.value === undefined ? '' : fmt(Math.cos(toRad(angle.value, angleUnit.value))));
const tanResult = computed(() => {
  if (angle.value === undefined) {
    return '';
  }
  const v = Math.tan(toRad(angle.value, angleUnit.value));
  return Number.isFinite(v) ? fmt(v) : 'undefined';
});

// --- Inverse trig ---
const arcsinInput = ref<number | undefined>(undefined);
const arccosInput = ref<number | undefined>(undefined);
const arctanInput = ref<number | undefined>(undefined);

const arcsinResult = computed(() => {
  if (arcsinInput.value === undefined) {
    return '';
  }
  if (arcsinInput.value < -1 || arcsinInput.value > 1) {
    return 'out of range';
  }
  return fmt(fromRad(Math.asin(arcsinInput.value), angleUnit.value));
});

const arccosResult = computed(() => {
  if (arccosInput.value === undefined) {
    return '';
  }
  if (arccosInput.value < -1 || arccosInput.value > 1) {
    return 'out of range';
  }
  return fmt(fromRad(Math.acos(arccosInput.value), angleUnit.value));
});

const arctanResult = computed(() => {
  if (arctanInput.value === undefined) {
    return '';
  }
  return fmt(fromRad(Math.atan(arctanInput.value), angleUnit.value));
});

// --- Pythagorean theorem ---
const pyA = ref<number | undefined>(undefined);
const pyB = ref<number | undefined>(undefined);
const pyHyp = computed(() => {
  if (pyA.value === undefined || pyB.value === undefined) {
    return '';
  }
  return fmt(Math.sqrt(pyA.value ** 2 + pyB.value ** 2));
});

const pyC = ref<number | undefined>(undefined);
const pyKnown = ref<number | undefined>(undefined);
const pyMissing = computed(() => {
  if (pyC.value === undefined || pyKnown.value === undefined) {
    return '';
  }
  const val = pyC.value ** 2 - pyKnown.value ** 2;
  return val < 0 ? 'invalid' : fmt(Math.sqrt(val));
});
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 640px">

      <c-card mb-3>
        <div flex items-center gap-3>
          <span>Angle unit:</span>
          <n-radio-group v-model:value="angleUnit">
            <n-radio value="deg">Degrees</n-radio>
            <n-radio value="rad">Radians</n-radio>
          </n-radio-group>
        </div>
      </c-card>

      <c-card mb-3 title="Sin / Cos / Tan">
        <div flex gap-2 items-center mb-2>
          <span style="min-width: 80px;">Angle</span>
          <n-input-number v-model:value="angle" placeholder="Angle" style="max-width: 180px;" />
        </div>
        <div flex gap-2 items-center mb-2>
          <span style="min-width: 80px;">sin</span>
          <input-copyable :value="sinResult" readonly placeholder="—" style="max-width: 220px;" />
        </div>
        <div flex gap-2 items-center mb-2>
          <span style="min-width: 80px;">cos</span>
          <input-copyable :value="cosResult" readonly placeholder="—" style="max-width: 220px;" />
        </div>
        <div flex gap-2 items-center>
          <span style="min-width: 80px;">tan</span>
          <input-copyable :value="tanResult" readonly placeholder="—" style="max-width: 220px;" />
        </div>
      </c-card>

      <c-card mb-3 title="Inverse Trig (arc functions)">
        <div flex gap-2 items-center mb-2>
          <span style="min-width: 80px;">arcsin</span>
          <n-input-number v-model:value="arcsinInput" :min="-1" :max="1" placeholder="Value (−1 to 1)" style="max-width: 180px;" />
          <span style="min-width: 10px;">=</span>
          <input-copyable :value="arcsinResult" readonly placeholder="—" style="max-width: 180px;" />
        </div>
        <div flex gap-2 items-center mb-2>
          <span style="min-width: 80px;">arccos</span>
          <n-input-number v-model:value="arccosInput" :min="-1" :max="1" placeholder="Value (−1 to 1)" style="max-width: 180px;" />
          <span style="min-width: 10px;">=</span>
          <input-copyable :value="arccosResult" readonly placeholder="—" style="max-width: 180px;" />
        </div>
        <div flex gap-2 items-center>
          <span style="min-width: 80px;">arctan</span>
          <n-input-number v-model:value="arctanInput" placeholder="Value" style="max-width: 180px;" />
          <span style="min-width: 10px;">=</span>
          <input-copyable :value="arctanResult" readonly placeholder="—" style="max-width: 180px;" />
        </div>
      </c-card>

      <c-card title="Pythagorean Theorem">
        <div mb-3>
          <div mb-1 op-70>
            Find hypotenuse (c) from sides a and b
          </div>
          <div flex gap-2 items-center>
            <n-input-number v-model:value="pyA" placeholder="Side a" style="max-width: 160px;" />
            <span op-60>² + </span>
            <n-input-number v-model:value="pyB" placeholder="Side b" style="max-width: 160px;" />
            <span op-60>² → c =</span>
            <input-copyable :value="pyHyp" readonly placeholder="—" style="max-width: 160px;" />
          </div>
        </div>
        <div>
          <div mb-1 op-70>
            Find missing side from hypotenuse (c) and one side
          </div>
          <div flex gap-2 items-center>
            <n-input-number v-model:value="pyC" placeholder="Hypotenuse c" style="max-width: 160px;" />
            <span op-60>² − </span>
            <n-input-number v-model:value="pyKnown" placeholder="Known side" style="max-width: 160px;" />
            <span op-60>² → side =</span>
            <input-copyable :value="pyMissing" readonly placeholder="—" style="max-width: 160px;" />
          </div>
        </div>
      </c-card>

    </div>
  </div>
</template>
