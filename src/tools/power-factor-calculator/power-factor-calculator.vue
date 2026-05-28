<script setup lang="ts">
import { onMounted } from 'vue';

const url = 'https://electriciancalc.com/power-factor';

onMounted(() => {
  window.location.href = url;
});
</script>

<template>
  <c-card>
    <n-space vertical align="center" :size="16">
      <n-text>Redirecting to Power Factor Calculator…</n-text>
      <n-a :href="url">Click here if not redirected automatically</n-a>
    </n-space>
  </c-card>
</template>
