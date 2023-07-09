import { reactive } from "vue";

export function configHook() {
  const config = reactive({
    selection: true,
    batch_delete: true,
    pagination: true,
  });
  const configInit = (data = {}) => {
    if (JSON.stringify(data) === "{}") {
      return false;
    }
    const keys = Object.keys(config);
    for (let key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }
      if (keys.includes(key)) {
        config[key] = data[key];
      }
    }
  };
  return { config, configInit };
}
