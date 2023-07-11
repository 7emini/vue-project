import { reactive } from "vue";

export function configHook() {
  const config = reactive({
    selection: true,
    batch_delete: true,
    pagination: true,
  });

  // 简而言之，configInit函数用于使用data对象的值初始化或更新config对象的属性，但前提是data对象不为空。
  const configInit = (data = {}) => {
    // 检查 data 对象是否为空
    if (JSON.stringify(data) === "{}") {
      return false;
    }

    // 获取 config 对象的键
    const keys = Object.keys(config);

    // 遍历data对象中的每个属性
    for (let key in data) {
      // 在循环内部，使用data.hasOwnProperty(key)检查当前属性是否是data对象的直接属性（而不是继承的）
      if (!data.hasOwnProperty(key)) {
        // 退出本次循环
        continue;
      }

      // 如果属性存在于data对象和config对象中
      if (keys.includes(key)) {
        // 把data对象的属性值赋值给config对象的属性值
        config[key] = data[key];
      }
    }
  };
  return { config, configInit };
}
