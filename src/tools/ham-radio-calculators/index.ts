import { Radio } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ham-radio-calculators.title'),
  path: '/ham-radio-calculators',
  description: translate('tools.ham-radio-calculators.description'),
  keywords: ['ham', 'radio', 'amateur', 'calculator', 'rf', 'antenna', 'frequency'],
  component: () => import('./ham-radio-calculators.vue'),
  icon: Radio,
  createdAt: new Date('2026-05-28'),
});
