import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuex from "vuex";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "@/language/vi.js";
import i18n from "@/language/i18n.js";
import FlagIcon from "vue-flag-icon";
locale.el.pagination.pagesize = "";
import moment from "moment";
import lodash from "lodash";
import {funcCommon} from '@/utils/functionCommon.js'
import {funcData} from '@/utils/DataCommon.js'
import {styleExcel} from '@/utils/styleExcel.js'
// import numeral from "numeral";
import browserDetect from "vue-browser-detect-plugin";
import VueCurrencyInput from "vue-currency-input";
import ElCurrencyInput from "@/components/ElCurrencyInput.vue";
import SpinnerCustom from "@/components/SpinnerCustom.vue";
import UploadExcelComponent from "@/views/import-export/UploadExcel.vue";

import store from "./store";
import "@/assets/style/CommonStyle.css";
Vue.config.productionTip = false;
Vue.use(ElementUI, { locale });
Vue.use(Vuex);
Vue.use(FlagIcon);
Vue.use(browserDetect);
Vue.component("ElCurrencyInput", ElCurrencyInput);
Vue.component("SpinnerCustom", SpinnerCustom);
Vue.component("UploadExcel", UploadExcelComponent);

import classStore from "@/store/classStore";
import gradeStore from "@/store/gradeStore";
const formatCurrency = {
  globalOptions: { currency: "VND", locale: "de", allowNegative: false },
};
Vue.use(VueCurrencyInput, formatCurrency);

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("DD/MM/YYYY");
  }
});
Vue.filter("formatTime", function(value) {
  if (value) {
    return moment(String(value), "HHmm").format("HH:mm");
  }
});
Vue.filter("formatDateTime", function(value) {
  if (value) {
    return moment(String(value)).format("HH:mm - DD/MM/YYYY");
  }
});
//format cũ chỉ cho trường hợp có giá trị khác 0
Vue.filter("formatCurrency", function(value) {
  if (value) {
    return new Intl.NumberFormat("de", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
});
//format cho trường hợp giá trị bằng 0 và khác 0
Vue.filter("formatCurrencyNew", function(value) {
  if (value) {
    return new Intl.NumberFormat("de", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }else{
    return 0;
  }
});
//format cho số cách nhau với hàng nghìn
Vue.filter("formatNumber", function(number) {
  if (number) {
    return number.toLocaleString("vi")
  }
});


new Vue({
  classStore,
  gradeStore,
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

//set file js
Vue.prototype.loda = lodash;
Vue.prototype.moment = moment;
//global variable for application
Vue.prototype.$pageLayoutDefault = "sizes, prev, pager, next";
Vue.prototype.$pageListDefault = [10, 25, 50, 10000];
Vue.prototype.$pageListDefaultNew = [25, 50, 100];
Vue.prototype.$pageListDefaultUser = [25, 50, 100, 500, 1000];
Vue.prototype.$pageSizeDefault = 10000;
Vue.prototype.$pageSizeDefaultNew = 25;
Vue.prototype.$pageTotalDefault = 10;

Vue.prototype.$tableMaxHeightMini = 400;
Vue.prototype.$tableMaxHeightSmallMini = 450;
Vue.prototype.$tableMaxHeightSmall = 500;
Vue.prototype.$tableMaxHeight = 600;
Vue.prototype.$tableMaxHeightRow = 150;
Vue.prototype.$tableLoadding = "Đang tải dữ liệu, vui lòng chờ...";
Vue.prototype.$tableEmpty = "Không có dữ liệu!!!";
Vue.prototype.$permissionDenied = "Bạn không có quyền thực hiện chức năng này";

//các hàm xử lý chung ở js
Vue.prototype.$funcCommon = funcCommon;
Vue.prototype.$funcData = funcData;
Vue.prototype.$styleExcel = styleExcel;

//get browser login
const VueBrowserDetect = {
  install: (Vue) => {
    let ua = window.navigator.userAgent;
    let browserObj = {};

    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    browserObj.isOpera =
      !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
    // Firefox 1.0+
    browserObj.isEdge = /Edge/.test(navigator.userAgent);
    browserObj.isFirefox = /Firefox/.test(navigator.userAgent);
    // Safari 3.0+
    /*eslint-disable */
    browserObj.isSafari =
      /constructor/i.test(window.HTMLElement) ||
      (function(p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(!window["safari"] || safari.pushNotification);
    /*eslint-ensable */
    // Internet Explorer 6-11
    browserObj.isIE = /*@cc_on!@*/ false || !!document.documentMode;
    // Edge 20+

    browserObj.isChrome = /Google Inc/.test(navigator.vendor);
    browserObj.isChromeIOS = /CriOS/.test(navigator.userAgent);
    browserObj.isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    browserObj.meta = browserSpecs();
    browserObj.meta.ua = ua;

    function browserSpecs() {
      /**
       * https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
       */
      var tem,
        M =
          ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
          ) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: "IE", version: tem[1] || "" };
      }
      if (M[1] === "Chrome") {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null)
          return { name: tem[1].replace("OPR", "Opera"), version: tem[2] };
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
      return { name: M[0], version: M[1] };
    }

    Vue.prototype.$browserDetect = browserObj;
  },
};

export default VueBrowserDetect;

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(VueBrowserDetect);
}
