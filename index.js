import './src/polyfills/performance';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
console.log('PERFORMANCE AFTER POLYFILL:', {
  now: typeof globalThis.performance?.now,
  mark: typeof globalThis.performance?.mark,
  measure: typeof globalThis.performance?.measure,
  clearMarks: typeof globalThis.performance?.clearMarks,
  clearMeasures: typeof globalThis.performance?.clearMeasures,
});
AppRegistry.registerComponent(appName, () => App);