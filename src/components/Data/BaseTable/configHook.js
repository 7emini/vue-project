import { reactive } from "vue";

export function configHook() {
    // 经过处理后的表格配置
    const responseConfig = reactive({
        useSelection: true, // 是否使用批量选择
        usePagination: true, // 是否使用分页
        useBatchDelete: true, // 是否使用批量删除
        useSearch: true, // 是否使用搜索
        useActionRequest: false, //是否使用监听的方式请求数据，比如关闭了dialog后刷新表格数据
        isExpandAll:true, // 树形列表是否全部展开
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