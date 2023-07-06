import { reactive } from "vue";
import { getCategory } from "@/apis/info";

export function categoryHook() {
  const infoData = reactive({
    category_options: [],
  });

  const handlerGetCategory = () => {
    getCategory().then((response) => {
      infoData.category_options = response.data;
    });
  };

  return { infoData, handlerGetCategory };
}
