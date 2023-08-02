
export function rulesHook() {
    const initRules = (data) => {
        if (data.length === 0) { return [] }
        data.forEach(item => {
            let rulesArr = [];
            if (item.required && item.required === true) {
                let required_json = { required: true, message: item.message || messageType(item), trigger: "change" }
                rulesArr.push(required_json)
            }
            const rules = item.rules;

            if (rules && Array.isArray(rules)&& rules.length >0) {
                rulesArr = rulesArr.concat(rules);
            }

            item.rules = rulesArr;
        });
        return data;
    }


    const messageType = (data) => {
        let msg = "";
        switch (data.component) {
            case 'input':
                msg = "请输入";
                break;
            case "upload":
                msg = "请上传";
                break;
            case "checkbox":
            case "radio":
            case "select":
            case "cascader":
            case "date":
                msg = "请选择";
                break;
            default:
                msg = "未定义";
                break;
        }
        return `${msg}${data.label}`;
    }

    return { initRules }
}