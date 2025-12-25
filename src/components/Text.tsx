import { createText } from '@shopify/restyle';
import { Theme } from '../utils/theme';

// Text component - handles all text styling consistently
// Uses theme variants for different font weights and styles
const Text = createText<Theme>();

export default Text;