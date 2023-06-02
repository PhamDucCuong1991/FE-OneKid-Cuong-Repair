import Vue from 'vue';
import Vuex from 'vuex';

import { auth } from './authmodule.js';
import { layout } from './layoutmodule.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        layout
    }
});
