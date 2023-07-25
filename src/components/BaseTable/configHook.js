import { reactive } from "vue";

export function configHook() {
    const config = reactive({
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
        const config_keys = Object.keys(config);

        for (let data_key in data) {
            if (!data.hasOwnProperty(data_key)) {
                continue;
            }
            if (config_keys.includes(data_key)) {
                config[data_key] = data[data_key];
            }
        }
    }

    return { config, configInit }
}