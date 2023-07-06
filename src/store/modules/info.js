import { getCategory } from "@/apis/info";

const actions = {
  categoryAction() {
    return new Promise((resolve, reject) => {
      getCategory()
        .then((respone) => {
          resolve(respone.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
    namespaced: true,
    actions,
  };
