try {
  window.localStorage.getItem('__test__');
} catch {
  const store = new Map();
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(String(k), String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
      get length() { return store.size; },
      key: (i) => Array.from(store.keys())[i] ?? null,
    },
    writable: true,
    configurable: true,
  });
}
