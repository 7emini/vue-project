export function formatResponseData(response, formData) {
    if(JSON.stringify(response) === "{}") {return false};
    const keys = Object.keys(response);
    const dataJson = {};
    for (let key in formData) {
        if (keys.includes(key) && formData.hasOwnProperty(key)) {
            dataJson[key] = response[key];
        }
    }
    return dataJson;
}