<script setup lang="ts">
type Operation = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT';

interface OpConfig {
  label: string
  symbol: string
  unary: boolean
  input2Label: string
}

const ops: Record<Operation, OpConfig> = {
  AND: { label: 'AND', symbol: '&', unary: false, input2Label: 'Number 2' },
  OR: { label: 'OR', symbol: '|', unary: false, input2Label: 'Number 2' },
  XOR: { label: 'XOR', symbol: '^', unary: false, input2Label: 'Number 2' },
  NOT: { label: 'NOT', symbol: '~', unary: true, input2Label: '' },
  LSHIFT: { label: 'Left Shift', symbol: '<<', unary: false, input2Label: 'Shift Amount' },
  RSHIFT: { label: 'Right Shift', symbol: '>>', unary: false, input2Label: 'Shift Amount' },
};

const operation = ref<Operation>('AND');
const num1 = ref<number | undefined>(undefined);
const num2 = ref<number | undefined>(undefined);

watch(operation, () => {
  num2.value = undefined;
});

const currentOp = computed(() => ops[operation.value]);

function toBin(n: number): string {
  if (n < 0) {
    return `-${((-n) >>> 0).toString(2)}`;
  }
  return (n >>> 0).toString(2);
}

function pad(bin: string, ref: string): string {
  const len = Math.max(bin.replace('-', '').length, ref.replace('-', '').length, 8);
  const digits = bin.startsWith('-') ? bin.slice(1).padStart(len, '0') : bin.padStart(len, '0');
  return bin.startsWith('-') ? `-${digits}` : digits;
}

const result = computed(() => {
  const a = num1.value;
  const b = num2.value;

  if (a === undefined) {
    return null;
  }
  if (!currentOp.value.unary && b === undefined) {
    return null;
  }

  const ia = Math.trunc(a);
  const ib = b !== undefined ? Math.trunc(b) : 0;

  let val: number;
  switch (operation.value) {
    case 'AND':
      val = ia & ib;
      break;
    case 'OR':
      val = ia | ib;
      break;
    case 'XOR':
      val = ia ^ ib;
      break;
    case 'NOT':
      val = ~ia;
      break;
    case 'LSHIFT':
      val = ia << ib;
      break;
    case 'RSHIFT':
      val = ia >> ib;
      break;
  }

  const bin1 = toBin(ia);
  const bin2 = !currentOp.value.unary ? toBin(ib) : '';
  const binResult = toBin(val!);

  const refBin = [bin1, bin2, binResult].reduce((longest, s) =>
    s.replace('-', '').length > longest.replace('-', '').length ? s : longest, '');

  return {
    val: val!,
    bin1: pad(bin1, refBin),
    bin2: !currentOp.value.unary ? pad(bin2, refBin) : '',
    binResult: pad(binResult, refBin),
    hex1: ia.toString(16).toUpperCase(),
    hex2: !currentOp.value.unary ? ib.toString(16).toUpperCase() : '',
    hexResult: val!.toString(16).toUpperCase(),
  };
});
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">

      <c-card mb-3 title="Operation">
        <n-radio-group v-model:value="operation">
          <n-space wrap>
            <n-radio
              v-for="(cfg, key) in ops"
              :key="key"
              :value="key"
            >
              {{ cfg.label }} ({{ cfg.symbol }})
            </n-radio>
          </n-space>
        </n-radio-group>
      </c-card>

      <c-card mb-3 title="Inputs">
        <div flex gap-3 items-center mb-3>
          <span style="min-width: 130px;">Number 1</span>
          <n-input-number
            v-model:value="num1"
            placeholder="Integer"
            :precision="0"
            style="max-width: 200px;"
          />
        </div>
        <div v-if="!currentOp.unary" flex gap-3 items-center>
          <span style="min-width: 130px;">{{ currentOp.input2Label }}</span>
          <n-input-number
            v-model:value="num2"
            placeholder="Integer"
            :precision="0"
            :min="operation === 'LSHIFT' || operation === 'RSHIFT' ? 0 : undefined"
            style="max-width: 200px;"
          />
        </div>
      </c-card>

      <c-card v-if="result" title="Result">
        <n-table :bordered="false" size="small">
          <thead>
            <tr>
              <th style="width: 130px;" />
              <th>Decimal</th>
              <th>Binary</th>
              <th>Hex</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td op-70>Number 1</td>
              <td>
                <input-copyable :value="String(Math.trunc(num1!))" readonly />
              </td>
              <td>
                <input-copyable :value="result.bin1" readonly style="font-family: monospace;" />
              </td>
              <td>
                <input-copyable :value="result.hex1" readonly />
              </td>
            </tr>
            <tr v-if="!currentOp.unary">
              <td op-70>{{ currentOp.input2Label }}</td>
              <td>
                <input-copyable :value="String(Math.trunc(num2!))" readonly />
              </td>
              <td>
                <input-copyable :value="result.bin2" readonly style="font-family: monospace;" />
              </td>
              <td>
                <input-copyable :value="result.hex2" readonly />
              </td>
            </tr>
            <tr>
              <td>
                <strong>Result</strong>
              </td>
              <td>
                <input-copyable :value="String(result.val)" readonly />
              </td>
              <td>
                <input-copyable :value="result.binResult" readonly style="font-family: monospace;" />
              </td>
              <td>
                <input-copyable :value="result.hexResult" readonly />
              </td>
            </tr>
          </tbody>
        </n-table>
      </c-card>

      <c-card v-else>
        <n-text op-60>
          Enter {{ currentOp.unary ? 'a number' : 'both values' }} above to calculate.
        </n-text>
      </c-card>

    </div>
  </div>
</template>
