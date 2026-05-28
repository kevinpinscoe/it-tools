import { Plug } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.power-factor-calculator.title'),
  path: '/power-factor-calculator',
  description: translate('tools.power-factor-calculator.description'),
  keywords: ['power', 'factor', 'pf', 'apparent', 'reactive', 'real', 'kva', 'kvar', 'kw', 'electronics', 'electrical', 'calculator'],
  component: () => import('./power-factor-calculator.vue'),
  icon: Plug,
  createdAt: new Date('2026-05-28'),
});
