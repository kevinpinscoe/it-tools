import { WaveSine } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.frequency-wavelength-calculator.title'),
  path: '/frequency-wavelength-calculator',
  description: translate('tools.frequency-wavelength-calculator.description'),
  keywords: ['frequency', 'wavelength', 'rf', 'radio', 'wave', 'hz', 'mhz', 'ghz', 'meter', 'speed of light', 'calculator'],
  component: () => import('./frequency-wavelength-calculator.vue'),
  icon: WaveSine,
  createdAt: new Date('2026-05-28'),
});
