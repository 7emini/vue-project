import { ElMessageBox } from "element-plus";

const globalFunction = {};

globalFunction.deleteConfirm = (params) => {
  const defaultMessage = "确认删除当前数据吗？删除后无法恢复";
  const defaultTitle = "提示";
  ElMessageBox.confirm(params.message || defaultMessage, params.title || defaultTitle, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "warning",
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        const is_func = params.thenFun && Object.prototype.toString.call(params.thenFun) === "[object Function]";
        instance.confirmButtonLoading = is_func;
        is_func && params.thenFun().then(()=>{
            instance.confirmButtonLoading = false;
            done();
        }).catch(()=>{
            instance.confirmButtonLoading = false;
            done(); 
        })
      } else {
        done();
      }
    },
  }).catch((error) => {});
};

/**
 * 暴露方法
 */
export default {
    install(app) {
        app.config.globalProperties["deleteConfirm"] = globalFunction.deleteConfirm;
    }
}
