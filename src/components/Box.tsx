import { createBox } from '@shopify/restyle';
import { Theme } from '../utils/theme';

// Box component - the foundation for all layouts
// Uses Shopify Restyle for consistent spacing, colors, and layout
const Box = createBox<Theme>();

export default Box;