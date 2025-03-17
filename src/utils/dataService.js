export const loadData = async () => {
    try {
      const response = await fetch("/data.json");
      if (!response.ok) throw new Error("Ошибка загрузки данных");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  export const saveData = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    a.click();
  };
  