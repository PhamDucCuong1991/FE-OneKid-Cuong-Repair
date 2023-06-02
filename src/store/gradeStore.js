// gradeStore.js
import Vue from 'vue';
import Vuex from 'vuex';
import GradeService from "@/services/GradeService";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        serverDataGrade: []
    },
    mutations: {
        setServerDataGrade(state, data) {
            state.serverDataGrade = data;
        }
    },
    actions: {
        fetchDataGradeFromServer({ commit }) {
            GradeService.getGradeInPrinciple()
                .then(response => {
                    commit('serverDataGrade', response.data);
                    console.log(response.data)
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },
    getters: {
        getServerDataGrade: state => state.serverDataGrade
    }
});
