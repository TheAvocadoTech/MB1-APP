const globalObject = globalThis as typeof globalThis & {
  performance?: {
    now: () => number;
    mark?: (...args: any[]) => void;
    measure?: (...args: any[]) => void;
    clearMarks?: (...args: any[]) => void;
    clearMeasures?: (...args: any[]) => void;
  };
};

const performanceObject = globalObject.performance;

if (performanceObject) {
  if (typeof performanceObject.clearMarks !== 'function') {
    performanceObject.clearMarks = () => {};
  }

  if (typeof performanceObject.clearMeasures !== 'function') {
    performanceObject.clearMeasures = () => {};
  }
}