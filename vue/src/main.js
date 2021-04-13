import Vue from "vue";
import "./assets/css/reset.css"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "./router";
import store from "./store";
import app from "./App.vue";
import http from "./utils/http";


//根实例， 渲染根组件
Vue.use(ElementUI);
Vue.prototype.$http = http;
new Vue ({
        el: "#app",
        // render: h => h(App),
        components: {app},
        template: "<app />",
        router,
        store,
});