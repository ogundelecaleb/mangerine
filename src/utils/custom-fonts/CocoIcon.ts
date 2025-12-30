import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';

const CocoIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'CocoIcon',
  'CocoIcon.ttf'
);

export default CocoIcon;
