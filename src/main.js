import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { fetchMe } from '@/assets/data/authState'

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

/* add icons to the library */
library.add(faArrowRotateRight);

fetchMe().finally(() => {
    // 在檢查完成後，才建立並掛載 Vue app
    const app = createApp(App);

    app.component("font-awesome-icon", FontAwesomeIcon);
    app.use(createPinia());
    app.use(router);
    app.use(ElementPlus);

    // 確保只掛載一次
    app.mount("#app");
});