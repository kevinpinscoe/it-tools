import { BatteryCharging } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.electrical-power-calculator.title'),
  path: '/electrical-power-calculator',
  description: translate('tools.electrical-power-calculator.description'),
  keywords: ['electrical', 'power', 'voltage', 'current', 'resistance', 'watts', 'ohm', 'watt', 'ampere', 'volt', 'calculator'],
  component: () => import('./electrical-power-calculator.vue'),
  icon: BatteryCharging,
  createdAt: new Date('2026-05-28'),
});
