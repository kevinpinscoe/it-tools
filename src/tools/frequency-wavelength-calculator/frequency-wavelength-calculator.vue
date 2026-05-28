<script setup lang="ts">
const SPEED_OF_LIGHT = 299_792_458;

type FreqUnit = 'Hz' | 'kHz' | 'MHz' | 'GHz';
type WaveUnit = 'm' | 'cm' | 'mm' | 'ft' | 'in';
type Mode = 'freqToWave' | 'waveToFreq';

const freqMultiplier: Record<FreqUnit, number> = {
  Hz: 1,
  kHz: 1e3,
  MHz: 1e6,
  GHz: 1e9,
};

const waveMultiplier: Record<WaveUnit, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
};

const mode = ref<Mode>('freqToWave');
const freqValue = ref<number | undefined>(undefined);
const freqUnit = ref<FreqUnit>('MHz');
const waveValue = ref<number | undefined>(undefined);
const waveUnit = ref<WaveUnit>('m');
const resultWaveUnit = ref<WaveUnit>('m');
const resultFreqUnit = ref<FreqUnit>('MHz');

watch(mode, () => {
  freqValue.value = undefined;
  waveValue.value = undefined;
});

function fmt(val: number): string {
  if (!Number.isFinite(val) || Number.isNaN(val) || val <= 0) {
    return '—';
  }
  return Number.parseFloat(val.toPrecision(8)).toString();
}

const wavelengthResult = computed(() => {
  if (freqValue.value === undefined || freqValue.value <= 0) {
    return '—';
  }
  const freqHz = freqValue.value * freqMultiplier[freqUnit.value];
  const waveM = SPEED_OF_LIGHT / freqHz;
  return fmt(waveM / waveMultiplier[resultWaveUnit.value]);
});

const frequencyResult = computed(() => {
  if (waveValue.value === undefined || waveValue.value <= 0) {
    return '—';
  }
  const waveM = waveValue.value * waveMultiplier[waveUnit.value];
  const freqHz = SPEED_OF_LIGHT / waveM;
  return fmt(freqHz / freqMultiplier[resultFreqUnit.value]);
});
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 560px">

      <c-card mb-3 title="Direction">
        <n-radio-group v-model:value="mode">
          <n-space>
            <n-radio value="freqToWave">Frequency → Wavelength</n-radio>
            <n-radio value="waveToFreq">Wavelength → Frequency</n-radio>
          </n-space>
        </n-radio-group>
      </c-card>

      <template v-if="mode === 'freqToWave'">
        <c-card mb-3 title="Input Frequency">
          <div flex gap-3 items-center>
            <n-input-number
              v-model:value="freqValue"
              :min="0"
              placeholder="Enter frequency"
              style="max-width: 200px;"
            />
            <n-radio-group v-model:value="freqUnit">
              <n-space>
                <n-radio value="Hz">Hz</n-radio>
                <n-radio value="kHz">kHz</n-radio>
                <n-radio value="MHz">MHz</n-radio>
                <n-radio value="GHz">GHz</n-radio>
              </n-space>
            </n-radio-group>
          </div>
        </c-card>

        <c-card mb-3 title="Output Unit">
          <n-radio-group v-model:value="resultWaveUnit">
            <n-space>
              <n-radio value="m">m</n-radio>
              <n-radio value="cm">cm</n-radio>
              <n-radio value="mm">mm</n-radio>
              <n-radio value="ft">ft</n-radio>
              <n-radio value="in">in</n-radio>
            </n-space>
          </n-radio-group>
        </c-card>

        <c-card v-if="wavelengthResult !== '—'" title="Wavelength">
          <div flex gap-3 items-center>
            <input-copyable :value="wavelengthResult" readonly style="max-width: 200px;" />
            <span op-70>{{ resultWaveUnit }}</span>
          </div>
        </c-card>
        <c-card v-else>
          <n-text op-60>Enter a frequency above to calculate wavelength.</n-text>
        </c-card>
      </template>

      <template v-else>
        <c-card mb-3 title="Input Wavelength">
          <div flex gap-3 items-center>
            <n-input-number
              v-model:value="waveValue"
              :min="0"
              placeholder="Enter wavelength"
              style="max-width: 200px;"
            />
            <n-radio-group v-model:value="waveUnit">
              <n-space>
                <n-radio value="m">m</n-radio>
                <n-radio value="cm">cm</n-radio>
                <n-radio value="mm">mm</n-radio>
                <n-radio value="ft">ft</n-radio>
                <n-radio value="in">in</n-radio>
              </n-space>
            </n-radio-group>
          </div>
        </c-card>

        <c-card mb-3 title="Output Unit">
          <n-radio-group v-model:value="resultFreqUnit">
            <n-space>
              <n-radio value="Hz">Hz</n-radio>
              <n-radio value="kHz">kHz</n-radio>
              <n-radio value="MHz">MHz</n-radio>
              <n-radio value="GHz">GHz</n-radio>
            </n-space>
          </n-radio-group>
        </c-card>

        <c-card v-if="frequencyResult !== '—'" title="Frequency">
          <div flex gap-3 items-center>
            <input-copyable :value="frequencyResult" readonly style="max-width: 200px;" />
            <span op-70>{{ resultFreqUnit }}</span>
          </div>
        </c-card>
        <c-card v-else>
          <n-text op-60>Enter a wavelength above to calculate frequency.</n-text>
        </c-card>
      </template>

    </div>
  </div>
</template>
