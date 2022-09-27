import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'

import vco from "v-click-outside"
import VueApexCharts from 'vue-apexcharts'
import VueSweetalert2 from 'vue-sweetalert2';
import VueSlideBar from 'vue-slide-bar'
import Vuelidate from 'vuelidate'
import i18n from './i18n'
import store from '@/state/store'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

import App from './App.vue'
// As a plugin
import VueMask from 'v-mask'
Vue.config.productionTip = false

import * as VueGoogleMaps from "vue2-google-maps";
import Lightbox from 'vue-easy-lightbox'
import Axios from 'axios'
Vue.prototype.$axios = Axios

window.$http = "http://127.0.0.1:8000/api/"; //api/indicators
var CryptoJS = require("crypto-js");
var tokenString = "";

try {
    if (localStorage.user.trim() != "") {
        tokenString = CryptoJS.AES.decrypt(
                JSON.parse(localStorage.user).token,
                "mnopqr",
            )
            .toString(CryptoJS.enc.Utf8)
            .trim();
    }
} catch (e) {
    tokenString = "";
}
window.$tokenString = tokenString;
window.$headers = {
    Authorization: `Bearer ${window.$tokenString}`,
};
const token = localStorage.getItem("token");
console.log(token)
window.$headers = { Authorization: "Token " + token, };
Vue.use(Lightbox)
Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyAIH4XrdSkwiQlakBvmQMyKtqhwvLyeHeQ",
        libraries: "places"
    },
    installComponents: true
});

import { initFirebaseBackend } from './helpers/firebase/authUtils';

import { configureFakeBackend } from './helpers/fakebackend/fake-backend';

const firebaseConfig = {
    apiKey: process.env.VUE_APP_APIKEY,
    authDomain: process.env.VUE_APP_AUTHDOMAIN,
    databaseURL: process.env.VUE_APP_VUE_APP_DATABASEURL,
    projectId: process.env.VUE_APP_PROJECTId,
    storageBucket: process.env.VUE_APP_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
    appId: process.env.VUE_APP_APPId,
    measurementId: process.env.VUE_APP_MEASUREMENTID
};

if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
    initFirebaseBackend(firebaseConfig);
} else if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
    configureFakeBackend();
}

import '@/assets/scss/app.scss'

Vue.component('VueSlideBar', VueSlideBar)
Vue.use(BootstrapVue)
Vue.use(DatePicker)
Vue.use(vco)
Vue.component('apexchart', VueApexCharts)
Vue.use(Vuelidate)
Vue.use(VueSweetalert2);

Vue.use(require("vue-chartist"));
Vue.use(VueMask);

new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount('#app')