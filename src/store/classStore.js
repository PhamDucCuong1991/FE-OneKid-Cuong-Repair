// classStore.js
import Vue from 'vue';
import Vuex from 'vuex';
import MaClassService from "@/services/MaClassService";


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        serverDataClass: [],
        serverDataClassInGrade: [],
    },
    mutations: {
        setServerDataClass(state, classes) {
            state.serverDataClass = classes;
        },
        setServerDataClassInGrade(state, classInGrade) {
            state.serverDataClassInGrade = classInGrade;
        },
    },
    actions: {
        fetchDataClassFromServer({ commit }) {
          return  MaClassService.getAllClassCommon()

                .then(response => {
                    commit('serverDataClass', response.data);
                    console.log(response.data)
                })
                .catch(error => {
                    console.error(error);
                });
        },
        fetchDataClassInGradeFromServer({ commit },idGrade) {
          return MaClassService.getClassInGrade(idGrade)
                .then(response => {
                    commit('serverDataClassInGrade', response.data);
                    console.log(response.data)
                })
                .catch(error => {
                    console.error(error);
                });
        },

    },
    getters: {
        getServerDataClass: state => state.serverDataClass,
        getServerDataClassInGrade: state => state.serverDataClassInGrade,
    }
});
