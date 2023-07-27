import { reactive } from "vue";

export function configHook() {
    // 表格配置
    const responseConfig = reactive({
        use_selection: true, // 是否使用批量选择
        use_pagination: true, // 是否使用分页
        use_batch_delete: true, // 是否使用批量删除
        use_search: true, // 是否使用搜索
    });

    /**
     * 给配置项目赋值
     */
    const configInit = (data) => {
        if (JSON.stringify(data) == "{}") {
            return false;
        }
        const config_keys = Object.keys(responseConfig);

        for (let data_key in data) {
            // 这段代码的作用是检查当前的属性 data_key 是否是 data 对象自己的属性（而不是从原型链继承的属性）。
            if (!data.hasOwnProperty(data_key)) {
                continue;
            }
            // 如果目标配置数据中拥有传递过来配置数据的属性，替换
            if (config_keys.includes(data_key)) {
                responseConfig[data_key] = data[data_key];
            }
        }
    }
    return {responseConfig, configInit}

}