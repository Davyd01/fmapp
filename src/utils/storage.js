export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Ошибка сохранения в localStorage:", error);
  }
};

export const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Ошибка загрузки из localStorage:", error);
    return null;
  }
};

export const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};


