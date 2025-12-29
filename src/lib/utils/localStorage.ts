export const getLocalStorage = (key: string) => {
  if (typeof window === 'undefined') {
    return {};
  }
  return JSON.parse(localStorage?.getItem(key) || '{}');
};

export const setLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(key);
};
