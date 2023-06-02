import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    'en': {
        button: {
            action:"Action",
            insert: "Insert",
            save: "Save",
            update: "Update",
            delete: "Delete",
            close: "Close",
            view: "View",
            detail: "Detail",
            importFile: "Import File",
            exportFile: "Export File",
            OK:"OK"
        },
        welcomeMsg: 'Welcome to Your Vue.js App',
        guide: 'For a guide and recipes on how to configure / customize this project,',
        checkout: 'check out the',
        plugins: 'Installed CLI Plugins',
        links: 'Essential Links',
        ecosystem: 'Ecosystem'
    },
    'vn': {
        button: {
            action:"Tác vụ",
            insert: "Thêm mới",
            save: "Lưu",
            update: "Sửa",
            delete: "Xóa",
            close: "Đóng",
            view: "Xem",
            detail: "Chi tiết",
            importFile: "Nhập File",
            exportFile: "Xuất File",
            OK:"OK"
        },
        date: {

        },
        welcomeMsg: 'Chào mừng bạn đến với Ứng dụng Vue.js của bạn',
        guide: 'Để được hướng dẫn và công thức nấu ăn về cách định cấu hình / tùy chỉnh dự án này,',
        checkout: 'revisar la',
        plugins: 'Plugins de CLI instalados',
        links: 'Enlaces esenciales',
        ecosystem: 'Ecosistema',
        validate:{
            usernameAndPassword:"Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm"
        }
    }
};

const i18n = new VueI18n({
    locale: 'vn', // set locale
    fallbackLocale: 'es', // set fallback locale
    messages, // set locale messages
});

export default i18n;
