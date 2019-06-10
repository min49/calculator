class KeyDownListenerManager {
  constructor() {
    this.listeners = {};
  }

  add = (key, action) => {
    this.listeners[key] = action;
  };

  remove = (key) => {
    delete this.listeners[key];
  };

  handle = (event) => {
    let key = event.key;
    if (this.listeners.hasOwnProperty(key)) {
      this.listeners[key]();
    }
  }
}

export default KeyDownListenerManager;