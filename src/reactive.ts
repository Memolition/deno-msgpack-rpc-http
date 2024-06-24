// // Example usage
// const reactiveValue = new Reactive<number>(0);

// // Subscribe to changes
// const unsubscribe = reactiveValue.subscribe((newValue) => {
//   console.log(`Value changed to: ${newValue}`);
// });

// // Set new values
// reactiveValue.set(1); // Logs: Value changed to: 1
// reactiveValue.set(2); // Logs: Value changed to: 2

// // Unsubscribe from changes
// unsubscribe();

// reactiveValue.set(3); // No log since we unsubscribed

export default class Reactive<T> {
  private value: T;
  private listeners: Set<(newValue: T) => void>;

  constructor(value: T) {
    this.value = value;
    this.listeners = new Set();
  }

  // Method to get the current value
  get() {
    return this.value;
  }

  // Method to set a new value and notify listeners
  set(newValue: T) {
    this.value = newValue;
    this.listeners.forEach(listener => listener(newValue));
  }

  // Method to subscribe to value changes
  subscribe(listener: (newValue: T) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // Unsubscribe function
  }
}