import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.bitwise-calculator.title'),
  path: '/bitwise-calculator',
  description: translate('tools.bitwise-calculator.description'),
  keywords: ['bitwise', 'binary', 'and', 'or', 'xor', 'not', 'shift', 'bit', 'calculator'],
  component: () => import('./bitwise-calculator.vue'),
  icon: Binary,
  createdAt: new Date('2026-05-28'),
});
