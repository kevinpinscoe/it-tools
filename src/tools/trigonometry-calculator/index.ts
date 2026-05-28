import { MathFunction } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.trigonometry-calculator.title'),
  path: '/trigonometry-calculator',
  description: translate('tools.trigonometry-calculator.description'),
  keywords: ['trigonometry', 'sin', 'cos', 'tan', 'sine', 'cosine', 'tangent', 'arcsin', 'arccos', 'arctan', 'angle', 'hypotenuse', 'pythagorean', 'calculator'],
  component: () => import('./trigonometry-calculator.vue'),
  icon: MathFunction,
  createdAt: new Date('2026-05-28'),
});
