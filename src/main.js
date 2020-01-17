import "babel-polyfill"; // 引入垫片
import Vue from "vue";
import VueI18n from "vue-i18n";
import VueAnalytics from 'vue-analytics';

// import 'Directives'; // 全局注入指令（请使用局部注入）

// 引入样式reset
import "normalize.css";

// 引入插件
import router from "Plugins/router";
import store from "Plugins/store";
import inject from "Plugins/inject";
import "Plugins/icons";
import "Plugins/element";

// 引入国际化文件
import enLocale from "Locale/en.json";
import zhLocale from "Locale/zh-CN.json";
import eleEnLocale from "element-ui/lib/locale/lang/en";
import eleZhLocale from "element-ui/lib/locale/lang/zh-CN";
import ElementLocale from "element-ui/lib/locale";

// 引入根组件
import App from "./App";

// 可作为全局通信的载体,用于非父子关系的组件间的通信上，常见的业务一般都可以用vuex替代
window.GLOBAL = {};
window.GLOBAL.vbus = new Vue();

// 在Vue实例上挂载某些对象
Vue.use(inject);

// 引入国际化
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: store.state.global.language, // 设置默认使用语言
  messages: {
    en: Object.assign(eleEnLocale, enLocale),
    "zh-CN": Object.assign(eleZhLocale, zhLocale)
  }
});
ElementLocale.i18n((key, value) => i18n.t(key, value));

//引入谷歌分析
const isProd = process.env.NODE_ENV === 'production';
//区分kusama-cc3, icefrog, edgeware
let ua = 'UA-152561314-5';
let href = window.location && window.location.href;
if (href.indexOf('kusama') > -1) {
  ua = 'UA-152561314-3';
} else if (href.indexOf('icefrog') > -1) {
  ua = 'UA-152561314-4';
}
Vue.use(VueAnalytics, {
  id: ua,
  router,
  debug: {
    enabled: !isProd,
    sendHitTask: isProd
  }
})

// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
