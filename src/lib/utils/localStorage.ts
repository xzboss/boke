export const getLocalStorage = (key: string) => {
  return JSON.parse(localStorage.getItem(key) || '{}');
};

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
